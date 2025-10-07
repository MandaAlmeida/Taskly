import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '@/services/notifications.service';
import { NotFoundException } from '@nestjs/common';
import { NotificationsController } from '@/controllers/notifications.controller';

describe('NotificationsController', () => {
    let controller: NotificationsController;
    let service: NotificationsService;

    const mockUser = { sub: 'user-id-123' };
    const mockNotification = { _id: 'notif-id', message: 'Mensagem', status: false };

    const mockNotificationsService = {
        fetch: jest.fn(),
        updateStatusViewAll: jest.fn(),
        updateStatusView: jest.fn(),
        delete: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NotificationsController],
            providers: [
                {
                    provide: NotificationsService,
                    useValue: mockNotificationsService,
                },
            ],
        }).compile();

        controller = module.get<NotificationsController>(NotificationsController);
        service = module.get<NotificationsService>(NotificationsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call fetch and return notifications', async () => {
        mockNotificationsService.fetch.mockResolvedValue([mockNotification]);

        const result = await controller.fetch(mockUser, 1);

        expect(service.fetch).toHaveBeenCalledWith(mockUser, 1);
        expect(result).toEqual([mockNotification]);
    });

    it('should update all notifications as viewed', async () => {
        mockNotificationsService.updateStatusViewAll.mockResolvedValue({ modifiedCount: 5 });

        const result = await controller.updateViewAll(mockUser);

        expect(service.updateStatusViewAll).toHaveBeenCalledWith(mockUser);
        expect(result).toEqual({ modifiedCount: 5 });
    });

    it('should update a specific notification status', async () => {
        mockNotificationsService.updateStatusView.mockResolvedValue({ ...mockNotification, status: true });

        const result = await controller.updateView(mockUser, 'notif-id', true);

        expect(service.updateStatusView).toHaveBeenCalledWith(mockUser, 'notif-id', true);
        expect(result?.status).toBe(true);
    });

    it('should delete a notification', async () => {
        mockNotificationsService.delete.mockResolvedValue("Notificação deletada com sucesso");

        const result = await controller.deleteFile(mockUser, 'notif-id');

        expect(service.delete).toHaveBeenCalledWith(mockUser, 'notif-id');
        expect(result).toBe("Notificação deletada com sucesso");
    });
});
