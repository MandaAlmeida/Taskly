import { CurrentUser } from '@/auth/current-user-decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateCategoryDTO, UpdateCategoryDTO } from '@/contracts/category.dto';
import { CategorysService } from '@/services/category.service';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Category')
@ApiBearerAuth('access-token')
@Controller("categories")
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(
        private readonly CategoriesService: CategorysService,
    ) { }

    @Post("create")
    async create(@Body() category: CreateCategoryDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.CategoriesService.create(category, user);
    }

    @Get("fetch")
    async fetch(@CurrentUser() user: TokenPayloadSchema) {
        return this.CategoriesService.fetch(user);
    }

    @Get("fetchById/:categoryId")
    async fetchById(@Param("categoryId") categoryId: string) {
        return this.CategoriesService.fetchById(categoryId);
    }

    @Put("update/:id")
    async update(@Param('id') categoryId: string, @Body() category: UpdateCategoryDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.CategoriesService.update(categoryId, category, user)
    }

    @Delete("delete/:id")
    async delete(@Param("id") categoryId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.CategoriesService.delete(categoryId, user);
    }

}
