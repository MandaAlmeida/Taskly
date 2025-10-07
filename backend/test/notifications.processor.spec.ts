import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseService } from '@/services/firebase.service';
import { PushTokenRepository } from '@/database/push-token.repository';
import { Job } from 'bull';
import { NotificationsProcessor } from '@/processor/notifications.processor';

describe('NotificationsProcessor', () => {
    let processor: NotificationsProcessor;

    // Tipagens corretas para os métodos mockados
    let firebaseService: { sendPushNotification: jest.Mock };
    let pushTokenRepository: { findByUserId: jest.Mock };

    beforeEach(async () => {
        firebaseService = {
            sendPushNotification: jest.fn(),
        };

        pushTokenRepository = {
            findByUserId: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationsProcessor,
                { provide: FirebaseService, useValue: firebaseService },
                { provide: PushTokenRepository, useValue: pushTokenRepository },
            ],
        }).compile();

        processor = module.get<NotificationsProcessor>(NotificationsProcessor);
    });

    it('deve processar uma notificação e enviá-la', async () => {
        const job = {
            data: {
                userId: '123',
                payload: {
                    title: 'Notificação Teste',
                    body: 'Isso é um teste!',
                },
            },
        } as Job;

        pushTokenRepository.findByUserId.mockResolvedValue('user-push-token');
        firebaseService.sendPushNotification.mockResolvedValue(undefined);

        await processor.handlePushNotification(job);

        expect(pushTokenRepository.findByUserId).toHaveBeenCalledWith('123');
        expect(firebaseService.sendPushNotification).toHaveBeenCalledWith(
            'user-push-token',
            job.data.payload,
        );
    });
});
