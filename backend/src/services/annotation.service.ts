import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Annotation, AnnotationDocument } from "@/models/annotations.schema";
import { CreateAnnotationDTO, UpdateAnnotationDTO } from "@/contracts/annotation.dto";
import { UploadService } from "./upload.service";
import { AttachmentDTO } from "@/contracts/attachment.dto";
import { NotificationsGateway } from "@/gateway/notifications.gateway";
import { MemberDTO } from "@/contracts/member.dto";
import { CreateNotificationDto } from "@/contracts/notification.dto";
import { GroupService } from "./group.service";
import { NotificationsService } from "./notifications.service";

@Injectable()
export class AnnotationsService {
    constructor(
        @InjectModel(Annotation.name) private annotationModel: Model<AnnotationDocument>,
        private uploadService: UploadService,
        private groupService: GroupService,
        private notificationService: NotificationsService,
        private notificationsGateway: NotificationsGateway
    ) { }

    // Verifica se a anotação existe, se membro é valido e fa upload de arquivo
    async create(annotation: CreateAnnotationDTO, user: TokenPayloadSchema, files?: Express.Multer.File[], attachments?: Express.Multer.File[]) {
        const { title, content, category, members } = annotation;
        const userId = user.sub;

        const existingAnnotation = await this.checkExistingAnnotation(title, category, userId);

        if (existingAnnotation) throw new ConflictException("Essa anotacao já existe");

        if (members) this.validateMembers(members);


        let uploadedFileUrls: AttachmentDTO[] = [];
        let uploadedAttachmentsUrls: AttachmentDTO[] = [];

        if (files && files.length > 0) uploadedFileUrls = await this.uploadFiles(files);


        if (attachments && attachments.length > 0) uploadedAttachmentsUrls = await this.uploadFiles(attachments);


        await this.processContent(content, uploadedFileUrls);

        const annotationToCreate = {
            title,
            content,
            category,
            members,
            createdUserId: userId,
            attachments: uploadedAttachmentsUrls
        };

        return await this.annotationModel.create(annotationToCreate);
    }

    // Verifica se a anotação existe, se membro é valido e fa upload de arquivo, adiciona grupo
    async createByGroup(annotation: CreateAnnotationDTO, groupId: string, user: TokenPayloadSchema, files?: Express.Multer.File[], attachments?: Express.Multer.File[]) {
        const { title, content, category, members } = annotation;

        const userId = user.sub
        const existingAnnotation = await this.checkExistingAnnotation(title, category, userId);

        if (existingAnnotation) throw new ConflictException("Essa anotacao já existe");


        if (members) this.validateMembers(members)

        let uploadedFileUrls: AttachmentDTO[] = [];
        let uploadedAttachmentsUrls: AttachmentDTO[] = [];

        // Upload de novos arquivos (imagens ou documentos)
        if (files && files.length > 0) uploadedFileUrls = await this.uploadFiles(files);


        if (attachments && attachments.length > 0) uploadedAttachmentsUrls = await this.uploadFiles(attachments);



        await this.processContent(content, uploadedFileUrls);

        const annotationToCreate = {
            title,
            content,
            category,
            members,
            createdUserId: userId,
            attachments: uploadedAttachmentsUrls,
            groupId,
        };

        const createdAnnotation = new this.annotationModel(annotationToCreate);
        await createdAnnotation.save();

        return annotationToCreate;
    }

    // Busca anotacao pelo id
    async fetchById(annotationId: string) {
        const annotation = await this.annotationModel.findById(annotationId).exec();
        if (!annotation) throw new ConflictException("Anotação não encontrada")
        return annotation
    }

    //faz filtro por pesquisa, estudar se pode ser so uma de busca, e essa implementar na outra
    async fetchBySearchAndUser(user: TokenPayloadSchema, page: number, query?: string) {
        const userId = user.sub;
        const limit = 10;
        const skip = (page - 1) * limit;

        const filters: any = {
            $or: [
                { createdUserId: userId },
                { 'members.userId': userId }
            ]
        };

        // Só adiciona filtros de busca se query existir
        if (query && query.trim() !== "") {
            const regex = new RegExp(query, 'i');
            const isDate = !isNaN(Date.parse(query));

            filters.$or.push({ title: { $regex: regex } });
            filters.$or.push({ category: { $regex: regex } });

            if (isDate) {
                const searchDate = new Date(query);
                const nextDay = new Date(searchDate);
                nextDay.setDate(searchDate.getDate() + 1);

                filters.$or.push({
                    date: {
                        $gte: searchDate.toISOString(),
                        $lt: nextDay.toISOString(),
                    }
                });
            }
        }

        const Annotations = await this.annotationModel
            .find(filters)
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit)
            .exec();

        return Annotations;
    }


    // Verifica se a anotação existe, se membro é valido e fa upload de arquivo, mesmo que faz no do update grupo
    async update(annotationId: string, annotation: UpdateAnnotationDTO, user: TokenPayloadSchema, files?: Express.Multer.File[], attachments?: Express.Multer.File[]) {
        const { title, content, category } = annotation;
        const userId = user.sub;

        const existingAnnotation = await this.checkExistingAnnotationById(annotationId);
        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");

        let existingAnnotationName;

        if (title && category) {
            existingAnnotationName = await this.checkExistingAnnotation(title, category, userId);

            if (
                existingAnnotationName &&
                existingAnnotation._id.toString() !== existingAnnotationName._id.toString()
            ) {
                throw new ConflictException("Já existe uma anotação com esse nome nessa categoria");
            }
        }


        const annotationToUpdate: UpdateAnnotationDTO = {};

        if (title) annotationToUpdate.title = title;
        if (category) annotationToUpdate.category = category;

        if (files || attachments) {
            let uploadedFileUrls: AttachmentDTO[] = [];
            let uploadedAttachmentsUrls: AttachmentDTO[] = [];

            if (files && files.length > 0) {
                uploadedFileUrls = await this.uploadFiles(files);
            }

            if (attachments && attachments.length > 0) {
                uploadedAttachmentsUrls = await this.uploadFiles(attachments);
            }

            if (existingAnnotation.attachments && attachments && uploadedAttachmentsUrls.length > 0) {
                annotationToUpdate.attachments = [...existingAnnotation.attachments, ...uploadedAttachmentsUrls];
            }

            if (files && content && uploadedFileUrls.length > 0) {
                await this.processContent(content, uploadedFileUrls);
            }
        }

        if (content && content.length > 0) {
            annotationToUpdate.content = content;
        }

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            annotationToUpdate,
            { new: true }
        ).exec();

        return updatedAnnotation;
    }

    // Verifica se a anotação existe, se membro é valido e fa upload de arquivo, mesmo que faz no do update grupo
    async updateByGroup(annotationId: string, groupId: string, annotation: UpdateAnnotationDTO, user: TokenPayloadSchema, files?: Express.Multer.File[], attachments?: Express.Multer.File[]) {
        const { title, content, category } = annotation;
        const userId = user.sub


        const existingAnnotation = await this.checkExistingAnnotationById(annotationId);
        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");

        let existingAnnotationName;

        if (title && category) {
            existingAnnotationName = await this.checkExistingAnnotation(title, category, userId);

            if (
                existingAnnotationName &&
                existingAnnotation._id.toString() !== existingAnnotationName._id.toString()
            ) {
                throw new ConflictException("Já existe uma anotação com esse nome nessa categoria");
            }
        }

        const annotationToUpdate: any = {};

        if (title) annotationToUpdate.title = title;
        if (category) annotationToUpdate.category = category;
        if (content) annotationToUpdate.content = content;
        if (files || attachments) {
            let uploadedFileUrls: AttachmentDTO[] = [];
            let uploadedAttachmentsUrls: AttachmentDTO[] = [];

            if (files && files.length > 0) {
                uploadedFileUrls = await this.uploadFiles(files);
            }

            if (attachments && attachments.length > 0) {
                uploadedAttachmentsUrls = await this.uploadFiles(attachments);
            }

            if (existingAnnotation.attachments && attachments && uploadedAttachmentsUrls.length > 0) {
                annotationToUpdate.attachments = [...existingAnnotation.attachments, ...uploadedAttachmentsUrls];
            }

            if (files && content && uploadedFileUrls.length > 0) {
                await this.processContent(content, uploadedFileUrls);
            }
        }

        // Atualizar o campo 'content' com o novo conteúdo após as imagens terem sido processadas
        if (content && content.length > 0) {
            annotationToUpdate.content = content;  // Atualizando o campo content com o novo conteúdo
        }

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            annotationToUpdate,
            { new: true }
        ).exec();

        return updatedAnnotation;

    }

    // Verifica se a anotação existe, se membro é valido e faz update de usuario, cria notificacao 
    async addMember(annotationId: string, members: MemberDTO[], user: TokenPayloadSchema) {
        const userId = user.sub;

        const existingAnnotation = await this.checkExistingAnnotationById(annotationId);
        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");

        const isAddingSelf = members.some(
            (member) => member.userId.toString() === userId
        );
        if (isAddingSelf) {
            throw new ConflictException("Você não pode adicionar seu próprio usuário");
        }

        if (members) this.validateMembers(members);

        const existingMembers = existingAnnotation.members || [];
        const newMembers = [...existingMembers];

        for (const member of members) {
            const alreadyExists = existingMembers.some(
                ({ userId: existingId }) => existingId.toString() === member.userId.toString()
            );
            if (alreadyExists) {
                throw new ConflictException("Usuário já cadastrado na lista de membros");
            }

            newMembers.push(member);

            this.createNotification("Nova anotação", `Você foi adicionado à anotação ${existingAnnotation.title}`, existingAnnotation._id.toString(), "ANNOTATION", members.map(member => member.userId))
        }

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { members: newMembers },
            { new: true }
        ).exec();

        return updatedAnnotation;
    }

    // Verifica se a anotação existe, se membro é valido e faz atualizacao de permissao de usuario, cria notificacao
    async updatePermissonMember(annotationId: string, memberId: string, accessType: string, user: TokenPayloadSchema) {
        const userId = user.sub;

        const existingAnnotation = await this.checkExistingAnnotationById(annotationId);
        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");

        const editedUserId = memberId === userId

        if (editedUserId) throw new ConflictException("Você não pode mudar a permissão do seu proprio usuário");

        await this.checkExistingMember(existingAnnotation.members, memberId)

        const updatedMembers = existingAnnotation.members.map((member) => {
            if (member.userId.toString() === memberId) {
                return {
                    userId: memberId,
                    accessType: accessType,
                }
            }

            return member;
        });

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { members: updatedMembers },
            { new: true }
        ).exec();

        this.createNotification("Permissão na anotação", `Você agora tem permissão de ${accessType} no grupo ${existingAnnotation.title}.`, existingAnnotation._id.toString(), "ANNOTATION", [memberId])

        return updatedAnnotation;
    }

    // Verifica se a anotação existe, se membro é valido e se o usuario tem permissao para isso, nao e necessario essa verificacao, cria notificacao 
    async deleteMember(annotationId: string, memberId: string, user: TokenPayloadSchema) {
        const userId = user.sub

        const existingAnnotation = await this.checkExistingAnnotationById(annotationId);
        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");

        await this.checkExistingMember(existingAnnotation.members, memberId)

        const updatedMembers = existingAnnotation.members?.filter(
            member => member.userId.toString() !== memberId
        );

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { members: updatedMembers },
            { new: true }
        ).exec();

        this.createNotification("Membro removido", `Você foi removido da anotação ${existingAnnotation.title}.`, existingAnnotation._id.toString(), "ANNOTATION", [memberId])

        return updatedAnnotation;
    }

    // Verifica se a anotação existe, se grupo é valido e cria notificacao
    async addGroup(annotationId: string, newGroupId: string) {
        const existingAnnotation = await this.checkExistingAnnotationById(annotationId);
        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");

        const existingGroup = await this.checkExistingGroupById(newGroupId)

        if (!existingGroup) throw new ConflictException("Grupo nao existe nessa anotação");

        const currentGroups = existingAnnotation.groupId || [];

        if (currentGroups) {
            currentGroups.map(group => {
                if (group === newGroupId) {
                    throw new ConflictException("Essa anotacao ja esta neste grupo");
                }
            })
        }

        const updatedGroups = [...currentGroups, newGroupId];

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { groupId: updatedGroups },
            { new: true }
        ).exec();

        this.createNotification("Nova anotação", `A anotação ${existingAnnotation.title} foi adicionada no grupo.`, existingAnnotation._id.toString(), "ANNOTATION", existingGroup.members.map(member => member.userId))

        return updatedAnnotation;
    }

    // Verifica se a anotação existe, se grupo é valido e cria notificacao
    async deleteGroup(annotationId: string, newGroupId: string) {
        const existingAnnotation = await this.checkExistingAnnotationById(annotationId);
        if (!existingAnnotation) throw new ConflictException("Essa anotacao não existe");

        if (!existingAnnotation.groupId) throw new ConflictException("Essa anotacao nao esta em um grupo");

        const group = await this.checkExistingGroupById(newGroupId)

        if (!group) throw new ConflictException("Grupo nao existe nessa anotação");


        const existingGroup = existingAnnotation.groupId.map(group => group === newGroupId)

        if (!existingGroup) throw new ConflictException("Grupo nao existe nessa anotação");


        const updatedGroups = existingAnnotation.groupId.filter(
            group => group !== newGroupId
        );

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { groupId: updatedGroups },
            { new: true }
        ).exec();

        this.createNotification("Anotação deletado", `A anotação ${existingAnnotation.title}  foi excluida do ${group.name}.`, group._id.toString(), "ANNOTATION", group.members.map(member => member.userId))

        return updatedAnnotation;
    }

    // Verifica se a anotação existe,
    async deleteAnnotation(annotationId: string) {
        const annotation = await this.checkExistingAnnotationById(annotationId);

        if (!annotation) throw new ConflictException("Essa anotação não existe");

        annotation.content.filter(content => {
            if (content.type === "image" && typeof content.value !== "string") {
                this.uploadService.delete(content.value.url)
            }
        });

        annotation.attachments?.filter(attachment => {
            this.uploadService.delete(attachment.url)
        });

        await this.annotationModel.findByIdAndDelete(annotationId).exec();

        this.createNotification("Anotação deletado", `A anotação ${annotation.title}  foi excluida.`, annotation._id.toString(), "ANNOTATION", annotation.members.map(member => member.userId))

        return { message: "Anotacao excluída com sucesso" };
    }

    // Verifica se a anotação existe e se o anexo existe
    async deleteAttachment(annotationId: string, attachmentName: string) {
        const existingAnnotation = await this.checkExistingAnnotationById(annotationId);
        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");


        const attachments = existingAnnotation.attachments as AttachmentDTO[];

        const found = attachments.find(att => att.url === attachmentName);
        if (!found) throw new NotFoundException("Anexo não encontrado");


        const newAttachment = attachments.filter(attachment => attachment.url !== attachmentName)
        this.uploadService.delete(attachmentName)
        await this.annotationModel.findByIdAndUpdate(annotationId, { attachments: newAttachment }, { new: true })

    }

    // ---------- MÉTODOS PRIVADOS ----------

    private async checkExistingAnnotation(title: string, category: string, userId: string, groupId?: string) {
        return await this.annotationModel.findOne({ title, category, createdUserId: userId, groupId });
    }

    private async checkExistingAnnotationById(annotationId: string) {
        return await this.annotationModel.findById(annotationId);
    }

    private async checkExistingGroupById(groupId: string) {
        return await this.groupService.fetchById(groupId);
    }

    private async checkExistingMember(members: MemberDTO[], memberId: string) {
        const existingMember = members.some(member => member.userId.toString() === memberId)

        if (!existingMember) throw new ConflictException("Membro nao existe nessa anotação");
    }

    private validateMembers(members: MemberDTO[]) {
        const userIds = members.map(member => member.userId.toString());
        const uniqueUserIds = new Set(userIds);
        if (uniqueUserIds.size !== userIds.length) {
            throw new ConflictException("Não é permitido membros duplicados.");
        }
    }

    private async uploadFiles(files: Express.Multer.File[]) {
        const uploadedFileUrls: AttachmentDTO[] = [];
        for (const file of files) {
            const result = await this.uploadService.upload(file);
            uploadedFileUrls.push(result);
        }
        return uploadedFileUrls;
    }

    private async processContent(content: any[], uploadedFileUrls: AttachmentDTO[]) {
        if (content && uploadedFileUrls.length > 0) {
            let imageIndex = 0;
            content.forEach((block) => {
                if (block.type === 'image' && imageIndex < uploadedFileUrls.length) {
                    block.value = uploadedFileUrls[imageIndex];
                    imageIndex++;
                }
            });
        }
    }

    private async createNotification(title: string, message: string, id: string, type: "ANNOTATION" | "GROUP", members: string[]) {
        const notification: CreateNotificationDto = {
            title,
            message,
            type,
            status: false,
            itemId: id,
            userId: members.map(member => member)

        }

        this.notificationService.create(notification)
        // Envia notificação
        this.notificationsGateway.sendAddMemberNotification(notification);
    }
}