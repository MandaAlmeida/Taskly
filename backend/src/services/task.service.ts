import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { CreateTaskDTO, UpdateTaskDTO } from "@/contracts/task.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Task, TaskDocument } from "@/models/tasks.schema";
import { Model } from "mongoose";
import { Status } from "@/enum/status.enum";
import { SubCategory } from "@/models/subCategory.schema";

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>
    ) { }

    async create(task: CreateTaskDTO, user: TokenPayloadSchema): Promise<CreateTaskDTO> {
        const { name, category, subCategory, priority, date } = task;

        const { sub: userId } = user;
        const existingTask = await this.taskModel.findOne({ name, category, date, userId });

        if (existingTask) {
            throw new ConflictException("Essa task já existe");
        }

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const taskDateStr = new Date(date).toISOString().split('T')[0];

        // Define o status baseado na data
        let status: Status;
        if (taskDateStr === todayStr) {
            status = Status.TODAY;
        } else if (taskDateStr < todayStr) {
            status = Status.PENDING;
        } else {
            status = Status.FUTURE;
        }

        const taskToCreate = {
            name,
            category,
            subCategory,
            priority,
            date,
            userId,
            status
        };

        const createdTask = new this.taskModel(taskToCreate);
        await createdTask.save();

        return taskToCreate;
    }

    async fetch(user: TokenPayloadSchema): Promise<CreateTaskDTO[]> {
        const { sub: userId } = user;
        return await this.taskModel.find({ userId }).sort({ date: 1 }).exec();
    }

    async fetchById(taskId: string) {
        return await this.taskModel.findById(taskId).exec();
    }

    async fetchByPage(user: TokenPayloadSchema, page: number): Promise<CreateTaskDTO[]> {
        const { sub: userId } = user;

        const limit = 20;
        const skip = (page - 1) * limit;
        return await this.taskModel.find({ userId }).sort({ date: 1 }).skip(skip).limit(limit).exec();
    }

    async fetchBySearch(query: string, user: TokenPayloadSchema): Promise<CreateTaskDTO[]> {
        const { sub: userId } = user;
        const regex = new RegExp(query, 'i');
        const isDate = !isNaN(Date.parse(query));
        const filters: any[] = [
            { name: { $regex: regex } },
            { category: { $regex: regex } },
            { subCategory: { $regex: regex } },
        ];

        if (isDate) {
            const searchDate = new Date(query);
            const nextDay = new Date(searchDate);
            nextDay.setDate(searchDate.getDate() + 1);

            filters.push({
                date: {
                    $gte: searchDate.toISOString(),
                    $lt: nextDay.toISOString(),
                },
            });
        }

        const tasks = await this.taskModel.find({
            userId,
            $or: filters,
        });

        return tasks;
    }

    async update(taskId: string, task: UpdateTaskDTO, user: TokenPayloadSchema) {
        const { name, category, priority, date, status } = task;
        const { sub: userId } = user;

        const existingTask = await this.taskModel.findById(taskId);
        if (!existingTask) {
            throw new ConflictException("Essa task não existe");
        }
        if (existingTask.userId !== userId) {
            throw new ConflictException("Voce nao tem acesso a essa tarefa");
        }

        const existingTaskName = await this.taskModel.findOne({ name, category, date, userId });

        if (existingTaskName?._id.toString() !== taskId) {
            throw new ConflictException("Ja existe uma subcategoria com esse nome");
        }

        const taskToUpdate: any = {};

        if (name) taskToUpdate.name = name;
        if (category) taskToUpdate.category = category;
        if (priority) taskToUpdate.priority = priority;

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        if (status !== 'COMPLETED') {
            taskToUpdate.status = 'COMPLETED';
        } else {
            const taskDateStr = new Date(date || existingTask.date).toISOString().split('T')[0];

            if (taskDateStr === todayStr) {
                taskToUpdate.status = 'TODAY';
            } else if (taskDateStr < todayStr) {
                taskToUpdate.status = 'PENDING';
            } else {
                taskToUpdate.status = 'FUTURE';
            }
        }

        if (date) {
            taskToUpdate.date = date;
        }

        const updatedTask = await this.taskModel.findByIdAndUpdate(
            taskId,
            taskToUpdate,
            { new: true }
        ).exec();

        return updatedTask;

    }

    async updateStatus(user: TokenPayloadSchema) {
        const { sub: userId } = user;
        const today = new Date().toISOString().split('T')[0];

        const allTasks = await this.taskModel.find({ userId });

        const tasksToUpdate = allTasks.map(task => {
            const taskDate = new Date(task.date).toISOString().split('T')[0];

            let status = task.status;

            if (task.status !== 'COMPLETED') {
                if (taskDate === today) {
                    status = Status.TODAY;
                } else if (taskDate < today) {
                    status = Status.PENDING;
                } else {
                    status = Status.FUTURE;
                }
            }

            return {
                updateOne: {
                    filter: { _id: task._id },
                    update: { status }
                }
            };
        });

        if (tasksToUpdate.length > 0) {
            await this.taskModel.bulkWrite(tasksToUpdate);
        }

        return { message: 'Statuses updated successfully' };
    }

    async delete(taskId: string, user: TokenPayloadSchema) {
        const { sub: userId } = user;

        const task = await this.taskModel.findById(taskId).exec();

        if (!task) {
            throw new NotFoundException("Task não encontrada");
        }

        // Verifica se o usuário é o dono da task
        if (task.userId.toString() !== userId) {
            throw new ForbiddenException("Você não tem permissão para excluir esta task");
        }

        // Se for o dono, pode deletar
        await this.taskModel.findByIdAndDelete(taskId).exec();

        return { message: "Task excluída com sucesso" };
    }

}