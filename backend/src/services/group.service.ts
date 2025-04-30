import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { InjectModel } from "@nestjs/mongoose";
import { Group, GroupDocument } from "@/models/groups.schema";
import { Model } from "mongoose";
import { CreateGroupDTO, UpdateGroupDTO } from "@/contracts/group.dto";

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>
    ) { }

    // Criação de grupo, evitando nomes duplicados e membros repetidos
    async create(group: CreateGroupDTO, user: TokenPayloadSchema) {
        const { name, description, members } = group;
        const userId = user.sub;

        const existingGroup = await this.groupModel.findOne({ name, createdUserId: userId });
        if (existingGroup) throw new ConflictException("Essa grupo já existe");

        // Garante unicidade dos membros, se informados
        if (members) {
            const userIds = members.map(member => member.userId.toString());
            const uniqueUserIds = new Set(userIds);
            if (uniqueUserIds.size !== userIds.length) {
                throw new ConflictException("Não é permitido membros duplicados.");
            }
        }

        const groupToCreate = { name, createdUserId: userId, description, members };
        const createdGroup = new this.groupModel(groupToCreate);
        await createdGroup.save();

        return groupToCreate;
    }

    // Busca grupos onde o usuário é criador ou membro
    async fetch(user: TokenPayloadSchema) {
        const userId = user.sub;
        const filter = {
            $or: [
                { createdUserId: userId },
                { 'members.userId': userId }
            ]
        };

        return await this.groupModel.find(filter).exec();
    }

    // Retorna grupo por ID
    async fetchById(groupId: string) {
        return await this.groupModel.findById(groupId).exec();
    }

    // Paginação simples com 20 itens por página, ordenado por data de criação
    async fetchByPage(user: TokenPayloadSchema, page: number) {
        const userId = user.sub;
        const filter = {
            $or: [
                { createdUserId: userId },
                { 'members.userId': userId }
            ]
        };
        const limit = 20;
        const skip = (page - 1) * limit;

        return await this.groupModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
    }

    // Busca por nome ou data (se for uma data válida)
    async fetchBySearch(query: string, user: TokenPayloadSchema) {
        const userId = user.sub;
        const regex = new RegExp(query, 'i');
        const isDate = !isNaN(Date.parse(query));

        const filters: any[] = [{ name: { $regex: regex } }];

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

        return await this.groupModel.find({
            createdUserId: userId,
            $or: filters,
        });
    }

    // Atualização de grupo com validações de nome único e tratamento de membros
    async update(groupId: string, group: UpdateGroupDTO, user: TokenPayloadSchema) {
        const { name, description, members } = group;
        const userId = user.sub;

        const existingGroup = await this.groupModel.findById(groupId);
        if (!existingGroup) throw new ConflictException("Essa group não existe");

        const existingGroupName = await this.groupModel.findOne({ name, createdUserId: userId });
        if (existingGroupName) throw new ConflictException("Ja existe um grupo com esse nome");

        const groupToUpdate: any = {};
        if (name) groupToUpdate.name = name;
        if (description) groupToUpdate.description = description;

        if (members && members.length > 0) {
            const userIds = members.map(m => m.userId.toString());
            const duplicates = userIds.filter((id, i) => userIds.indexOf(id) !== i);
            if (duplicates.length > 0) throw new ConflictException("Usuário duplicado na lista de membros");

            const existingMembers = existingGroup.members || [];
            const updateMembers = [...existingMembers];

            members.forEach(newMember => {
                const index = updateMembers.findIndex(
                    member => member.userId.toString() === newMember.userId.toString()
                );

                if (index === -1) {
                    updateMembers.push(newMember);
                } else if (updateMembers[index].accessType !== newMember.accessType) {
                    updateMembers[index].accessType = newMember.accessType;
                }
            });

            groupToUpdate.members = updateMembers;
        }

        return await this.groupModel.findByIdAndUpdate(
            groupId,
            groupToUpdate,
            { new: true }
        ).exec();
    }

    // Adiciona novos membros ao grupo, evitando duplicatas
    async addMember(groupId: string, group: CreateGroupDTO) {
        const { members = [] } = group;

        const existingGroup = await this.groupModel.findById(groupId);
        if (!existingGroup) throw new ConflictException("Essa anotação não existe");

        const userIds = members.map(m => m.userId.toString());
        const hasDuplicates = new Set(userIds).size !== userIds.length;
        if (hasDuplicates) throw new ConflictException("Usuário duplicado na lista de membros");

        const existingMembers = existingGroup.members || [];
        const newMembers = [...existingMembers];

        for (const member of members) {
            const alreadyExists = existingMembers.some(
                ({ userId }) => userId.toString() === member.userId.toString()
            );
            if (alreadyExists) {
                throw new ConflictException("Usuário já cadastrado na lista de membros");
            }
            newMembers.push(member);
        }

        return await this.groupModel.findByIdAndUpdate(
            groupId,
            { members: newMembers },
            { new: true }
        ).exec();
    }

    // Atualiza permissão de um membro específico
    async updatePermissonMember(groupId: string, memberId: string, body: { accessType: string }) {
        const type = body.accessType;
        const existingGroup = await this.groupModel.findById(groupId);
        if (!existingGroup) throw new ConflictException("Essa anotação não existe");

        const existingMember = existingGroup.members.some(
            member => member.userId.toString() === memberId
        );
        if (!existingMember) throw new ConflictException("Membro nao existe nessa anotação");

        const updatedMembers = existingGroup.members.map((member) => {
            if (member.userId.toString() === memberId) {
                return { userId: memberId, accessType: type };
            }
            return member;
        });

        return await this.groupModel.findByIdAndUpdate(
            groupId,
            { members: updatedMembers },
            { new: true }
        ).exec();
    }

    // Remove um membro do grupo
    async deleteMember(groupId: string, memberId: string) {
        const group = await this.groupModel.findById(groupId).exec();
        if (!group) throw new NotFoundException("Anotatacao não encontrada");

        const existingGroup = await this.groupModel.findById(groupId);
        if (!existingGroup) throw new ConflictException("Essa anotacao não existe");

        const existingMember = existingGroup.members.some(
            member => member.userId.toString() === memberId
        );
        if (!existingMember) throw new ConflictException("Membro nao existe nessa anotação");

        const updatedMembers = group.members?.filter(
            member => member.userId.toString() !== memberId
        );

        return await this.groupModel.findByIdAndUpdate(
            groupId,
            { members: updatedMembers },
            { new: true }
        ).exec();
    }

    // Exclusão definitiva do grupo
    async delete(groupId: string) {
        const group = await this.groupModel.findById(groupId).exec();
        if (!group) throw new NotFoundException("Grupo não encontrada");

        await this.groupModel.findByIdAndDelete(groupId).exec();

        return { message: "Grupo excluída com sucesso" };
    }
}
