import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotificationsService } from '@/services/notifications.service';
import { getQueueToken } from '@nestjs/bull';

// Crie um mock da fila
const mockQueue = {
    add: jest.fn(),
};

describe('NotificationsService', () => {
    let service: NotificationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationsService,
                { provide: getQueueToken('push-notifications'), useValue: mockQueue },
                { provide: getModelToken('Notification'), useValue: {} }, // mock do NotificationModel
                { provide: getModelToken('Task'), useValue: {} }, // mock do TaskModel
            ],
        }).compile();

        service = module.get<NotificationsService>(NotificationsService);
    });

    it('deve adicionar notificação à fila', async () => {
        const payload = {
            title: 'Teste',
            body: 'Mensagem',
        };

        await service.sendPushNotificationToQueue('user123', payload);

        expect(mockQueue.add).toHaveBeenCalledWith({ userId: 'user123', payload });
    });
});
