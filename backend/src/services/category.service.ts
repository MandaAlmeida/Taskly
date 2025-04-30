import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { CreateCategoryDTO } from "@/contracts/category.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Categories, CategoriesDocument } from "@/models/category.schema";
import { Model } from "mongoose";

// Marca a classe como um provider injetável, disponível para injeção de dependência
@Injectable()
export class CategorysService {
    constructor(
        // Injeta o modelo de categorias (Mongoose) para acesso ao banco
        @InjectModel(Categories.name) private categoryModel: Model<CategoriesDocument>
    ) { }

    // Criação de uma nova categoria vinculada ao usuário autenticado
    async create(createCategory: CreateCategoryDTO, user: TokenPayloadSchema) {
        const userId = user.sub;
        const { category, color, icon } = createCategory;

        // Verifica se já existe uma categoria com o mesmo nome para o mesmo usuário
        const existingCategory = await this.categoryModel.findOne({
            category,
            userId
        });

        if (existingCategory) {
            throw new ConflictException("Essa categoria já existe");
        }

        // Cria o documento e salva no banco
        const Category = { category, color, icon, userId };
        const createdCategories = new this.categoryModel(Category);
        await createdCategories.save();

        return createdCategories;
    }

    // Retorna todas as categorias do usuário autenticado
    async fetch(user: TokenPayloadSchema) {
        const userId = user.sub;
        return await this.categoryModel.find({ userId }).exec();
    }

    // Busca uma categoria por ID
    async fetchById(categoryId: string) {
        return await this.categoryModel.findById(categoryId).exec();
    }

    // Atualização de categoria
    async update(categoryId: string, updateCategory: CreateCategoryDTO, user: TokenPayloadSchema) {
        const userId = user.sub;
        const { category, color, icon } = updateCategory;

        const categoryDoc = await this.categoryModel.findById(categoryId);

        if (!categoryDoc) {
            throw new ConflictException("Essa categoria nao existe");
        }

        // Impede que um usuário atualize a categoria de outro usuário
        if (categoryDoc.userId !== userId) {
            throw new ConflictException("Voce nao tem acesso a essa categoria");
        }

        // Verifica se já existe outra categoria com o mesmo nome para o usuário
        const existingCategory = await this.categoryModel.findOne({ category, userId });

        if (existingCategory?._id.toString() !== categoryId) {
            throw new ConflictException("Ja existe uma categoria com esse nome");
        }

        // Prepara campos atualizáveis
        const categoryToUpdate: any = {};
        if (category) categoryToUpdate.category = category;
        if (color) categoryToUpdate.color = color;
        if (icon) categoryToUpdate.icon = icon;

        // Atualiza e retorna a categoria atualizada
        const createdCategories = await this.categoryModel.findByIdAndUpdate(
            categoryId,
            categoryToUpdate,
            { new: true }
        );

        return createdCategories;
    }

    // Exclusão de categoria
    async delete(categoryId: string, user: TokenPayloadSchema) {
        const userId = user.sub;

        const subCategory = await this.categoryModel.findById(categoryId).exec();

        if (!subCategory) {
            throw new NotFoundException("Categoria não encontrada");
        }

        // Impede exclusão de categorias de outro usuário ou de categorias protegidas como "Todas"
        if (subCategory.userId.toString() !== userId || subCategory.category === "Todas") {
            throw new ForbiddenException("Você não tem permissão para excluir esta categoria");
        }

        await this.categoryModel.findByIdAndDelete(categoryId).exec();

        return { message: "Categoria excluída com sucesso" };
    }
}
