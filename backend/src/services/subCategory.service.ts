import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { InjectModel } from "@nestjs/mongoose";
import { Categories, CategoriesDocument } from "@/models/category.schema";
import { Model } from "mongoose";
import { CreateSubCategoryDTO, UpdateSubCategoryDTO } from "@/contracts/subCategory.dto";
import { SubCategory, SubCategoryDocument } from "@/models/subCategory.schema";

@Injectable()
export class SubCategoryService {
    constructor(
        @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategoryDocument>,
        @InjectModel(Categories.name) private categoryModel: Model<CategoriesDocument>,
    ) { }

    async create(createCategory: CreateSubCategoryDTO, user: TokenPayloadSchema) {
        const { sub: userId } = user
        const { subCategory, categoryName, color, icon } = createCategory;

        const categoryId = await this.categoryModel.findOne({
            category: categoryName,
            userId
        });

        if (!categoryId) {
            throw new ConflictException("Essa categoria nao existe");
        }

        const existingSubCategory = await this.subCategoryModel.findOne({
            subCategory,
            categoryName,
            userId
        });

        if (existingSubCategory) {
            throw new ConflictException("Essa sub categoria já existe para essa categoria");
        }

        const Category = { subCategory, categoryName, categoryId: categoryId._id, color, icon, userId: userId }

        const createdCategories = new this.subCategoryModel(Category);
        await createdCategories.save();
        return createdCategories;
    }

    async fetch(user: TokenPayloadSchema) {
        const { sub: userId } = user;
        const subCategory = await this.subCategoryModel.find({ userId }).exec();

        return subCategory
    }

    async fetchByIdCategory(categoryId: string, user: TokenPayloadSchema) {
        const { sub: userId } = user;
        const subCategory = await this.subCategoryModel.find({
            userId,
            categoryId
        }).exec();

        return subCategory
    }

    async fetchById(subCategoryId: string) {
        return await this.subCategoryModel.findById(subCategoryId).exec();
    }

    async update(subCategoryId: string, updateData: UpdateSubCategoryDTO, user: TokenPayloadSchema) {
        const { sub: userId } = user;
        const { subCategory, categoryName, color, icon } = updateData;

        const subCategoryDoc = await this.subCategoryModel.findById(subCategoryId);
        if (!subCategoryDoc) {
            throw new ConflictException("Essa subcategoria não existe");
        }
        const existingCategory = await this.categoryModel.findOne({ subCategory, userId });

        if (existingCategory?._id.toString() !== subCategoryId) {
            throw new ConflictException("Ja existe uma subcategoria com esse nome");
        }

        const subCategoryToUpdate: any = {};

        if (subCategory) subCategoryToUpdate.subCategory = subCategory;
        if (color) subCategoryToUpdate.color = color;
        if (icon) subCategoryToUpdate.icon = icon;

        if (categoryName) {
            const categoryDoc = await this.categoryModel.findOne({
                category: categoryName,
                userId
            });

            if (!categoryDoc || categoryName === "Todas") {
                throw new ConflictException("Essa categoria não existe ou nao pode ser utilizada");
            }

            subCategoryToUpdate.categoryId = categoryDoc._id;
            subCategoryToUpdate.categoryName = categoryName;
        }

        const updatedSubCategory = await this.subCategoryModel.findByIdAndUpdate(
            subCategoryId,
            subCategoryToUpdate,
            { new: true }
        );

        return updatedSubCategory;
    }



    async delete(subCategoryId: string, user: TokenPayloadSchema) {
        const { sub: userId } = user;

        const subCategory = await this.subCategoryModel.findById(subCategoryId).exec();

        if (!subCategory) {
            throw new NotFoundException("Sub categoria não encontrada");
        }

        if (subCategory.userId.toString() !== userId) {
            throw new ForbiddenException("Você não tem permissão para excluir esta sub categoria");
        }
        await this.subCategoryModel.findByIdAndDelete(subCategoryId).exec();

        return { message: "Sub categoria excluída com sucesso" }
    }
}
