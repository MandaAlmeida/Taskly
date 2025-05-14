import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Task } from '@/models/tasks.schema';
import { Status } from '@/enum/status.enum';
import { TaskService } from '@/services/task.service';

const mockUser = { sub: 'user123' };

const mockTaskDto = {
    name: 'Estudar NestJS',
    category: 'Estudos',
    subCategory: 'Backend',
    priority: 'Alta',
    date: new Date(),
    subTask: [],
    hours: '2',
};

const mockTaskDoc = {
    _id: 'task123',
    userId: 'user123',
    ...mockTaskDto,
};

// Instância retornada ao usar `new this.taskModel(...)`
const mockSave = jest.fn().mockResolvedValue(mockTaskDoc);
const mockModelInstance = { save: mockSave };

// Modelo mockado com métodos estáticos + construtor
const taskModelMock = Object.assign(
    jest.fn().mockImplementation(() => mockModelInstance),
    {
        findOne: jest.fn(),
        findById: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        bulkWrite: jest.fn(),
        create: jest.fn(),
    }
);

describe('TaskService', () => {
    let service: TaskService;
    let model: typeof taskModelMock;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskService,
                {
                    provide: getModelToken(Task.name),
                    useValue: taskModelMock,
                },
            ],
        }).compile();

        service = module.get<TaskService>(TaskService);
        model = module.get(getModelToken(Task.name));

        jest.clearAllMocks(); // limpa mocks entre testes
    });

    it('should create a task', async () => {
        model.findOne.mockResolvedValue(null);

        const result = await service.create(mockTaskDto, mockUser);
        expect(result).toHaveProperty('name', mockTaskDto.name);
        expect(model.findOne).toHaveBeenCalled();
        expect(mockSave).toHaveBeenCalled();
    });

    it('should not create a duplicate task', async () => {
        model.findOne.mockResolvedValue(mockTaskDoc);
        await expect(service.create(mockTaskDto, mockUser)).rejects.toThrow(ConflictException);
    });

    it('should fetch all tasks', async () => {
        model.find.mockReturnValue({
            sort: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([mockTaskDoc]),
            }),
        });

        const tasks = await service.fetch(mockUser);
        expect(tasks).toHaveLength(1);
    });

    it('should fetch task by ID', async () => {
        model.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockTaskDoc),
        });

        const task = await service.fetchById('task123');
        expect(task).toEqual(mockTaskDoc);
    });

    it('should update task', async () => {
        model.findById.mockResolvedValue(mockTaskDoc);
        model.findOne.mockResolvedValue(null);
        model.findByIdAndUpdate.mockResolvedValue({ ...mockTaskDoc, name: 'Updated' });

        const updated = await service.update('task123', { name: 'Updated' });
        expect(updated?.name).toBe('Updated');
    });

    it('should not update non-existing task', async () => {
        model.findById.mockResolvedValue(null);
        await expect(service.update('task123', { name: 'Updated' })).rejects.toThrow(ConflictException);
    });

    it('should delete a task', async () => {
        model.findById.mockResolvedValue(mockTaskDoc);
        model.findByIdAndDelete.mockResolvedValue({});

        const result = await service.delete('task123', mockUser);
        expect(result.message).toBe('Task excluída com sucesso');
    });

    it('should not delete if user does not match', async () => {
        model.findById.mockResolvedValue({ ...mockTaskDoc, userId: 'otherUser' });
        await expect(service.delete('task123', mockUser)).rejects.toThrow(ForbiddenException);
    });

    it('should update status of all tasks', async () => {
        model.find.mockResolvedValue([mockTaskDoc]);
        model.bulkWrite.mockResolvedValue({});

        const result = await service.updateStatus(mockUser);
        expect(result.message).toBe('Statuses atualizados com sucesso');
    });

    it('should delete a subtask', async () => {
        model.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue({
                ...mockTaskDoc,
                subTask: [{ _id: 'sub1', task: 'Sub' }],
            }),
        });

        model.findByIdAndUpdate.mockResolvedValue({});

        const result = await service.deleteSubTask('task123', 'sub1');
        expect(result.message).toBe('Subtarefa excluída com sucesso');
    });
});
