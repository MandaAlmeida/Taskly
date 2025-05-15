import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { CreateCategoryDTO } from "@/contracts/category.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Categories, CategoriesDocument } from "@/models/category.schema";
import { Model } from "mongoose";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Categories.name)
        private readonly categoryModel: Model<CategoriesDocument>
    ) { }

    // Verifica se a categoria existe, e cria a categoria
    async create(
        createCategory: CreateCategoryDTO,
        user: TokenPayloadSchema
    ): Promise<Categories> {
        const userId = user.sub;
        const { category, color, icon } = createCategory;

        const existingCategory = await this.categoryModel.findOne({
            category,
            userId,
        });

        if (existingCategory) {
            throw new ConflictException("Essa categoria já existe");
        }

        const newCategory = await this.categoryModel.create({
            category,
            color,
            icon,
            userId,
        });

        return newCategory;
    }

    // busca as categorias pelo usuario, nao devolve erro caso nao achar nenhuma
    async fetch(user: TokenPayloadSchema): Promise<Categories[]> {
        const userId = user.sub;
        return await this.categoryModel.find({ userId });
    }

    // busca uma categoria pelo id, verifica se ela existe
    async fetchById(categoryId: string): Promise<Categories> {
        const category = await this.categoryModel.findById(categoryId);

        if (!category) {
            throw new NotFoundException("Categoria não encontrada");
        }

        return category;
    }

    // atualiza a categoria, verifica se ela existe, se o usuario tem permissao, verifica se existe outra com esse nome, devolve erro caso falhar 
    async update(
        categoryId: string,
        updateCategory: CreateCategoryDTO,
        user: TokenPayloadSchema
    ): Promise<Categories> {
        const userId = user.sub;
        const categoryDoc = await this.categoryModel.findById(categoryId);

        if (!categoryDoc) {
            throw new NotFoundException("Categoria não encontrada");
        }

        if (categoryDoc.userId.toString() !== userId) {
            throw new ForbiddenException("Você não tem permissão para editar esta categoria");
        }

        const duplicate = await this.categoryModel.findOne({
            category: updateCategory.category,
            userId,
        });

        if (duplicate && duplicate._id.toString() !== categoryId) {
            throw new ConflictException("Já existe uma categoria com esse nome");
        }

        const updated = await this.categoryModel.findByIdAndUpdate(
            categoryId,
            {
                $set: {
                    category: updateCategory.category,
                    color: updateCategory.color,
                    icon: updateCategory.icon,
                },
            },
            { new: true }
        );

        if (!updated) {
            throw new NotFoundException("Erro ao atualizar categoria");
        }

        return updated;
    }

    // deleta a categoria, verifica se ela existe, verifica se ela e diferente de "todas", se o usuario tem permissao para excluir 
    async delete(categoryId: string, user: TokenPayloadSchema): Promise<{ message: string }> {
        const userId = user.sub;
        const category = await this.categoryModel.findById(categoryId);

        if (!category) {
            throw new NotFoundException("Categoria não encontrada");
        }

        if (
            category.userId.toString() !== userId ||
            category.category.toLowerCase() === "todas"
        ) {
            throw new ForbiddenException("Você não tem permissão para excluir esta categoria");
        }

        await this.categoryModel.findByIdAndDelete(categoryId);

        return { message: "Categoria excluída com sucesso" };
    }
}
