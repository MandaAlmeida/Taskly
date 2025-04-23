import { CurrentUser } from '@/auth/current-user-decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateSubCategoryDTO, UpdateSubCategoryDTO } from '@/contracts/subCategory.dto';
import { SubCategoryService } from '@/services/subCategory.service';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Sub Category')
@ApiBearerAuth('access-token')
@Controller("sub-category")
@UseGuards(JwtAuthGuard)
export class SubCategoryController {
    constructor(
        private readonly SubCategoryService: SubCategoryService,
    ) { }

    @Post("create")
    async create(@Body() subCategory: CreateSubCategoryDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.SubCategoryService.create(subCategory, user);
    }

    @Get("fetch")
    async fetch(@CurrentUser() user: TokenPayloadSchema) {
        return this.SubCategoryService.fetch(user);
    }

    @Get("fetch/:id")
    async fetchByIdCategory(@Param('id') categoryId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.SubCategoryService.fetchByIdCategory(categoryId, user);
    }

    @Get("fetchById/:subCategoryId")
    async fetchById(@Param("subCategoryId") subCategoryId: string) {
        return this.SubCategoryService.fetchById(subCategoryId);
    }

    @Put("update/:id")
    async update(@Param('id') subCategoryId: string, @Body() subCategory: UpdateSubCategoryDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.SubCategoryService.update(subCategoryId, subCategory, user)
    }


    @Delete("delete/:id")
    async delete(@Param('id') subCategoryId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.SubCategoryService.delete(subCategoryId, user);
    }

}
