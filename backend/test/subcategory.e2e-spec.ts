// subCategory.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { SubCategory } from '@/models/subCategory.schema';
import { Categories } from '@/models/category.schema';
import { SubCategoriesService } from '@/services/subCategory.service';

describe('SubCategoriesService', () => {
    let service: SubCategoriesService;
    let subCategoryModel: any;
    let categoryModel: any;

    const user = { sub: 'user123' };

    beforeEach(async () => {
        subCategoryModel = {
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            create: jest.fn(),
        };

        categoryModel = {
            findOne: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubCategoriesService,
                { provide: getModelToken(SubCategory.name), useValue: subCategoryModel },
                { provide: getModelToken(Categories.name), useValue: categoryModel },
            ],
        }).compile();

        service = module.get<SubCategoriesService>(SubCategoriesService);
    });

    afterEach(() => jest.clearAllMocks());

    describe('create', () => {
        it('should create a new subcategory', async () => {
            const dto = { subCategory: 'Sub1', categoryName: 'Cat1', color: 'blue', icon: 1 };
            categoryModel.findOne.mockResolvedValue({ _id: 'cat123' });
            subCategoryModel.findOne.mockResolvedValue(null);
            subCategoryModel.create.mockResolvedValue({ ...dto, _id: 'sub123' });

            const result = await service.create(dto, user);
            expect(result).toEqual({ ...dto, _id: 'sub123' });
        });

        it('should throw if category does not exist', async () => {
            const dto = { subCategory: 'Sub1', categoryName: 'Cat1', color: 'blue', icon: 1 };
            categoryModel.findOne.mockResolvedValue(null);

            await expect(service.create(dto, user)).rejects.toThrow(ConflictException);
        });

        it('should throw if subcategory already exists', async () => {
            const dto = { subCategory: 'Sub1', categoryName: 'Cat1', color: 'blue', icon: 1 };
            categoryModel.findOne.mockResolvedValue({ _id: 'cat123' });
            subCategoryModel.findOne.mockResolvedValue({ _id: 'subExists' });

            await expect(service.create(dto, user)).rejects.toThrow(ConflictException);
        });
    });

    describe('fetch', () => {
        it('should fetch subcategories for a user', async () => {
            const mockData = [{ subCategory: 'A' }, { subCategory: 'B' }];

            subCategoryModel.find.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockData),
            });

            const result = await service.fetch(user);
            expect(result).toEqual(mockData);
            expect(subCategoryModel.find).toHaveBeenCalledWith({ userId: user.sub });
        });
    });


    describe('fetchByIdCategory', () => {
        it('should return subcategories by category ID and user', async () => {
            const categoryId = 'cat123';
            const mockData = [{ subCategory: 'A' }];
            subCategoryModel.find.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockData),
            });

            const result = await service.fetchByIdCategory(categoryId, user);
            expect(result).toEqual(mockData);
            expect(subCategoryModel.find).toHaveBeenCalledWith({ userId: user.sub, categoryId });
        });
    });

    describe('fetchById', () => {
        it('should return subcategory by ID', async () => {
            const id = 'sub123';
            const mockSubCategory = { _id: id };
            subCategoryModel.findById.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockSubCategory),
            });

            const result = await service.fetchById(id);
            expect(result).toEqual(mockSubCategory);
        });
    });

    describe('update', () => {
        it('should update a subcategory', async () => {
            const id = 'sub123';
            const dto = { subCategory: 'Updated', color: 'red', icon: 2, categoryName: 'Cat2' };
            const subCategoryDoc = { _id: id, subCategory: 'Old', categoryName: 'OldCat', userId: user.sub };
            const categoryDoc = { _id: 'cat456' };

            subCategoryModel.findById.mockResolvedValue(subCategoryDoc);
            subCategoryModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });
            categoryModel.findOne.mockResolvedValue(categoryDoc);
            subCategoryModel.findByIdAndUpdate.mockResolvedValue({ ...subCategoryDoc, ...dto });

            const result = await service.update(id, dto, user);
            expect(result).toEqual({ ...subCategoryDoc, ...dto });
        });

        it('should throw if subcategory does not exist', async () => {
            subCategoryModel.findById.mockResolvedValue(null);
            await expect(service.update('sub123', { subCategory: 'dup', color: 'red', icon: 2, categoryName: 'Cat2' }, user)).rejects.toThrow(ConflictException);
        });

        it('should throw if duplicate subcategory name exists', async () => {
            const id = 'sub123';
            subCategoryModel.findById.mockResolvedValue({ _id: id, subCategory: 'OldName', userId: user.sub });
            subCategoryModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue({ _id: 'anotherId' }),
            });


            await expect(service.update(id, { subCategory: 'dup', color: 'red', icon: 2, categoryName: 'Cat2' }, user)).rejects.toThrow(ConflictException);
        });

        it('should throw if updating to invalid category', async () => {
            const id = 'sub123';
            subCategoryModel.findById.mockResolvedValue({ _id: id, subCategory: 'OldName', categoryName: 'CatX', userId: user.sub });
            subCategoryModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });
            categoryModel.findOne.mockResolvedValue(null);


            await expect(
                service.update(id, { subCategory: 'NewName', color: 'red', icon: 2, categoryName: 'Todas' }, user)
            ).rejects.toThrow(ConflictException);
        });
    });

    // describe('delete', () => {
    //     it('should delete a subcategory', async () => {
    //         const id = 'sub123';
    //         const doc = { _id: id, userId: user.sub };
    //         subCategoryModel.findById.mockResolvedValue(doc);
    //         subCategoryModel.findByIdAndDelete.mockResolvedValue(doc);

    //         const result = await service.delete(id, user);
    //         expect(result).toEqual({ message: 'Subcategoria excluída com sucesso' });
    //     });

    //     it('should throw if subcategory not found', async () => {
    //         subCategoryModel.findById.mockResolvedValue(null);
    //         await expect(service.delete('sub123', user)).rejects.toThrow(NotFoundException);
    //     });

    //     it('should throw if user is not owner', async () => {
    //         subCategoryModel.findById.mockResolvedValue({ _id: 'sub123', userId: 'otherUser' });
    //         await expect(service.delete('sub123', user)).rejects.toThrow(ForbiddenException);
    //     });
    // });
});
