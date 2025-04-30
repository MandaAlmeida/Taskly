import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { TaskService } from '../services/task.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateTaskDTO, UpdateTaskDTO } from '@/contracts/task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateSubTaskDTO } from '@/contracts/subTask.dto';
import { query } from 'express';

@ApiTags('Task')
@ApiBearerAuth('access-token')
@Controller("task")
@UseGuards(JwtAuthGuard)
export class TaskController {
    constructor(
        private readonly TaskService: TaskService,
    ) { }

    @Post("create")
    async create(@Body() event: CreateTaskDTO, @CurrentUser() user: TokenPayloadSchema): Promise<CreateTaskDTO> {
        return this.TaskService.create(event, user);
    }

    @Get("fetch")
    async fetchByPage(@CurrentUser() user: TokenPayloadSchema): Promise<CreateTaskDTO[]> {
        return this.TaskService.fetch(user);
    }

    @Get("fetchById/:taskId")
    async fetchById(@Param("taskId") taskId: string) {
        return this.TaskService.fetchById(taskId);
    }

    @Get("fetchByPage")
    async fetch(@CurrentUser() user: TokenPayloadSchema, @Query("p") page: number): Promise<CreateTaskDTO[]> {
        return this.TaskService.fetchByPage(user, page);
    }

    @Get("search")
    async fetchByFilter(@Query("q") query: string, @CurrentUser() user: TokenPayloadSchema): Promise<CreateTaskDTO[]> {
        return this.TaskService.fetchBySearch(query, user);
    }

    @Put("update/:id")
    async update(@Param('id') taskId: string, @Body() task: UpdateTaskDTO) {
        return this.TaskService.update(taskId, task)
    }

    @Patch("update-status")
    async updateStatus(@CurrentUser() user: TokenPayloadSchema) {
        return this.TaskService.updateStatus(user)
    }

    @Delete("deleteSubTask/:id")
    async deleteSubTask(@Param('id') taskId: string, @Query("sub") subTask: string) {
        return this.TaskService.deleteSubTask(taskId, subTask);
    }

    @Delete("delete/:id")
    async delete(@Param('id') taskId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.TaskService.delete(taskId, user);
    }

}
