import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { TokenPayloadSchema } from "@/auth/jwt.strategy";
import { InjectModel } from "@nestjs/mongoose";
import { Group, GroupDocument } from "@/models/groups.schema";
import { Model } from "mongoose";
import { CreateGroupDTO, UpdateGroupDTO } from "@/contracts/group.dto";
import { CreateNotificationDto } from "@/contracts/notification.dto";
import { NotificationsService } from "./notifications.service";
import { NotificationsGateway } from "@/gateway/notifications.gateway";
import { MemberDTO } from "@/contracts/member.dto";

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
        private notificationService: NotificationsService,
        private notificationsGateway: NotificationsGateway
    ) { }

    private async sendNotification(notification: CreateNotificationDto) {
        await this.notificationService.create(notification);
        this.notificationsGateway.sendAddMemberNotification(notification);
    }

    private validateUniqueMembers(members: MemberDTO[]) {
        const userIds = members.map((m) => m.userId.toString());
        const hasDuplicates = new Set(userIds).size !== userIds.length;
        if (hasDuplicates) {
            throw new ConflictException("Não é permitido membros duplicados.");
        }
    }

    async create(group: CreateGroupDTO, user: TokenPayloadSchema) {
        const { name, description, members, color, icon } = group;
        const userId = user.sub;

        const existing = await this.groupModel.findOne({ name, createdUserId: userId });
        if (existing) throw new ConflictException("Esse grupo já existe.");

        if (members) this.validateUniqueMembers(members);

        const newGroup = await this.groupModel.create({
            name,
            description,
            color,
            icon,
            members,
            createdUserId: userId,
        });

        return newGroup;
    }

    async fetch(user: TokenPayloadSchema) {
        const userId = user.sub;
        return this.groupModel.find({
            $or: [{ createdUserId: userId }, { "members.userId": userId }],
        });
    }

    async fetchById(groupId: string) {
        return this.groupModel.findById(groupId);
    }

    async fetchByPage(user: TokenPayloadSchema, page: number) {
        const userId = user.sub;
        const limit = 20;
        const skip = (page - 1) * limit;

        return this.groupModel
            .find({
                $or: [{ createdUserId: userId }, { "members.userId": userId }],
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }

    async fetchBySearch(query: string, user: TokenPayloadSchema) {
        const userId = user.sub;
        const regex = new RegExp(query, "i");
        const isDate = !isNaN(Date.parse(query));
        const filters: any[] = [{ name: { $regex: regex } }];

        if (isDate) {
            const date = new Date(query);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);

            filters.push({ date: { $gte: date.toISOString(), $lt: nextDay.toISOString() } });
        }

        return this.groupModel.find({
            createdUserId: userId,
            $or: filters,
        });
    }

    async update(groupId: string, data: UpdateGroupDTO, user: TokenPayloadSchema) {
        const { name, description, icon, color } = data;
        const userId = user.sub;

        const existingGroup = await this.groupModel.findById(groupId);
        if (!existingGroup) throw new NotFoundException("Grupo não encontrado.");

        if (name) {
            const duplicate = await this.groupModel.findOne({ name, createdUserId: userId });
            if (duplicate && duplicate._id.toString() !== groupId) {
                throw new ConflictException("Já existe um grupo com esse nome.");
            }
        }

        return this.groupModel.findByIdAndUpdate(
            groupId,
            { name, description, icon, color },
            { new: true }
        );
    }

    async addMember(groupId: string, members: MemberDTO[]) {
        const group = await this.groupModel.findById(groupId);
        if (!group) throw new NotFoundException("Grupo não encontrado.");

        this.validateUniqueMembers(members);

        for (const member of members) {
            const alreadyExists = group.members.some(
                (m) => m.userId.toString() === member.userId.toString()
            );
            if (alreadyExists) {
                throw new ConflictException("Usuário já está na lista de membros.");
            }
        }

        const updatedMembers = [...group.members, ...members];

        const notification: CreateNotificationDto = {
            title: "Novo grupo",
            message: `Você foi adicionado ao grupo ${group.name}.`,
            type: "GROUP",
            status: false,
            itemId: group._id.toString(),
            userId: members.map((m) => m.userId),
        };

        await this.sendNotification(notification);

        return this.groupModel.findByIdAndUpdate(
            groupId,
            { members: updatedMembers },
            { new: true }
        );
    }

    async updatePermissonMember(groupId: string, memberId: string, accessType: string) {
        const group = await this.groupModel.findById(groupId);
        if (!group) throw new NotFoundException("Grupo não encontrado.");

        const exists = group.members.some((m) => m.userId.toString() === memberId);
        if (!exists) throw new ConflictException("Membro não encontrado no grupo.");

        const updatedMembers = group.members.map((m) =>
            m.userId.toString() === memberId ? { ...m, accessType } : m
        );

        const notification: CreateNotificationDto = {
            title: "Permissão alterada",
            message: `Sua permissão foi atualizada para ${accessType} no grupo ${group.name}.`,
            type: "GROUP",
            status: false,
            itemId: group._id.toString(),
            userId: [memberId],
        };

        await this.sendNotification(notification);

        return this.groupModel.findByIdAndUpdate(
            groupId,
            { members: updatedMembers },
            { new: true }
        );
    }

    async deleteMember(groupId: string, memberId: string) {
        const group = await this.groupModel.findById(groupId);
        if (!group) throw new NotFoundException("Grupo não encontrado.");

        const exists = group.members.some((m) => m.userId.toString() === memberId);
        if (!exists) throw new ConflictException("Membro não encontrado no grupo.");

        const updatedMembers = group.members.filter(
            (m) => m.userId.toString() !== memberId
        );

        const notification: CreateNotificationDto = {
            title: "Removido do grupo",
            message: `Você foi removido do grupo ${group.name}.`,
            type: "GROUP",
            status: false,
            itemId: group._id.toString(),
            userId: [memberId],
        };

        await this.sendNotification(notification);

        return this.groupModel.findByIdAndUpdate(
            groupId,
            { members: updatedMembers },
            { new: true }
        );
    }

    async delete(groupId: string) {
        const group = await this.groupModel.findById(groupId);
        if (!group) throw new NotFoundException("Grupo não encontrado.");

        await this.groupModel.findByIdAndDelete(groupId);

        const notification: CreateNotificationDto = {
            title: "Grupo deletado",
            message: `O grupo ${group.name} foi excluído.`,
            type: "GROUP",
            status: false,
            itemId: group._id.toString(),
            userId: group.members.map((m) => m.userId),
        };

        await this.sendNotification(notification);

        return { message: "Grupo excluído com sucesso." };
    }
}
