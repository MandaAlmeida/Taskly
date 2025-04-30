import { User, UserDocument } from "@/models/user.schema"; // Importa o modelo de usuário
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"; // Exceções para tratamento de erros
import { JwtService } from "@nestjs/jwt"; // Serviço para manipulação de JWT (JSON Web Token)
import { InjectModel } from "@nestjs/mongoose"; // Injeção do modelo mongoose para acesso ao banco de dados
import { Model } from "mongoose"; // Model mongoose
import { Categories, CategoriesDocument } from "@/models/category.schema"; // Modelo de categorias
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "@/contracts/user.dto"; // DTOs para entrada de dados
import { compare, hash } from 'bcryptjs'; // Funções para comparar e criar senhas com bcrypt
import { Task, TaskDocument } from "@/models/tasks.schema"; // Modelo de tarefas
import { SubCategory, SubCategoryDocument } from "@/models/subCategory.schema"; // Modelo de subcategorias
import { TokenPayloadSchema } from "@/auth/jwt.strategy"; // Tipo para dados do payload do token JWT
import { UploadService } from "./upload.service"; // Serviço para upload de arquivos
import { Group, GroupDocument } from "@/models/groups.schema"; // Modelo de grupos
import { Annotation, AnnotationDocument } from "@/models/annotations.schema"; // Modelo de anotações

// Decorador para tornar a classe injetável no NestJS
@Injectable()
export class UserService {
    constructor(
        // Injeção de modelos do Mongoose
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Categories.name) private categoriesModel: Model<CategoriesDocument>,
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
        @InjectModel(SubCategory.name) private subCategoriesModel: Model<SubCategoryDocument>,
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
        @InjectModel(Annotation.name) private annotationModel: Model<AnnotationDocument>,

        // Injeção do serviço de upload
        private UploadService: UploadService,

        // Injeção do serviço JWT
        private jwt: JwtService,

        // Repetição de serviço de upload
        private uploadService: UploadService
    ) { }

    /**
     * Cria um novo usuário.
     * Realiza validação de senha, verificação de e-mail existente e criação de categorias padrão.
     */
    async create(user: CreateUserDTO, file: Express.Multer.File) {
        const { userName, name, email, birth, password, passwordConfirmation } = user;

        // Validação de confirmação de senha
        if (passwordConfirmation !== password) {
            throw new BadRequestException("As senhas precisam ser iguais");
        }

        // Verifica se o email já está em uso
        const existingEmail = await this.userModel.findOne({ email });
        if (existingEmail) {
            throw new ConflictException('Este usuário já existe');
        }

        // Criptografa a senha
        const hashedPassword = await hash(password, 8);

        // Variável para armazenar a URL do arquivo se houver upload
        let uploadedFileUrl;

        if (file) {
            // Se houver arquivo, faz o upload e obtém a URL do arquivo
            const result = await this.uploadService.upload(file);
            uploadedFileUrl = result;
        }

        // Cria o novo usuário no banco
        const newUser = {
            userName,
            name,
            email,
            password: hashedPassword,
            birth,
            imageUser: uploadedFileUrl?.url ?? null,
        };

        const createdUser = new this.userModel(newUser);

        // Cria categorias padrão para o usuário
        const defaultCategories = [
            { category: "Todas", icon: 3, color: "#4A88C5" },
            { category: "Pessoal", icon: 19, color: "#34A853" },
            { category: "Estudo", icon: 10, color: "#FBBC05" },
            { category: "Trabalho", icon: 2, color: "#FF3B30" }
        ];

        // Mapeia as categorias padrão com o ID do usuário
        const categories = defaultCategories.map(category => ({
            category: category.category,
            icon: category.icon,
            color: category.color,
            userId: createdUser._id,
        }));

        // Insere as categorias no banco
        await this.categoriesModel.insertMany(categories);

        // Salva o usuário
        await createdUser.save();

        return createdUser;
    }

    /**
     * Realiza o login do usuário e retorna o token JWT.
     */
    async login(user: LoginUserDTO): Promise<{ token: string }> {
        const { email, password } = user;

        // Verifica se o usuário existe
        const confirmeUser = await this.userModel.findOne({ email });
        if (!confirmeUser) {
            throw new UnauthorizedException("Senha ou email incorretos");
        }

        // Compara a senha fornecida com a senha armazenada
        const checkPassword = await compare(password, confirmeUser.password);
        if (!checkPassword) {
            throw new UnauthorizedException("Senha ou email incorretos");
        }

        // Cria o token JWT
        const accessToken = this.jwt.sign({ sub: confirmeUser.id.toString() });

        return { token: accessToken };
    }

    /**
     * Recupera os dados do usuário a partir do token JWT.
     */
    async fetchByToken(user: TokenPayloadSchema) {
        const userId = user.sub;

        // Busca o usuário no banco, excluindo a senha
        const userFound = await this.userModel.findById(userId).select('-password').exec();
        if (!userFound) {
            throw new NotFoundException("Usuário não encontrado");
        }

        return userFound;
    }

    /**
     * Recupera o usuário pelo ID.
     */
    async fetchById(userId: string) {
        const userFound = await this.userModel.findById(userId).select(['userName']).exec();
        if (!userFound) {
            throw new NotFoundException("Usuário não encontrado");
        }

        return userFound;
    }

    /**
     * Atualiza as informações do usuário.
     */
    async update(updateData: UpdateUserDTO, user: TokenPayloadSchema, file: Express.Multer.File) {
        const { name, email, password, passwordConfirmation } = updateData;
        const userId = user.sub;

        // Verifica se o usuário existe
        const existingUser = await this.userModel.findById(userId);
        if (!existingUser) throw new NotFoundException("Usuário não encontrado");

        // Verifica se o email já está em uso
        const existingEmail = await this.userModel.findOne({ email });
        if (existingEmail?._id.toString() !== existingUser._id.toString()) throw new ConflictException('Este usuário já existe');

        // Verifica se as senhas são iguais
        if (password !== passwordConfirmation) throw new BadRequestException("As senhas precisam ser iguais");

        // Prepara os dados para atualizar o usuário
        const userToUpdate: any = {};

        console.log(file)

        if (name) userToUpdate.name = name;
        if (email) userToUpdate.email = email;
        if (password) userToUpdate.password = await hash(password, 8);
        if (file) {

            // Se houver arquivo, faz o upload e atualiza a imagem
            const result = await this.uploadService.upload(file);
            this.UploadService.delete(existingUser?.imageUser);
            userToUpdate.imageUser = result.url;


        }

        // Atualiza o usuário no banco
        const updateUser = await this.userModel.findByIdAndUpdate(userId, userToUpdate, { new: true });

        return updateUser;
    }

    /**
     * Exclui um usuário e todos os dados associados.
     */
    async delete(user: TokenPayloadSchema) {
        const userId = user.sub;

        // Verifica se o usuário existe
        const deleteUser = await this.userModel.findById(userId).exec();
        if (!deleteUser) throw new NotFoundException("Usuário não encontrado");

        // Exclui as tarefas, subcategorias, categorias, grupos e anotações associadas ao usuário
        await this.taskModel.deleteMany({ userId }).exec();
        await this.subCategoriesModel.deleteMany({ userId }).exec();
        await this.categoriesModel.deleteMany({ userId }).exec();
        await this.groupModel.deleteMany({ userId }).exec();
        await this.annotationModel.deleteMany({ createdUserId: userId }).exec();

        // Remove o usuário das anotações e grupos onde ele era membro
        const annotationMembers = await this.annotationModel.find({ 'members.userId': userId });
        for (const annotation of annotationMembers) {
            const newMembers = annotation.members.filter(member => member.userId.toString() !== userId.toString());
            await this.annotationModel.findByIdAndUpdate(annotation._id, { $set: { members: newMembers } }, { new: true });
        }

        const groupMembers = await this.groupModel.find({ 'members.userId': userId });
        for (const group of groupMembers) {
            const newMembers = group.members.filter(member => member.userId.toString() !== userId.toString());
            await this.groupModel.findByIdAndUpdate(group._id, { $set: { members: newMembers } }, { new: true });
        }

        // Exclui a imagem do usuário
        this.UploadService.delete(deleteUser.imageUser);

        // Exclui o usuário
        await this.userModel.findByIdAndDelete(userId).exec();

        return { message: "Usuário removido com sucesso" };
    }
}
