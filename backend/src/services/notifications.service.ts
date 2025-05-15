import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { CreateNotificationDto } from "@/contracts/notification.dto";
import { Notification, NotificationDocument } from "@/models/notification.schema";
import { Task, TaskDocument } from "@/models/tasks.schema";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import { Model } from "mongoose";
import { InjectQueue } from "@nestjs/bull";
import { Queue as BullQueue } from "bull";

@Injectable()
export class NotificationsService {
    constructor(
        @InjectQueue('push-notifications') private pushNotificationQueue: BullQueue,
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    ) { }

    // Cria a notificacao 
    async create(notification: CreateNotificationDto): Promise<Notification> {
        const newNotification = new this.notificationModel(notification);
        return await newNotification.save();
    }

    // Busca as notificacoes no banco pelo usuario e devolve dividido por pagina
    async fetch(user: TokenPayloadSchema, page: number) {
        const userId = user.sub;
        const limit = 10;
        const skip = (page - 1) * limit;

        const notification = await this.notificationModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        return notification;
    }

    // atualiza status das notificacoes todas
    async updateStatusViewAll(user: TokenPayloadSchema) {
        const userId = user.sub;
        const notification = await this.notificationModel.updateMany({ userId }, { $set: { status: true } }).exec();
        return notification;
    }

    // de apenas uma notificacao, caso o usuario queira colocar ela como nao vista
    async updateStatusView(user: TokenPayloadSchema, notificationId: string, status: boolean) {
        const userId = user.sub;
        const existNotification = await this.notificationModel.findById(notificationId);

        if (!existNotification) throw new NotFoundException(`Essa notificação não existe.`);
        if (existNotification.userId.toString() !== userId) throw new NotFoundException(`Você não tem permissão para editar essa notificação`);

        const notification = await this.notificationModel.findByIdAndUpdate(notificationId, { $set: { status } }, { new: true }).exec();
        return notification;
    }

    // exclui a notificacao, verifica se ela existe
    async delete(user: TokenPayloadSchema, notificationId: string) {
        const userId = user.sub;
        const existNotification = await this.notificationModel.findById(notificationId);

        if (!existNotification) throw new NotFoundException(`Essa notificação não existe.`);
        if (existNotification.userId.toString() !== userId) throw new NotFoundException(`Você não tem permissão para editar essa notificação`);

        await this.notificationModel.findByIdAndDelete(notificationId).exec();
        return "Notificação deletada com sucesso";
    }

    async sendPushNotificationToQueue(userId: string, payload: any) {
        // Adiciona a tarefa na fila
        await this.pushNotificationQueue.add({
            userId,
            payload,
        });
    }

    // notificacao push
    // Agendar a verificação das tarefas que vencerão em breve
    @Cron("0 * * * * *") // Verificar tarefas vencidas a cada minuto
    async checkTaskDueNotifications() {
        const tasksToNotify = await this.taskModel.find({
            status: 'TODAY',
            notified: { $ne: true }, // Verifica as tarefas que ainda não foram notificadas
        }).exec();

        // Defina a variável now aqui
        const now = new Date(); // Agora o 'now' está definido como a data/hora atual

        for (const task of tasksToNotify) {
            const taskDate = task.date;
            const taskHours = task.hours;

            if (!taskHours) continue;

            const [hours, minutes] = taskHours.split(":").map(Number);
            const taskDueDate = new Date(taskDate);
            taskDueDate.setHours(hours, minutes, 0, 0);

            const thirtyMinutesBefore = new Date(taskDueDate.getTime() - 30 * 60000);

            // Comparar 'now' com as variáveis 'thirtyMinutesBefore' e 'taskDueDate'
            if (now >= thirtyMinutesBefore && now < taskDueDate) {
                const payload = {
                    title: `Sua tarefa está prestes a vencer!`,
                    body: `A tarefa "${task.name}" vai vencer em breve.`,
                };

                try {
                    // Envia a notificação para a fila
                    await this.sendPushNotificationToQueue(task.userId, payload);

                    // Marcar a tarefa como notificada
                    await this.taskModel.findByIdAndUpdate(task._id, { notified: true }).exec();
                } catch (error) {
                    console.error('Erro ao adicionar notificação na fila:', error);
                }
            }
        }
    }
}
