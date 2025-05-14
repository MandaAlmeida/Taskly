import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AnnotationsService } from '@/services/annotation.service';
import { UploadService } from '@/services/upload.service';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';

const mockAnnotationModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
};

const mockUploadService = {
    upload: jest.fn(),
};

describe('AnnotationsService', () => {
    let service: AnnotationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnnotationsService,
                {
                    provide: getModelToken('Annotation'),
                    useValue: mockAnnotationModel,
                },
                {
                    provide: UploadService,
                    useValue: mockUploadService,
                },
            ],
        }).compile();

        service = module.get<AnnotationsService>(AnnotationsService);
    });

    afterEach(() => jest.clearAllMocks());

    describe('create', () => {
        it('should create an annotation with uploaded files', async () => {
            const userId = 'user123';
            const dto = {
                title: 'Note',
                category: 'general',
                content: [{ type: 'text', value: 'Test' }, { type: 'image', value: '' }],
                members: [],
            };
            const files = [{ originalname: 'image.png' }] as any;
            const attachments = [{ originalname: 'file.pdf' }] as any;

            mockAnnotationModel.findOne.mockResolvedValueOnce(null);
            mockUploadService.upload.mockResolvedValueOnce({ url: 'image-url' });
            mockUploadService.upload.mockResolvedValueOnce({ url: 'file-url' });
            mockAnnotationModel.create.mockResolvedValueOnce({ ...dto, createdUserId: userId });

            const result = await service.create(userId, dto, files, attachments);

            expect(mockAnnotationModel.create).toHaveBeenCalled();
            expect(result.createdUserId).toBe(userId);
        });

        it('should throw conflict if annotation with same title exists', async () => {
            mockAnnotationModel.findOne.mockResolvedValueOnce({ _id: 'someId' });

            await expect(
                service.create('user1', { title: 'test', category: 'cat', content: [], members: [] }),
            ).rejects.toThrow(ConflictException);
        });

        it('should throw conflict on duplicate members', async () => {
            mockAnnotationModel.findOne.mockResolvedValueOnce(null);

            await expect(
                service.create('user1', {
                    title: 'test',
                    category: 'cat',
                    content: [],
                    members: [
                        { userId: 'a', name: 'John', accessType: 'VIEW' },
                        { userId: 'a', name: 'John', accessType: 'VIEW' },
                    ],
                }),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('findById', () => {
        it('should return annotation if found', async () => {
            const annotation = { _id: '1', title: 'Note' };
            mockAnnotationModel.findById.mockResolvedValueOnce(annotation);

            const result = await service.findById('1');
            expect(result).toBe(annotation);
        });

        it('should throw NotFoundException if not found', async () => {
            mockAnnotationModel.findById.mockResolvedValueOnce(null);
            await expect(service.findById('999')).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete and return annotation', async () => {
            mockAnnotationModel.findByIdAndDelete.mockResolvedValueOnce({ _id: '1', title: 'Deleted' });
            const result = await service.delete('1');
            expect(result.title).toBe('Deleted');
        });

        it('should throw if annotation not found', async () => {
            mockAnnotationModel.findByIdAndDelete.mockResolvedValueOnce(null);
            await expect(service.delete('999')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an annotation', async () => {
            const id = '123';
            const userId = 'user123';
            const dto = {
                title: 'Updated Title',
                content: [],
                category: 'general',
            };
            mockAnnotationModel.findByIdAndUpdate.mockResolvedValueOnce({ _id: id, ...dto });

            const result = await service.update(id, userId, dto);
            expect(result.title).toBe(dto.title);
        });

        it('should throw if annotation not found', async () => {
            mockAnnotationModel.findByIdAndUpdate.mockResolvedValueOnce(null);
            await expect(service.update('999', 'user1', { title: 'A', content: [], category: 'cat' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('addMember', () => {
        it('should add a new member', async () => {
            const id = '123';
            const dto = [{ userId: 'newUser', name: 'New', accessType: 'VIEW' }];
            const annotation = {
                _id: id,
                members: [{ userId: 'existing' }],
                save: jest.fn().mockResolvedValue(true),
            };

            mockAnnotationModel.findById.mockResolvedValueOnce(annotation);
            const result = await service.addMember(id, annotation._id, dto);

            expect(annotation.members).toContainEqual(dto);
            expect(result).toBe(annotation);
        });

        it('should throw if member already exists', async () => {
            const id = '123';
            const dto = [{ userId: 'existing', name: 'Exist', accessType: 'VIEW' }];
            const annotation = {
                _id: id,
                members: [{ userId: 'existing' }],
                save: jest.fn().mockResolvedValue(true),
            };
            mockAnnotationModel.findById.mockResolvedValueOnce(annotation);
            await expect(service.addMember(id, annotation._id, dto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findByGroupId', () => {
        it('should return annotations paginated', async () => {
            mockAnnotationModel.find.mockReturnValueOnce({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValueOnce([{ title: 'A' }, { title: 'B' }]),
            });
            mockAnnotationModel.countDocuments.mockResolvedValueOnce(2);

            const result = await service.findByGroupId('group1', 1);
            expect(result.annotations.length).toBe(2);
            expect(result.totalPages).toBe(2);
        });
    });

    describe('createByGroup', () => {
        it('should create an annotation linked to a group', async () => {
            const userId = { sub: 'user' };
            const groupId = 'group';
            const dto = {
                title: 'Group Note',
                category: 'group',
                content: [],
                members: [],
            };

            mockAnnotationModel.findOne.mockResolvedValueOnce(null);
            mockAnnotationModel.create.mockResolvedValueOnce({ ...dto, groupId, createdUserId: userId });

            const result = await service.createByGroup(dto, groupId, userId);
            expect(result).toBe(groupId);
            expect(result.createdUserId).toBe(userId);
        });
    });

    describe('updateByGroup', () => {
        it('should update an annotation linked to a group', async () => {
            const annotationId = 'ann123';
            const groupId = 'group';
            const dto = { title: 'New Title', content: [], category: 'update' };

            mockAnnotationModel.findByIdAndUpdate.mockResolvedValueOnce({ _id: annotationId, ...dto });

            const result = await service.updateByGroup(annotationId, groupId, dto);
            expect(result.title).toBe(dto.title);
        });
    });
});
