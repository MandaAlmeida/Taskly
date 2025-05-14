import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { InjectModel } from "@nestjs/mongoose";
import { Categories, CategoriesDocument } from "@/models/category.schema";
import { Model } from "mongoose";
import {
    CreateSubCategoryDTO,
    UpdateSubCategoryDTO,
} from "@/contracts/subCategory.dto";
import {
    SubCategory,
    SubCategoryDocument,
} from "@/models/subCategory.schema";

@Injectable()
export class SubCategoriesService {
    constructor(
        @InjectModel(SubCategory.name)
        private subCategoryModel: Model<SubCategoryDocument>,
        @InjectModel(Categories.name)
        private categoryModel: Model<CategoriesDocument>
    ) { }

    async create(dto: CreateSubCategoryDTO, user: TokenPayloadSchema) {
        const userId = user.sub;
        const { subCategory, categoryName, color, icon } = dto;

        const category = await this.findCategoryByName(categoryName, userId);
        if (!category) throw new ConflictException("Essa categoria não existe");


        const duplicate = await this.subCategoryModel.findOne({ subCategory, categoryName, userId });
        if (duplicate) throw new ConflictException("Essa subcategoria já existe para essa categoria");


        return await this.subCategoryModel.create({
            subCategory,
            categoryName,
            categoryId: category._id,
            color,
            icon,
            userId,
        });
    }

    async fetch(user: TokenPayloadSchema) {
        return this.subCategoryModel.find({ userId: user.sub }).lean();
    }

    async fetchByIdCategory(categoryId: string, user: TokenPayloadSchema) {
        return this.subCategoryModel.find({ userId: user.sub, categoryId }).lean();
    }

    async fetchById(subCategoryId: string) {
        return this.subCategoryModel.findById(subCategoryId).lean();
    }

    async update(subCategoryId: string, dto: UpdateSubCategoryDTO, user: TokenPayloadSchema) {
        const userId = user.sub;
        const { subCategory, categoryName, color, icon } = dto;

        const subCategoryDoc = await this.subCategoryModel.findById(subCategoryId);
        if (!subCategoryDoc) {
            throw new ConflictException("Essa subcategoria não existe");
        }

        if (subCategory && subCategory !== subCategoryDoc.subCategory) {
            const duplicate = await this.subCategoryModel.findOne({ subCategory, userId }).lean();
            if (duplicate && duplicate._id.toString() !== subCategoryId) {
                throw new ConflictException("Já existe uma subcategoria com esse nome");
            }
        }

        const updateData: Partial<SubCategory> = {};
        if (subCategory) updateData.subCategory = subCategory;
        if (color) updateData.color = color;
        if (icon) updateData.icon = icon;

        if (categoryName && categoryName !== subCategoryDoc.categoryName) {
            const category = await this.findCategoryByName(categoryName, userId);

            if (!category || categoryName === "Todas") {
                throw new ConflictException("Essa categoria não existe ou não pode ser utilizada");
            }

            updateData.categoryId = category._id.toString();;
            updateData.categoryName = categoryName;
        }

        return await this.subCategoryModel.findByIdAndUpdate(subCategoryId, updateData, { new: true });
    }

    async delete(subCategoryId: string, user: TokenPayloadSchema) {
        const userId = user.sub;

        const subCategory = await this.subCategoryModel.findById(subCategoryId);
        if (!subCategory) {
            throw new NotFoundException("Subcategoria não encontrada");
        }

        if (subCategory.userId.toString() !== userId) {
            throw new ForbiddenException("Você não tem permissão para excluir esta subcategoria");
        }

        await this.subCategoryModel.findByIdAndDelete(subCategoryId);
        return { message: "Subcategoria excluída com sucesso" };
    }

    private async findCategoryByName(categoryName: string, userId: string): Promise<CategoriesDocument | null> {
        return this.categoryModel.findOne({ category: categoryName, userId });
    }

}
