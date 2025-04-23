import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { CreateCategoryDTO } from "@/contracts/category.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Categories, CategoriesDocument } from "@/models/category.schema";
import { Model } from "mongoose";

@Injectable()
export class CategorysService {
    constructor(
        @InjectModel(Categories.name) private categoryModel: Model<CategoriesDocument>
    ) { }

    async create(createCategory: CreateCategoryDTO, user: TokenPayloadSchema) {
        const { sub: userId } = user
        const { category, color, icon } = createCategory

        const existingCategory = await this.categoryModel.findOne({
            category,
            userId
        });

        if (existingCategory) {
            throw new ConflictException("Essa categoria já existe");
        }

        const Category = { category, color, icon, userId: userId }

        const createdCategories = new this.categoryModel(Category);
        await createdCategories.save();
        return createdCategories;

    }

    async fetch(user: TokenPayloadSchema) {
        const { sub: userId } = user;
        return await this.categoryModel.find({ userId }).exec();
    }

    async fetchById(categoryId: string) {
        return await this.categoryModel.findById(categoryId).exec();
    }

    async update(categoryId: string, updateCategory: CreateCategoryDTO, user: TokenPayloadSchema) {
        const { sub: userId } = user
        const { category, color, icon } = updateCategory

        const categoryDoc = await this.categoryModel.findById(categoryId);

        if (!categoryDoc) {
            throw new ConflictException("Essa categoria nao existe");
        }

        if (categoryDoc.userId !== userId) {
            throw new ConflictException("Voce nao tem acesso a essa categoria");
        }

        const existingCategory = await this.categoryModel.findOne({ category, userId });

        if (existingCategory?._id.toString() !== categoryId) {
            throw new ConflictException("Ja existe uma categoria com esse nome");
        }

        const categoryToUpdate: any = {};

        if (category) categoryToUpdate.category = category;
        if (color) categoryToUpdate.color = color;
        if (icon) categoryToUpdate.icon = icon;

        const createdCategories = await this.categoryModel.findByIdAndUpdate(categoryId, categoryToUpdate, { new: true });
        return createdCategories;

    }

    async delete(categoryId: string, user: TokenPayloadSchema) {
        const { sub: userId } = user;

        const subCategory = await this.categoryModel.findById(categoryId).exec();

        if (!subCategory) {
            throw new NotFoundException("Categoria não encontrada");
        }

        // Verifica se o usuário é o dono da task
        if (subCategory.userId.toString() !== userId || subCategory.category === "Todas") {
            throw new ForbiddenException("Você não tem permissão para excluir esta categoria");
        }

        await this.categoryModel.findByIdAndDelete(categoryId).exec();

        return { message: "Categoria excluída com sucesso" }
    }
}
