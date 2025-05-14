import { PushTokenRepository } from '@/database/push-token.repository';
import { FirebaseService } from '@/services/firebase.service';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';


@Processor('push-notifications')
export class NotificationsProcessor {
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly pushTokenRepository: PushTokenRepository,
    ) { }

    @Process()
    async handlePushNotification(job: Job) {
        const { userId, payload } = job.data;

        // Buscar o token do usuário
        const token = await this.pushTokenRepository.findByUserId(userId);

        if (!token) {
            console.warn(`Token não encontrado para usuário ${userId}`);
            return;
        }

        try {
            // Enviar notificação
            await this.firebaseService.sendPushNotification(token, payload);
            console.log(`Notificação enviada para o usuário ${userId}`);
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
        }
    }
}
