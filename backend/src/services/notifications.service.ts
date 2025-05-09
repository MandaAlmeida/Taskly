import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { CreateNotificationDto } from "@/contracts/notification.dto";
import { Notification, NotificationDocument } from "@/models/notification.schema";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>
    ) { }

    async create(notification: CreateNotificationDto): Promise<Notification> {
        const newNotification = new this.notificationModel(notification);
        return await newNotification.save();
    }

    async fetch(user: TokenPayloadSchema, page: number) {
        const userId = user.sub

        const limit = 10;
        const skip = (page - 1) * limit;
        const notification = await this.notificationModel.find({ userId }).sort({
            createdAt: -1
        }).skip(skip).limit(limit).exec();

        return notification
    }

    async updateStatusViewAll(user: TokenPayloadSchema) {
        const userId = user.sub
        const notification = await this.notificationModel.updateMany({ userId }, { $set: { status: true } }).exec();
        return notification;
    }

    async updateStatusView(user: TokenPayloadSchema, notificationId: string, status: boolean) {
        const userId = user.sub
        const existNotification = await this.notificationModel.findById(notificationId);

        if (!existNotification) throw new NotFoundException(`Essa notificação não existe.`)
        if (existNotification.userId.toString() !== userId) throw new NotFoundException(`Você não tem permissão para editar essa notificação`);

        const notification = await this.notificationModel.findByIdAndUpdate(notificationId, { $set: { status } }, { new: true }).exec();
        return notification;
    }

    async delete(user: TokenPayloadSchema, notificationId: string) {
        const userId = user.sub
        const existNotification = await this.notificationModel.findById(notificationId);

        if (!existNotification) throw new NotFoundException(`Essa notificação não existe.`)
        if (existNotification.userId.toString() !== userId) throw new NotFoundException(`Você não tem permissão para editar essa notificação`);

        await this.notificationModel.findByIdAndDelete(notificationId).exec();
        return "Notificação deletada com sucesso";
    }
}