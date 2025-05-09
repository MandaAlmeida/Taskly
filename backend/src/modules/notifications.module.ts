import { NotificationsController } from '@/controllers/notifications.controller';
import { NotificationsGateway } from '@/gateway/notifications.gateway';
import { Notification, NotificationSchema } from '@/models/notification.schema';
import { NotificationsService } from '@/services/notifications.service';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Notification.name, schema: NotificationSchema },
        ]),
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationsGateway],
    exports: [NotificationsService, NotificationsGateway],
})
export class NotificationModule { }
