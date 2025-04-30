import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { CreateTaskDTO, UpdateTaskDTO } from "@/contracts/task.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Task, TaskDocument } from "@/models/tasks.schema";
import { Model } from "mongoose";
import { Status } from "@/enum/status.enum";
import { SubTask } from "@/models/subTask";

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument> // Injeta o modelo da collection "Task"
    ) { }

    // Cria uma nova tarefa para o usuário
    async create(task: CreateTaskDTO, user: TokenPayloadSchema): Promise<CreateTaskDTO> {
        const { name, category, subCategory, subTask, priority, date } = task;
        const userId = user.sub;

        // Verifica se já existe uma tarefa com o mesmo nome, categoria e data para o usuário
        const existingTask = await this.taskModel.findOne({ name, category, date, userId });
        if (existingTask) throw new ConflictException("Essa task já existe");

        // Calcula o status com base na data da tarefa
        const today = new Date().toISOString().split('T')[0];
        const taskDateStr = new Date(date).toISOString().split('T')[0];

        let status: Status;
        if (taskDateStr === today) {
            status = Status.TODAY;
        } else if (taskDateStr < today) {
            status = Status.PENDING;
        } else {
            status = Status.FUTURE;
        }

        // Monta o objeto da tarefa
        const taskToCreate = {
            name,
            category,
            subCategory,
            priority,
            date,
            userId,
            status,
            subTask
        };

        // Cria e salva a tarefa no banco
        const createdTask = new this.taskModel(taskToCreate);
        await createdTask.save();

        return taskToCreate;
    }

    // Busca todas as tarefas do usuário, ordenadas por data
    async fetch(user: TokenPayloadSchema): Promise<CreateTaskDTO[]> {
        const userId = user.sub;
        return await this.taskModel.find({ userId }).sort({ date: 1 }).exec();
    }

    // Busca uma tarefa por ID
    async fetchById(taskId: string) {
        return await this.taskModel.findById(taskId).exec();
    }

    // Busca tarefas por página, 20 por vez
    async fetchByPage(user: TokenPayloadSchema, page: number): Promise<CreateTaskDTO[]> {
        const userId = user.sub;
        const limit = 20;
        const skip = (page - 1) * limit;

        return await this.taskModel.find({ userId }).sort({ date: 1 }).skip(skip).limit(limit).exec();
    }

    // Busca tarefas por nome, categoria, subcategoria ou data
    async fetchBySearch(query: string, user: TokenPayloadSchema): Promise<CreateTaskDTO[]> {
        const userId = user.sub;
        const regex = new RegExp(query, 'i'); // Busca insensível a maiúsculas/minúsculas
        const isDate = !isNaN(Date.parse(query)); // Verifica se é uma data válida

        const filters: any[] = [
            { name: { $regex: regex } },
            { category: { $regex: regex } },
            { subCategory: { $regex: regex } },
        ];

        // Se for uma data, adiciona filtro de intervalo para o dia
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

        return await this.taskModel.find({
            userId,
            $or: filters,
        });
    }

    // Atualiza dados de uma tarefa
    async update(taskId: string, task: UpdateTaskDTO) {
        const { name, category, priority, date, status, subCategory, subTask } = task;

        const existingTask = await this.taskModel.findById(taskId);
        if (!existingTask) throw new ConflictException("Essa task não existe");

        // Verifica duplicidade: outra tarefa do mesmo dia, nome e categoria
        const existingTaskName = await this.taskModel.findOne({
            name,
            category,
            date,
            userId: existingTask.userId
        });
        if (existingTaskName && existingTaskName._id.toString() !== taskId) {
            throw new ConflictException("Já existe uma tarefa com esse nome");
        }

        // Monta campos para atualização
        const taskToUpdate: any = {};
        if (name) taskToUpdate.name = name;
        if (category) taskToUpdate.category = category;
        if (priority) taskToUpdate.priority = priority;
        if (date) taskToUpdate.date = date;
        if (subCategory) taskToUpdate.subCategory = subCategory;

        // Atualiza subtarefas
        if (subTask) {
            const updatedSubTasks = existingTask.subTask ?? [];

            const finalSubTasks = subTask.map(newSub => {
                if (!newSub._id) {
                    const alreadyExists = updatedSubTasks.find(st => st.task === newSub.task);
                    if (alreadyExists) throw new ConflictException("Essa sub Tarefa já existe");

                    return {
                        task: newSub.task,
                        status: newSub.status
                    };
                } else {
                    const existingSub = updatedSubTasks.find(st => st._id?.toString() === newSub._id);
                    if (!existingSub) throw new ConflictException("Subtarefa não encontrada");

                    return {
                        _id: existingSub._id,
                        task: newSub.task,
                        status: newSub.status
                    };
                }
            });

            taskToUpdate.subTask = finalSubTasks;
        }

        // Atualiza status automaticamente baseado na data
        const today = new Date().toISOString().split('T')[0];
        const taskDateStr = new Date(date || existingTask.date).toISOString().split('T')[0];

        if (status !== undefined && status !== 'COMPLETED') {
            taskToUpdate.status = 'COMPLETED';
        } else {
            if (taskDateStr === today) {
                taskToUpdate.status = 'TODAY';
            } else if (taskDateStr < today) {
                taskToUpdate.status = 'PENDING';
            } else {
                taskToUpdate.status = 'FUTURE';
            }
        }

        // Salva alterações no banco
        return await this.taskModel.findByIdAndUpdate(taskId, taskToUpdate, { new: true }).exec();
    }

    // Atualiza os status de todas as tarefas do usuário com base na data
    async updateStatus(user: TokenPayloadSchema) {
        const userId = user.sub;
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

        // Executa atualização em lote
        if (tasksToUpdate.length > 0) {
            await this.taskModel.bulkWrite(tasksToUpdate);
        }

        return { message: 'Statuses atualizados com sucesso' };
    }

    // Remove uma subtarefa de uma tarefa
    async deleteSubTask(taskId: string, subTask: string) {
        const task = await this.taskModel.findById(taskId).exec();
        if (!task) throw new NotFoundException("Tarefa não encontrada");

        if (task.subTask) {
            const newSubTask = task.subTask.filter(task => task._id.toString() !== subTask);
            await this.taskModel.findByIdAndUpdate(taskId, { subTask: newSubTask }, { new: true }).exec();
        }

        return { message: "Subtarefa excluída com sucesso" };
    }

    // Deleta uma tarefa (verifica se pertence ao usuário)
    async delete(taskId: string, user: TokenPayloadSchema) {
        const userId = user.sub;

        const task = await this.taskModel.findById(taskId).exec();
        if (!task) throw new NotFoundException("Task não encontrada");

        if (task.userId.toString() !== userId) {
            throw new ForbiddenException("Você não tem permissão para excluir esta task");
        }

        await this.taskModel.findByIdAndDelete(taskId).exec();
        return { message: "Task excluída com sucesso" };
    }
}
