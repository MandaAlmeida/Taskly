import { User, UserDocument } from "@/models/user.schema";
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Categories, CategoriesDocument } from "@/models/category.schema";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "@/contracts/user.dto";
import { compare, hash } from 'bcryptjs';
import { Task, TaskDocument } from "@/models/tasks.schema";
import { SubCategory, SubCategoryDocument } from "@/models/subCategory.schema";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { UploadService } from "./upload.service";


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Categories.name) private categoriesModel: Model<CategoriesDocument>,
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
        @InjectModel(SubCategory.name) private subCategoriesModel: Model<SubCategoryDocument>,
        private jwt: JwtService,
        private uploadService: UploadService
    ) { }

    async create(user: CreateUserDTO, file: Express.Multer.File) {
        const { name, email, birth, password, passwordConfirm, } = user

        if (passwordConfirm !== password) {
            throw new BadRequestException("As senhas precisam ser iguais");
        }

        const existingEmail = await this.userModel.findOne({ email });

        if (existingEmail) {
            throw new ConflictException('Este usuário já existe');
        }

        const hashedPassword = await hash(password, 8);

        let uploadedFileUrl;

        if (file) {
            const result = await this.uploadService.upload(file);
            uploadedFileUrl = result;
        }

        const newUser = {
            name,
            email,
            password: hashedPassword,
            birth,
            imageUser: uploadedFileUrl.url,
        };

        const createdUser = new this.userModel(newUser);

        // Após criar o usuário, você cria as categorias padrão para o usuário
        const defaultCategories = [{ category: "Todas", icon: "CalendarCheck", color: "#4A88C5" }, { category: "Pessoal", icon: "UserRound", color: "#34A853" }, { category: "Estudo", icon: "GraduationCap", color: "#FBBC05" }, { category: "Trabalho", icon: "BriefcaseBusiness", color: "#FF3B30" }];
        const categories = defaultCategories.map(category => ({
            category: category.category,
            icon: category.icon,
            color: category.color,
            userId: createdUser._id,
        }));

        // Crie as categorias no banco de dados
        await this.categoriesModel.insertMany(categories);
        await createdUser.save();

        return createdUser;
    }

    async login(user: LoginUserDTO): Promise<{ token: string }> {
        const { email, password } = user
        const confirmeUser = await this.userModel.findOne({ email });
        if (!confirmeUser) {
            throw new UnauthorizedException("Senha ou email incorretos");
        }

        const checkPassword = await compare(password, confirmeUser.password)

        if (!checkPassword) {
            throw new UnauthorizedException("Senha ou email incorretos")
        }

        const accessToken = this.jwt.sign({ sub: confirmeUser.id.toString() })

        return {
            token: accessToken
        };

    }

    async fetch(user: TokenPayloadSchema) {
        const userId = user.sub;

        const userFound = await this.userModel
            .findById(userId)
            .select('-password') // Isso remove a senha do retorno
            .exec();

        if (!userFound) {
            throw new NotFoundException("Usuário não encontrado");
        }

        return userFound;
    }

    async update(updateData: UpdateUserDTO, user: TokenPayloadSchema) {
        const { name, email, password, passwordConfirm } = updateData
        const userId = user.sub;

        if (!userId) {
            throw new NotFoundException("Usuário não encontrado");
        }

        const existingEmail = await this.userModel.findOne({ email });

        if (existingEmail) {
            throw new ConflictException('Este usuário já existe');
        }

        if (password !== passwordConfirm) {
            throw new BadRequestException("As senhas precisam ser iguais");
        }


        const userToUpdate: any = {};

        if (name) userToUpdate.name = name;
        if (email) userToUpdate.email = email;
        if (password) userToUpdate.password = await hash(password, 8);

        const updateUser = await this.userModel.findByIdAndUpdate(userId, userToUpdate, { new: true })

        return updateUser

    }

    async delete(userId: string) {
        // Exclui o usuário
        await this.userModel.findByIdAndDelete(userId).exec();

        // Exclui todas as tasks do usuário
        await this.taskModel.deleteMany({ userId }).exec();

        // Exclui todas as subcategorias do usuário
        await this.subCategoriesModel.deleteMany({ userId }).exec();

        // Exclui todas as categorias do usuário
        await this.categoriesModel.deleteMany({ userId }).exec();

        return { message: "Usuario excluído com sucesso" };
    }
}
