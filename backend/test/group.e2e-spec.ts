import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GroupService } from "@/services/group.service";
import { NotificationsService } from "@/services/notifications.service";
import { NotificationsGateway } from "@/gateway/notifications.gateway";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { Group } from "@/models/groups.schema";
import { CreateGroupDTO, UpdateGroupDTO } from "@/contracts/group.dto";
import { MemberDTO } from "@/contracts/member.dto";

const mockGroupModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
};

const mockNotificationService = {
    create: jest.fn(),
};

const mockNotificationsGateway = {
    sendAddMemberNotification: jest.fn(),
};

describe("GroupService", () => {
    let service: GroupService;
    let model: Model<Group>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GroupService,
                { provide: getModelToken(Group.name), useValue: mockGroupModel },
                { provide: NotificationsService, useValue: mockNotificationService },
                { provide: NotificationsGateway, useValue: mockNotificationsGateway },
            ],
        }).compile();

        service = module.get<GroupService>(GroupService);
        model = module.get<Model<Group>>(getModelToken(Group.name));
    });

    afterEach(() => jest.clearAllMocks());

    describe("create", () => {
        it("should throw ConflictException if group already exists", async () => {
            const mockUser = { sub: "user123" };
            const dto: CreateGroupDTO = {
                name: "Test Group",
                description: "A test group",
                members: [],
                color: "blue",
                icon: 1,
            };

            mockGroupModel.findOne.mockResolvedValueOnce({ name: dto.name, createdUserId: mockUser.sub });

            await expect(service.create(dto, mockUser)).rejects.toThrow(ConflictException);
        });

        it("should throw ConflictException if members are duplicated", async () => {
            const mockUser = { sub: "user123" };
            const dto: CreateGroupDTO = {
                name: "Test Group",
                description: "A test group",
                members: [{ userId: "user1", name: "Joao", accessType: "ADMIN" }, { userId: "user1", name: "Joao", accessType: "ADMIN" }],
                color: "blue",
                icon: 1,
            };

            await expect(service.create(dto, mockUser)).rejects.toThrow(ConflictException);
        });

        it("should create a new group successfully", async () => {
            const mockUser = { sub: "user123" };
            const dto: CreateGroupDTO = {
                name: "Test Group",
                description: "A test group",
                members: [{ userId: "user1", name: "Joao", accessType: "ADMIN" }],
                color: "blue",
                icon: 1,
            };

            mockGroupModel.findOne.mockResolvedValueOnce(null);
            mockGroupModel.create.mockResolvedValueOnce(dto);

            const result = await service.create(dto, mockUser);

            expect(mockGroupModel.create).toHaveBeenCalledWith({
                ...dto,
                createdUserId: mockUser.sub,
            });
            expect(result).toEqual(dto);
        });
    });

    describe("addMember", () => {
        it("should throw ConflictException if group does not exist", async () => {
            const groupId = "group123";
            const members: MemberDTO[] = [{ userId: "user1", name: "Joao", accessType: "ADMIN" }];
            mockGroupModel.findById.mockResolvedValueOnce(null);

            await expect(service.addMember(groupId, members)).rejects.toThrow(NotFoundException);
        });

        it("should throw ConflictException if member is already in the group", async () => {
            const groupId = "group123";
            const members: MemberDTO[] = [{ userId: "user1", name: "Joao", accessType: "ADMIN" }];
            const existingGroup = {
                members: [{ userId: "user1" }],
            };
            mockGroupModel.findById.mockResolvedValueOnce(existingGroup);

            await expect(service.addMember(groupId, members)).rejects.toThrow(ConflictException);
        });

        it("should add new members to the group", async () => {
            const groupId = "group123";
            const membersToAdd = [
                { userId: "user3", name: "Maria", accessType: "ADMIN" },
                { userId: "user4", name: "Pedro", accessType: "MEMBER" }
            ];

            const existingGroup = {
                _id: groupId,
                name: "Test Group",
                members: [
                    { userId: "user1", name: "Joao", accessType: "ADMIN" },
                    { userId: "user2", name: "Ana", accessType: "MEMBER" }
                ],
            };

            // Mock de findById para retornar um grupo existente
            mockGroupModel.findById.mockResolvedValueOnce(existingGroup);

            // Mock de findByIdAndUpdate para retornar o grupo com os membros adicionados
            mockGroupModel.findByIdAndUpdate.mockResolvedValueOnce({
                ...existingGroup,
                members: [...existingGroup.members, ...membersToAdd],
            });

            // Chama o serviço para adicionar os novos membros
            const result = await service.addMember(groupId, membersToAdd);

            // Verificação para garantir que findByIdAndUpdate foi chamado com o novo conjunto de membros
            expect(mockGroupModel.findByIdAndUpdate).toHaveBeenCalledWith(
                groupId,
                { members: [...existingGroup.members, ...membersToAdd] },
                { new: true }
            );

            // Verifica se os novos membros foram corretamente adicionados
            expect(result?.members).toContainEqual(membersToAdd[0]);
            expect(result?.members).toContainEqual(membersToAdd[1]);
        });


    });

    describe("deleteMember", () => {
        const mockGroup = {
            _id: "group123",
            name: "Test Group",
            members: [
                { userId: "user1", name: "Member 1" },
                { userId: "user2", name: "Member 2" }
            ]
        };

        it("should remove member from the group", async () => {
            const groupId = "group123";
            const memberId = "user1";

            // Mocking the group model
            mockGroupModel.findById.mockResolvedValueOnce(mockGroup);
            mockGroupModel.findByIdAndUpdate.mockResolvedValueOnce({
                ...mockGroup,
                members: mockGroup.members.filter(member => member.userId !== memberId)
            });

            const result = await service.deleteMember(groupId, memberId);

            // Verificando que o membro foi removido
            expect(result?.members).not.toContainEqual({ userId: memberId });

            // Verificando se a notificação foi enviada
            expect(mockNotificationService.create).toHaveBeenCalledWith(expect.objectContaining({
                title: "Removido do grupo",
                message: expect.stringContaining("Você foi removido do grupo")
            }));

            // Verificando se a função de envio de notificação foi chamada
            expect(mockNotificationsGateway.sendAddMemberNotification).toHaveBeenCalled();
        });

        it("should throw an error if the group does not exist", async () => {
            const groupId = "nonexistentGroupId";
            const memberId = "user1";

            // Simulando a ausência do grupo
            mockGroupModel.findById.mockResolvedValueOnce(null);

            await expect(service.deleteMember(groupId, memberId))
                .rejects
                .toThrow(NotFoundException);
        });

        it("should throw an error if the member does not exist", async () => {
            const groupId = "group123";
            const memberId = "nonexistentMember";

            // Simulando que o grupo existe, mas o membro não
            mockGroupModel.findById.mockResolvedValueOnce(mockGroup);

            await expect(service.deleteMember(groupId, memberId))
                .rejects
                .toThrow(ConflictException);
        });
    });


    describe("delete", () => {
        it("should throw NotFoundException if group does not exist", async () => {
            const groupId = "group123";
            mockGroupModel.findById.mockResolvedValueOnce(null);

            await expect(service.delete(groupId)).rejects.toThrow(NotFoundException);
        });

        it("should delete the group successfully", async () => {
            const groupId = "group123";
            const group = { _id: groupId, name: "Test Group", members: [{ userId: "user1" }] };
            mockGroupModel.findById.mockResolvedValueOnce(group);
            mockGroupModel.findByIdAndDelete.mockResolvedValueOnce(group);

            const result = await service.delete(groupId);

            expect(mockGroupModel.findByIdAndDelete).toHaveBeenCalledWith(groupId);
            expect(result.message).toBe("Grupo excluído com sucesso.");
        });
    });
});
