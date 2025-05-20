import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { CreateTaskDTO, UpdateTaskDTO } from "@/contracts/task.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Task, TaskDocument } from "@/models/tasks.schema";
import { Model } from "mongoose";
import { Status } from "@/enum/status.enum";
import e from "express";
import { boolean } from "zod";

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument> // Injeta o modelo da collection "Task"
    ) { }

    // Verifica se a tarefa existe, cria status e a tarefa
    async create(task: CreateTaskDTO, user: TokenPayloadSchema): Promise<CreateTaskDTO> {
        const { name, category, subCategory, subTask, priority, date, hours } = task;
        const userId = user.sub;

        // Verifica se já existe uma tarefa com o mesmo nome, categoria e data para o usuário
        await this.checkExistTaskByItens(name, category, date, userId, false)

        // Calcula o status com base na data da tarefa
        const status = await this.createStatus(date)

        // Monta o objeto da tarefa
        const taskToCreate = {
            name,
            category,
            subCategory,
            priority,
            date,
            userId,
            status,
            subTask,
            hours,
            notified: false
        };

        // Cria e salva a tarefa no banco
        const createdTask = new this.taskModel(taskToCreate);
        await createdTask.save();

        return taskToCreate;
    }

    // Busca todas as tarefas do usuário, ordenadas por data
    async fetchTasks(
        user: TokenPayloadSchema,
        options?: {
            page?: number;
            query?: string;
        }
    ): Promise<CreateTaskDTO[]> {
        const userId = user.sub;
        const limit = 20;
        const skip = options?.page && options.page > 0 ? (options.page - 1) * limit : 0;

        let filters: any = { userId };

        if (options?.query) {
            const query = options.query;
            const regex = new RegExp(query, 'i');
            const isDate = !isNaN(Date.parse(query));

            const orFilters: any[] = [
                { name: { $regex: regex } },
                { category: { $regex: regex } },
                { subCategory: { $regex: regex } },
            ];

            if (isDate) {
                const searchDate = new Date(query);
                const nextDay = new Date(searchDate);
                nextDay.setDate(searchDate.getDate() + 1);

                orFilters.push({
                    date: {
                        $gte: searchDate.toISOString(),
                        $lt: nextDay.toISOString(),
                    },
                });
            }

            filters = { userId, $or: orFilters };
        }

        const queryBuilder = this.taskModel.find(filters).populate('category').sort({ date: 1 });

        if (options?.page && options.page > 0) {
            queryBuilder.skip(skip).limit(limit);
        }

        return await queryBuilder.exec();
    }


    // Busca uma tarefa por ID
    async fetchById(taskId: string) {
        return await this.taskModel.findById(taskId).exec();
    }


    // Atualiza dados de uma tarefa, verifica se a tarefa existe, se ja existe alguma outra com aquele nome, atualiza status e subTarefas
    async update(taskId: string, task: UpdateTaskDTO) {
        const { name, category, priority, date, status, subCategory, subTask } = task;

        const existingTask = await this.checkExistTask(taskId);
        if (!existingTask) throw new ConflictException("Essa tarefa não existe");

        // Verifica duplicidade: outra tarefa do mesmo dia, nome e categoria
        let existingTaskByItem: any = null;
        if (name && category && date) {
            existingTaskByItem = await this.checkExistTaskByItens(
                name, category, date, existingTask.userId, true
            );
        }

        if (existingTaskByItem && existingTaskByItem._id.toString() !== taskId) {
            throw new ConflictException("Já existe uma tarefa com o mesmo nome, data e categoria");
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
                if (newSub._id) {
                    const existing = updatedSubTasks.find(st => st._id?.toString() === newSub._id);
                    if (!existing) throw new ConflictException("Subtarefa não encontrada");

                    return {
                        _id: existing._id,
                        task: newSub.task,
                        status: newSub.status
                    };
                }

                // Se for uma nova, verifica se já existe pelo nome
                const alreadyExistsByName = updatedSubTasks.find(
                    st => st.task.trim().toLowerCase() === newSub.task.trim().toLowerCase()
                );

                if (alreadyExistsByName) {
                    throw new ConflictException("Essa sub Tarefa já existe");
                }

                // Subtarefa nova
                return {
                    task: newSub.task,
                    status: newSub.status
                };
            });

            taskToUpdate.subTask = finalSubTasks;
        }


        // Atualiza status automaticamente baseado na data
        if (date && status) taskToUpdate.status = await this.updateStatusPrivate(date, status, true);

        // Salva alterações no banco
        return await this.taskModel.findByIdAndUpdate(taskId, taskToUpdate, { new: true });
    }

    // Atualiza os status de todas as tarefas do usuário com base na data, o que ja se repetiu anteriormente
    async updateStatus(user: TokenPayloadSchema) {
        const userId = user.sub;
        const allTasks = await this.taskModel.find({ userId });

        const tasksToUpdate = await Promise.all(
            allTasks.map(async (task) => {
                if (task.status !== "COMPLETED") {
                    const status = await this.updateStatusPrivate(task.date, task.status);
                    return {
                        updateOne: {
                            filter: { _id: task._id },
                            update: { status }
                        }
                    };
                }
                return null; // Retorna null para tarefas que não precisam atualizar
            })
        );

        // Filtra tarefas válidas
        const filteredTasks = tasksToUpdate.filter(task => task !== null);

        if (filteredTasks.length > 0) {
            await this.taskModel.bulkWrite(filteredTasks);
        }

        return { message: 'Status atualizados com sucesso' };
    }



    // Remove uma subtarefa de uma tarefa, verifica se a tarefa existe, se a sub tarefa existe antes de remover
    async deleteSubTask(taskId: string, subTask: string) {
        const task = await this.checkExistTask(taskId)

        if (task.subTask) {
            const newSubTask = task.subTask.filter(task => task._id.toString() !== subTask);
            await this.taskModel.findByIdAndUpdate(taskId, { subTask: newSubTask }, { new: true });
        }

        return { message: "Subtarefa excluída com sucesso" };
    }

    // Deleta uma tarefa (verifica se pertence ao usuário) e se ela existe
    async delete(taskId: string) {
        await this.checkExistTask(taskId)

        await this.taskModel.findByIdAndDelete(taskId);
        return { message: "Task excluída com sucesso" };
    }

    private async checkExistTaskByItens(name: string, category: string, date: Date, userId: string, update: boolean) {
        const existingTask = await this.taskModel.findOne({ name, category, date, userId });
        if (existingTask && !update) throw new ConflictException("Essa tarefa já existe");
        return existingTask
    }

    private async checkExistTask(taskId: string) {
        const task = await this.taskModel.findById(taskId);
        if (!task) throw new NotFoundException("Tarefa não encontrada");
        return task
    }

    private async createStatus(date: Date) {
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

        return status
    }

    private async updateStatusPrivate(date: Date, status: string, update?: boolean) {
        const today = new Date().toISOString().split('T')[0];
        const taskDateStr = new Date(date).toISOString().split('T')[0];

        if (status !== undefined && status !== 'COMPLETED' && update) {
            status = 'COMPLETED';
        } else {
            if (taskDateStr === today) {
                status = 'TODAY';
            } else if (taskDateStr < today) {
                status = 'PENDING';
            } else {
                status = 'FUTURE';
            }
        }

        return status
    }

}
