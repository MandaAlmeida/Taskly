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
        @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategoryDocument>, // Injeta o model de SubCategory
        @InjectModel(Categories.name) private categoryModel: Model<CategoriesDocument>,       // Injeta o model de Categories
    ) { }

    // Cria uma nova subcategoria
    async create(createCategory: CreateSubCategoryDTO, user: TokenPayloadSchema) {
        const userId = user.sub; // Extrai o ID do usuário autenticado
        const { subCategory, categoryName, color, icon } = createCategory; // Extrai dados da DTO recebida

        // Verifica se a categoria base existe para o usuário
        const categoryId = await this.categoryModel.findOne({
            category: categoryName,
            userId
        });

        if (!categoryId) {
            throw new ConflictException("Essa categoria não existe");
        }

        // Verifica se já existe uma subcategoria com o mesmo nome para essa categoria
        const existingSubCategory = await this.subCategoryModel.findOne({
            subCategory,
            categoryName,
            userId
        });

        if (existingSubCategory) {
            throw new ConflictException("Essa subcategoria já existe para essa categoria");
        }

        // Monta o objeto a ser salvo
        const newSubCategory = {
            subCategory,
            categoryName,
            categoryId: categoryId._id,
            color,
            icon,
            userId
        };

        // Salva a nova subcategoria no banco de dados
        const createdCategories = new this.subCategoryModel(newSubCategory);
        await createdCategories.save();

        return createdCategories;
    }

    // Busca todas as subcategorias criadas pelo usuário
    async fetch(user: TokenPayloadSchema) {
        const userId = user.sub;

        // Busca todas as subcategorias pertencentes ao usuário
        return await this.subCategoryModel.find({ userId }).exec();
    }

    // Busca todas as subcategorias vinculadas a uma categoria específica
    async fetchByIdCategory(categoryId: string, user: TokenPayloadSchema) {
        const userId = user.sub;

        // Busca subcategorias filtradas por categoria e usuário
        return await this.subCategoryModel.find({
            userId,
            categoryId
        }).exec();
    }

    // Busca uma subcategoria específica por ID
    async fetchById(subCategoryId: string) {
        // Retorna o documento da subcategoria pelo ID
        return await this.subCategoryModel.findById(subCategoryId).exec();
    }

    // Atualiza uma subcategoria existente
    async update(subCategoryId: string, updateData: UpdateSubCategoryDTO, user: TokenPayloadSchema) {
        const userId = user.sub;
        const { subCategory, categoryName, color, icon } = updateData;

        // Verifica se a subcategoria existe
        const subCategoryDoc = await this.subCategoryModel.findById(subCategoryId);
        if (!subCategoryDoc) {
            throw new ConflictException("Essa subcategoria não existe");
        }

        // Verifica se já existe outra subcategoria com o mesmo nome (para evitar duplicação)
        const existingCategory = await this.categoryModel.findOne({ subCategory, userId });
        if (existingCategory?._id.toString() !== subCategoryId) {
            throw new ConflictException("Já existe uma subcategoria com esse nome");
        }

        // Prepara os campos a serem atualizados
        const subCategoryToUpdate: any = {};
        if (subCategory) subCategoryToUpdate.subCategory = subCategory;
        if (color) subCategoryToUpdate.color = color;
        if (icon) subCategoryToUpdate.icon = icon;

        // Caso a categoria base da subcategoria seja alterada
        if (categoryName) {
            const categoryDoc = await this.categoryModel.findOne({
                category: categoryName,
                userId
            });

            // Não permite alterar para categorias inexistentes ou a categoria "Todas"
            if (!categoryDoc || categoryName === "Todas") {
                throw new ConflictException("Essa categoria não existe ou não pode ser utilizada");
            }

            // Atualiza o vínculo da subcategoria com a nova categoria
            subCategoryToUpdate.categoryId = categoryDoc._id;
            subCategoryToUpdate.categoryName = categoryName;
        }

        // Realiza a atualização no banco de dados
        const updatedSubCategory = await this.subCategoryModel.findByIdAndUpdate(
            subCategoryId,
            subCategoryToUpdate,
            { new: true } // Retorna o documento já atualizado
        );

        return updatedSubCategory;
    }

    // Exclui uma subcategoria
    async delete(subCategoryId: string, user: TokenPayloadSchema) {
        const userId = user.sub;

        // Verifica se a subcategoria existe
        const subCategory = await this.subCategoryModel.findById(subCategoryId).exec();
        if (!subCategory) {
            throw new NotFoundException("Subcategoria não encontrada");
        }

        // Verifica se a subcategoria pertence ao usuário
        if (subCategory.userId.toString() !== userId) {
            throw new ForbiddenException("Você não tem permissão para excluir esta subcategoria");
        }

        // Realiza a exclusão da subcategoria
        await this.subCategoryModel.findByIdAndDelete(subCategoryId).exec();

        return { message: "Subcategoria excluída com sucesso" };
    }
}
