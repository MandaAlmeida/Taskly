import { NotificationsController } from '@/controllers/notifications.controller';
import { NotificationsGateway } from '@/gateway/notifications.gateway';
import { Notification, NotificationSchema } from '@/models/notification.schema';
import { NotificationsService } from '@/services/notifications.service';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './task.module';
import { PushToken, PushTokenSchema } from '@/models/saveToken.schema';
import { FirebaseService } from '@/services/firebase.service';
import { PushTokenRepository } from '@/database/push-token.repository';
import { NotificationsProcessor } from '@/processor/notifications.processor';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Notification.name, schema: NotificationSchema },
        ]),
        BullModule.registerQueue({
            name: 'push-notifications', // nome da fila
        }),
        MongooseModule.forFeature([{ name: PushToken.name, schema: PushTokenSchema }]),
        ScheduleModule.forRoot(),  // Ativa o agendador de tarefas
        TaskModule
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationsGateway, FirebaseService, PushTokenRepository, NotificationsProcessor],
    exports: [NotificationsService, NotificationsGateway],
})
export class NotificationModule { }
