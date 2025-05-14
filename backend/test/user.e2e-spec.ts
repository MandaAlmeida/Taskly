import { Test, TestingModule } from '@nestjs/testing';

import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { ConflictException, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { User } from '@/models/user.schema';
import { Categories } from '@/models/category.schema';
import { Task } from '@/models/tasks.schema';
import { SubCategory } from '@/models/subCategory.schema';
import { Group } from '@/models/groups.schema';
import { Annotation } from '@/models/annotations.schema';
import { hash } from 'bcryptjs';
import { UserService } from '@/services/user.service';
import { UploadService } from '@/services/upload.service';
import { AnnotationsService } from '@/services/annotation.service';

describe('UserService', () => {
    let service: UserService;

    const mockUserModel = {
        findOne: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        deleteMany: jest.fn(),
        create: jest.fn(),
        exec: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    const mockUploadService = {
        upload: jest.fn(),
        delete: jest.fn(),
    };

    const mockAnnotationsService = {
        fetchByUser: jest.fn(),
        deleteAnnotation: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: getModelToken(User.name), useValue: mockUserModel },
                { provide: getModelToken(Categories.name), useValue: mockUserModel },
                { provide: getModelToken(Task.name), useValue: mockUserModel },
                { provide: getModelToken(SubCategory.name), useValue: mockUserModel },
                { provide: getModelToken(Group.name), useValue: mockUserModel },
                { provide: getModelToken(Annotation.name), useValue: mockUserModel },
                { provide: JwtService, useValue: mockJwtService },
                { provide: UploadService, useValue: mockUploadService },
                { provide: AnnotationsService, useValue: mockAnnotationsService },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should throw if passwords do not match', async () => {
            const dto = {
                name: 'John Doe',
                email: 'test@test.com',
                userName: 'johndoe',
                birth: '2000-01-01',
                password: '123456',
                passwordConfirmation: '654321',
            };

            await expect(service.create(dto, undefined)).rejects.toThrow(BadRequestException);
        });

        it('should throw if email already exists', async () => {
            mockUserModel.findOne.mockResolvedValueOnce(true);

            const dto = {
                name: 'John Doe',
                email: 'test@test.com',
                userName: 'johndoe',
                birth: '2000-01-01',
                password: '123456',
                passwordConfirmation: '123456',
            };

            await expect(service.create(dto)).rejects.toThrow(ConflictException);
        });
    });

    describe('login', () => {
        it('should throw if user does not exist', async () => {
            mockUserModel.findOne.mockResolvedValueOnce(null);

            await expect(service.login({ email: 'a@a.com', password: '123' }))
                .rejects.toThrow(UnauthorizedException);
        });

        it('should return token if login succeeds', async () => {
            const password = await hash('123', 8);
            mockUserModel.findOne.mockResolvedValueOnce({ password, id: 'userId' });
            mockJwtService.sign.mockReturnValueOnce('fake-token');

            const result = await service.login({ email: 'a@a.com', password: '123' });

            expect(result).toEqual({ token: 'fake-token' });
        });
    });

    describe('fetchByToken', () => {
        it('should throw if user not found', async () => {
            mockUserModel.findById.mockReturnValueOnce({ select: () => ({ exec: () => null }) });

            await expect(service.fetchByToken({ sub: 'id' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should throw if user not found', async () => {
            mockUserModel.findById.mockResolvedValueOnce(null);
            await expect(service.update({ name: 'Test' } as any, { sub: 'id' }, undefined))
                .rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should throw if user not found', async () => {
            mockUserModel.findById.mockReturnValueOnce({ exec: () => null });
            await expect(service.delete({ sub: 'user-id' })).rejects.toThrow(NotFoundException);
        });
    });
});
