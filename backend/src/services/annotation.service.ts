import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Annotation, AnnotationDocument } from "@/models/annotations.schema";
import { CreateAnnotationDTO, UpdateAnnotationDTO } from "@/contracts/annotation.dto";
import { UploadService } from "./upload.service";
import { AttachmentDTO } from "@/contracts/attachment.dto";

@Injectable()
export class AnnotationService {
    constructor(
        @InjectModel(Annotation.name) private annotationModel: Model<AnnotationDocument>,
        private uploadService: UploadService
    ) { }

    async create(annotation: CreateAnnotationDTO, user: TokenPayloadSchema, files?: Express.Multer.File[], attachments?: Express.Multer.File[]) {
        const { title, content, category, members } = annotation;

        const userId = user.sub
        const existingAnnotation = await this.annotationModel.findOne({ title, category, createdUserId: userId });

        if (existingAnnotation) {
            throw new ConflictException("Essa anotacao já existe");
        }

        if (members) {
            const userIds = members.map(member => member.userId.toString());

            const uniqueUserIds = new Set(userIds);

            if (uniqueUserIds.size !== userIds.length) {
                throw new ConflictException("Não é permitido membros duplicados.");
            }
        }

        let uploadedFileUrls: AttachmentDTO[] = [];
        let uploadedAttachmentsUrls: AttachmentDTO[] = [];

        // Upload de novos arquivos (imagens ou documentos)
        if (files && files.length > 0) {
            for (const file of files) {
                const result = await this.uploadService.upload(file);
                uploadedFileUrls.push(result);
            }
        }

        if (attachments && attachments.length > 0) {
            for (const attachment of attachments) {
                const result = await this.uploadService.upload(attachment);
                uploadedAttachmentsUrls.push(result);
            }
        }

        if (content && uploadedFileUrls.length > 0) {
            let imageIndex = 0;

            content.forEach((block) => {
                if (block.type === 'image' && imageIndex < uploadedFileUrls.length) {
                    block.value = uploadedFileUrls[imageIndex];
                    imageIndex++;
                }
            });
        }

        const annotationToCreate = {
            title,
            content,
            category,
            members,
            createdUserId: userId,
            attachments: uploadedAttachmentsUrls
        };

        const createdAnnotation = new this.annotationModel(annotationToCreate);
        await createdAnnotation.save();


        return annotationToCreate;
    }

    async createByGroup(annotation: CreateAnnotationDTO, groupId: string, user: TokenPayloadSchema, files?: Express.Multer.File[], attachments?: Express.Multer.File[]) {
        const { title, content, category, members } = annotation;

        const userId = user.sub
        const existingAnnotation = await this.annotationModel.findOne({ title, category, createdUserId: userId, groupId });

        if (existingAnnotation) {
            throw new ConflictException("Essa anotacao já existe");
        }

        if (members) {
            const userIds = members.map(member => member.userId.toString());

            const uniqueUserIds = new Set(userIds);

            if (uniqueUserIds.size !== userIds.length) {
                throw new ConflictException("Não é permitido membros duplicados.");
            }
        }

        let uploadedFileUrls: AttachmentDTO[] = [];
        let uploadedAttachmentsUrls: AttachmentDTO[] = [];

        // Upload de novos arquivos (imagens ou documentos)
        if (files && files.length > 0) {
            for (const file of files) {
                const result = await this.uploadService.upload(file);
                uploadedFileUrls.push(result);
            }
        }

        if (attachments && attachments.length > 0) {
            for (const attachment of attachments) {
                const result = await this.uploadService.upload(attachment);
                uploadedAttachmentsUrls.push(result);
            }
        }



        if (content && uploadedFileUrls.length > 0) {
            let imageIndex = 0;

            content.forEach((block) => {
                if (block.type === 'image' && imageIndex < uploadedFileUrls.length) {
                    block.value = uploadedFileUrls[imageIndex];
                    imageIndex++;
                }
            });
        }

        const annotationToCreate = {
            title,
            content,
            category,
            members,
            createdUserId: userId,
            attachments: uploadedAttachmentsUrls
        };

        const createdAnnotation = new this.annotationModel(annotationToCreate);
        await createdAnnotation.save();

        return annotationToCreate;
    }

    async fetchByUser(user: TokenPayloadSchema, page: number) {
        const userId = user.sub

        const limit = 10;
        const skip = (page - 1) * limit;
        const Annotations = await this.annotationModel.find({ createdUserId: userId }).sort({ date: 1 }).skip(skip).limit(limit).exec();

        return Annotations
    }

    async fetchByGroup(user: TokenPayloadSchema) {
        const userId = user.sub

        const filter = {
            $or: [
                { createdUserId: userId },
                { 'members.userId': userId }
            ]
        };

        const Annotations = await this.annotationModel.find(filter).sort({ date: 1 }).exec();

        return Annotations
    }

    async fetchById(annotationId: string) {
        return await this.annotationModel.findById(annotationId).exec();
    }

    async fetchByPage(user: TokenPayloadSchema, page: number) {
        const userId = user.sub

        const filter = {
            $or: [
                { createdUserId: userId },
                { 'members.userId': userId }
            ]
        };
        const limit = 10;
        const skip = (page - 1) * limit;
        return await this.annotationModel.find(filter).sort({ createdAt: 1 }).skip(skip).limit(limit).exec();
    }

    async fetchBySearch(query: string, user: TokenPayloadSchema) {
        const userId = user.sub
        const regex = new RegExp(query, 'i');
        const isDate = !isNaN(Date.parse(query));
        const filters: any[] = [
            { title: { $regex: regex } },
            { category: { $regex: regex } },
        ];

        if (isDate) {
            const searchDate = new Date(query);
            const nextDay = new Date(searchDate);
            nextDay.setDate(searchDate.getDate() + 1);

            filters.push({
                date: {
                    $gte: searchDate.toISOString(),
                    $lt: nextDay.toISOString(),
                },
            });
        }

        const annotations = await this.annotationModel.find({
            createdUserId: userId,
            $or: filters,
        });

        return annotations;
    }

    async update(annotationId: string, annotation: UpdateAnnotationDTO, user: TokenPayloadSchema, files?: Express.Multer.File[], attachments?: Express.Multer.File[]) {
        const { title, content, category } = annotation;
        const userId = user.sub;

        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");

        const existingAnnotationName = await this.annotationModel.findOne({ title, category, createdUserId: userId });


        if (existingAnnotation._id.toString() !== existingAnnotationName?._id.toString()) throw new ConflictException("Já existe uma anotação com esse nome nessa categoria");

        const annotationToUpdate: UpdateAnnotationDTO = {};

        if (title) annotationToUpdate.title = title;
        if (category) annotationToUpdate.category = category;

        // Processar arquivos (imagens e anexos)
        if (files || attachments) {
            let uploadedFileUrls: AttachmentDTO[] = [];
            let uploadedAttachmentsUrls: AttachmentDTO[] = [];

            // Upload de novos arquivos (imagens ou documentos)
            if (files && files.length > 0) {
                for (const file of files) {
                    const result = await this.uploadService.upload(file);
                    uploadedFileUrls.push(result);
                }
            }

            if (attachments && attachments.length > 0) {
                for (const attachment of attachments) {
                    const result = await this.uploadService.upload(attachment);
                    uploadedAttachmentsUrls.push(result);
                }
            }

            // Se houver novos arquivos, atualize os arquivos anexos
            if (existingAnnotation.attachments && attachments && uploadedAttachmentsUrls.length > 0) {
                annotationToUpdate.attachments = [...existingAnnotation.attachments, ...uploadedAttachmentsUrls];
            }

            // Substituir as imagens no conteúdo
            if (files && content && uploadedFileUrls.length > 0) {
                let imageIndex = 0;

                content.forEach((block) => {
                    if (block.type === 'image' && imageIndex < uploadedFileUrls.length) {
                        block.value = uploadedFileUrls[imageIndex];
                        imageIndex++;
                    }
                });
            }
        }

        // Atualizar o campo 'content' com o novo conteúdo após as imagens terem sido processadas
        if (content && content.length > 0) {
            annotationToUpdate.content = content;  // Atualizando o campo content com o novo conteúdo
        }

        // Atualizar a anotação no banco de dados
        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            annotationToUpdate,
            { new: true }
        ).exec();

        return updatedAnnotation;
    }

    async updateByGroup(annotationId: string, groupId: string, annotation: UpdateAnnotationDTO, user: TokenPayloadSchema, files?: Express.Multer.File[], attachments?: Express.Multer.File[]) {
        const { title, content, category } = annotation;
        const userId = user.sub

        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) throw new ConflictException("Essa anotacao não existe");

        const existingAnnotationName = await this.annotationModel.findOne({ title, category, createdUserId: userId, groupId });

        if (existingAnnotationName) throw new ConflictException("Ja existe uma anotacao com esse nome");

        const annotationToUpdate: any = {};

        if (title) annotationToUpdate.title = title;
        if (category) annotationToUpdate.category = category;
        if (content) annotationToUpdate.content = content;
        if (files || attachments) {
            let uploadedFileUrls: AttachmentDTO[] = [];
            let uploadedAttachmentsUrls: AttachmentDTO[] = [];

            // Upload de novos arquivos (imagens ou documentos)
            if (files && files.length > 0) {
                for (const file of files) {
                    const result = await this.uploadService.upload(file);
                    uploadedFileUrls.push(result);
                }
            }

            if (attachments && attachments.length > 0) {
                for (const attachment of attachments) {
                    const result = await this.uploadService.upload(attachment);
                    uploadedAttachmentsUrls.push(result);
                }
            }

            // Se houver novos arquivos, atualize os arquivos anexos
            if (existingAnnotation.attachments && attachments && uploadedAttachmentsUrls.length > 0) {
                const newAttachments = uploadedAttachmentsUrls.filter(file => !file.type.startsWith('image/'));
                annotationToUpdate.attachments = [...existingAnnotation.attachments, ...newAttachments];
            }

            // Substituir as imagens no conteúdo
            if (files && content && uploadedFileUrls.length > 0) {
                let imageIndex = 0;

                content.forEach((block) => {
                    if (block.type === 'image' && imageIndex < uploadedFileUrls.length) {
                        block.value = uploadedFileUrls[imageIndex];
                        imageIndex++;
                    }
                });
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

    async addMember(annotationId: string, annotation: UpdateAnnotationDTO, user: TokenPayloadSchema) {
        const { members = [] } = annotation;
        const userId = user.sub;

        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");

        const editedUserId = members.some(
            (member) => member.userId.toString() === userId
        );

        if (editedUserId) throw new ConflictException("Você não pode adicionar seu proprio Usuário");

        const userIds = members.map(member => member.userId.toString());

        const hasDuplicates = new Set(userIds).size !== userIds.length;

        if (hasDuplicates) throw new ConflictException("Usuário duplicado na lista de membros");


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
        }

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { members: newMembers },
            { new: true }
        ).exec();

        return updatedAnnotation;
    }

    async updatePermissonMember(annotationId: string, memberId: string, body: { accessType: string }, user: TokenPayloadSchema) {
        const userId = user.sub;

        const type = body.accessType;

        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");

        const editedUserId = memberId === userId

        if (editedUserId) throw new ConflictException("Você não pode mudar a permissão do seu proprio usuário");

        const existingMember = existingAnnotation.members.some(member => member.userId.toString() === memberId)

        if (!existingMember) throw new ConflictException("Membro nao existe nessa anotação");


        const updatedMembers = existingAnnotation.members.map((member) => {
            if (member.userId.toString() === memberId) {
                return {
                    userId: memberId,
                    accessType: type,
                }
            }

            return member;
        });

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { members: updatedMembers },
            { new: true }
        ).exec();

        return updatedAnnotation;
    }

    async deleteMember(annotationId: string, memberId: string, user: TokenPayloadSchema) {
        const userId = user.sub

        const annotation = await this.annotationModel.findById(annotationId).exec();

        if (!annotation) throw new NotFoundException("Anotatacao não encontrada");

        if (annotation.createdUserId.toString() !== userId) throw new ForbiddenException("Você não tem permissão para excluir membros desta anotação");

        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) throw new ConflictException("Essa anotacao não existe");

        const existingMember = existingAnnotation.members.some(member => member.userId.toString() === memberId)

        if (!existingMember) throw new ConflictException("Membro não existe nessa anotação");


        const updatedMembers = annotation.members?.filter(
            member => member.userId.toString() !== memberId
        );

        const updatedAnnotation = await this.annotationModel.findByIdAndUpdate(
            annotationId,
            { members: updatedMembers },
            { new: true }
        ).exec();

        return updatedAnnotation;

    }

    async addGroup(annotationId: string, newGroupId: string) {
        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) throw new ConflictException("Essa anotação não existe");


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

        return updatedAnnotation;
    }

    async deleteGroup(annotationId: string, newGroupId: string) {
        const existingAnnotation = await this.annotationModel.findById(annotationId);

        if (!existingAnnotation) throw new ConflictException("Essa anotacao não existe");

        if (!existingAnnotation.groupId) throw new ConflictException("Essa anotacao nao esta em um grupo");


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

        return updatedAnnotation;

    }

    async deleteAnnotation(annotationId: string) {
        const annotation = await this.annotationModel.findById(annotationId).exec();

        if (!annotation) throw new NotFoundException("Annotation não encontrada");

        annotation.content.filter(content => {
            if (content.type === "image" && typeof content.value !== "string") {
                this.uploadService.delete(content.value.url)
            }
        });

        await this.annotationModel.findByIdAndDelete(annotationId).exec();
        return { message: "Anotacao excluída com sucesso" };
    }

    async deleteAttachment(annotationId: string, attachmentName: string) {
        const annotation = await this.annotationModel.findById(annotationId).exec();

        if (!annotation) throw new NotFoundException("Anotação não encontrada");


        const attachments = annotation.attachments as AttachmentDTO[];

        const found = attachments.find(att => att.url === attachmentName);
        if (!found) throw new NotFoundException("Anexo não encontrado");


        const newAttachment = attachments.filter(attachment => attachment.url !== attachmentName)
        this.uploadService.delete(attachmentName)
        await this.annotationModel.findByIdAndUpdate(annotationId, { attachments: newAttachment }, { new: true })

    }

}