import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ConflictException, NotFoundException, ForbiddenException } from "@nestjs/common";
import { Model } from "mongoose";
import { Categories, CategoriesDocument } from "@/models/category.schema";
import { CategoriesService } from "@/services/category.service";

// Mocks
const mockCategoryModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
};

const mockUser = { sub: "user123" };
const createCategoryDTO = {
    category: "Test Category",
    color: "blue",
    icon: 1,
};

describe("CategoriesService", () => {
    let service: CategoriesService;
    let model: typeof mockCategoryModel;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoriesService,
                {
                    provide: getModelToken(Categories.name),
                    useValue: mockCategoryModel,
                },
            ],
        }).compile();

        service = module.get<CategoriesService>(CategoriesService);
        model = module.get<typeof mockCategoryModel>(getModelToken(Categories.name));
    });

    afterEach(() => jest.clearAllMocks());

    describe("create()", () => {
        it("deve criar nova categoria se não existir", async () => {
            model.findOne.mockResolvedValueOnce(null);
            model.create.mockResolvedValueOnce({ ...createCategoryDTO, userId: mockUser.sub });

            const result = await service.create(createCategoryDTO, mockUser);

            expect(result).toMatchObject({ ...createCategoryDTO, userId: mockUser.sub });
            expect(model.create).toHaveBeenCalledWith({ ...createCategoryDTO, userId: mockUser.sub });
        });

        it("deve lançar ConflictException se categoria já existir", async () => {
            model.findOne.mockResolvedValueOnce({ category: createCategoryDTO.category, userId: mockUser.sub });

            await expect(service.create(createCategoryDTO, mockUser)).rejects.toThrow(ConflictException);
        });
    });

    describe("fetch()", () => {
        it("deve retornar todas as categorias do usuário", async () => {
            const mockCategories = [
                { category: "Test 1", userId: mockUser.sub },
                { category: "Test 2", userId: mockUser.sub },
            ];

            model.find.mockResolvedValueOnce(mockCategories);

            const result = await service.fetch(mockUser);

            expect(result).toEqual(mockCategories);
            expect(model.find).toHaveBeenCalledWith({ userId: mockUser.sub });
        });
    });

    describe("fetchById()", () => {
        it("deve retornar a categoria pelo ID", async () => {
            const mockCategory = { category: "Test", userId: mockUser.sub };

            model.findById.mockResolvedValueOnce(mockCategory);

            const result = await service.fetchById("categoryId");

            expect(result).toEqual(mockCategory);
            expect(model.findById).toHaveBeenCalledWith("categoryId");
        });

        it("deve lançar NotFoundException se não encontrada", async () => {
            model.findById.mockResolvedValueOnce(null);

            await expect(service.fetchById("categoryId")).rejects.toThrow(NotFoundException);
        });
    });

    describe("update()", () => {
        const updatedDTO = { category: "New Category", color: "green", icon: 2 };

        it("deve atualizar categoria corretamente", async () => {
            const mockCategory = { _id: "categoryId", userId: mockUser.sub };
            model.findById.mockResolvedValueOnce(mockCategory);
            model.findOne.mockResolvedValueOnce(null);
            model.findByIdAndUpdate.mockResolvedValueOnce({ ...mockCategory, ...updatedDTO });

            const result = await service.update("categoryId", updatedDTO, mockUser);

            expect(result).toMatchObject(updatedDTO);
            expect(model.findByIdAndUpdate).toHaveBeenCalledWith("categoryId", { $set: updatedDTO }, { new: true });
        });

        it("deve lançar erro se categoria não existe", async () => {
            model.findById.mockResolvedValueOnce(null);

            await expect(service.update("categoryId", updatedDTO, mockUser)).rejects.toThrow(NotFoundException);
        });

        it("deve lançar erro se usuário não for o dono da categoria", async () => {
            const mockCategory = { _id: "categoryId", userId: "otherUser" };
            model.findById.mockResolvedValueOnce(mockCategory);

            await expect(service.update("categoryId", updatedDTO, mockUser)).rejects.toThrow(ForbiddenException);
        });

        it("deve lançar erro se nome da categoria já existir", async () => {
            const mockCategory = { _id: "categoryId", userId: mockUser.sub };
            model.findById.mockResolvedValueOnce(mockCategory);
            model.findOne.mockResolvedValueOnce({ _id: "anotherId" });

            await expect(service.update("categoryId", updatedDTO, mockUser)).rejects.toThrow(ConflictException);
        });
    });

    describe("delete()", () => {
        it("deve deletar categoria se for do usuário", async () => {
            const mockCategory = { _id: "categoryId", category: "Teste", userId: mockUser.sub };
            model.findById.mockResolvedValueOnce(mockCategory);
            model.findByIdAndDelete.mockResolvedValueOnce(mockCategory);

            const result = await service.delete("categoryId", mockUser);

            expect(result).toEqual({ message: "Categoria excluída com sucesso" });
            expect(model.findByIdAndDelete).toHaveBeenCalledWith("categoryId");
        });

        it("deve lançar NotFoundException se categoria não existir", async () => {
            model.findById.mockResolvedValueOnce(null);

            await expect(service.delete("categoryId", mockUser)).rejects.toThrow(NotFoundException);
        });

        it("deve lançar ForbiddenException se for de outro usuário", async () => {
            const mockCategory = { _id: "categoryId", category: "Teste", userId: "otherUser" };
            model.findById.mockResolvedValueOnce(mockCategory);

            await expect(service.delete("categoryId", mockUser)).rejects.toThrow(ForbiddenException);
        });

        it("deve lançar ForbiddenException se categoria for protegida", async () => {
            const mockCategory = { _id: "categoryId", category: "Todas", userId: mockUser.sub };
            model.findById.mockResolvedValueOnce(mockCategory);

            await expect(service.delete("categoryId", mockUser)).rejects.toThrow(ForbiddenException);
        });
    });
});
