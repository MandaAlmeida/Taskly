import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AnnotationService } from '../services/annotation.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateAnnotationDTO, UpdateAnnotationDTO, } from '@/contracts/annotation.dto';
import { Roles } from '@/decorator/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { RoleGuard } from '@/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsString } from 'class-validator';

@ApiTags('Annotation')
@Controller("annotation")
@ApiBearerAuth('access-token')
@UseGuards(RoleGuard)
@UseGuards(JwtAuthGuard)
export class AnnotationController {
    constructor(
        private readonly AnnotationService: AnnotationService,
    ) { }

    @Post("create")
    @UseInterceptors(FileInterceptor('attachment'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateAnnotationDTO })
    async create(@UploadedFile() file: Express.Multer.File, @Body() body: CreateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.create(body, file, user);
    }


    @Roles("ADMIN", "EDIT", "DELETE")
    @Post("createByGroup/:groupId")
    @UseInterceptors(FileInterceptor('attachment'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateAnnotationDTO })
    async createByGroup(@UploadedFile() file: Express.Multer.File, @Body() body: CreateAnnotationDTO, @Param("groupId") groupId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.createByGroup(body, groupId, file, user);
    }

    @Get("fetchByUser")
    async fetchByUser(@CurrentUser() user: TokenPayloadSchema, @Query("p") page: number) {
        return this.AnnotationService.fetchByUser(user, page);
    }

    @Get("fetchByGroup")
    async fetchByGroup(@CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.fetchByGroup(user);
    }

    @Get("fetchById/:annotationId")
    async fetchById(@Param('annotationId') annotationId: string) {
        return this.AnnotationService.fetchById(annotationId);
    }

    @Get("fetchByPage")
    async fetchByPage(@CurrentUser() user: TokenPayloadSchema, @Query("p") page: number) {
        return this.AnnotationService.fetchByPage(user, page);
    }

    @Get("fetchAttachment")
    async fetchAttachment(@Query("attachment") fileName: string) {
        return this.AnnotationService.fetchAttachment(fileName);
    }

    @Get("search")
    async fetchByFilter(@Query("q") query: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.fetchBySearch(query, user);
    }

    @Roles("ADMIN", "EDIT", "DELETE")
    @Put("update/:annotationId")
    @UseInterceptors(FileInterceptor('attachment'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateAnnotationDTO })
    async update(@Param('annotationId') annotationId: string, @Body() annotation: UpdateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema, @UploadedFile() file: Express.Multer.File) {
        return this.AnnotationService.update(annotationId, annotation, file, user)
    }

    @Roles("ADMIN", "EDIT", "DELETE")
    @Put("update/:annotationId/groups/:groupId")
    @UseInterceptors(FileInterceptor('attachment'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateAnnotationDTO })
    async updateByGroup(@Param('annotationId') annotationId: string, @Param('groupId') groupId: string, @Body() annotation: UpdateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema, @UploadedFile() file: Express.Multer.File) {
        return this.AnnotationService.updateByGroup(annotationId, groupId, annotation, file, user)
    }

    @Roles("ADMIN")
    @Patch("update/:annotationId/members")
    async addNewMember(@Param('annotationId') annotationId: string, @Body() members: UpdateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.addMember(annotationId, members, user)
    }

    @Roles("ADMIN")
    @Patch("update/:annotationId/members/:memberId")
    async updatePermissonMember(@Param('annotationId') annotationId: string, @Param('memberId') memberId: string, @Body() body: { accessType: string }, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.updatePermissonMember(annotationId, memberId, body, user)
    }

    @Roles("ADMIN")
    @Patch("update/:annotationId/groups/:groupId")
    async addNewGroup(@Param('annotationId') annotationId: string, @Param('groupId') newGroupId: string) {
        return this.AnnotationService.addGroup(annotationId, newGroupId)
    }

    @Roles("ADMIN", "DELETE")
    @Delete("delete/:annotationId/attachment")
    async deleteAttachment(@Param('annotationId') annotationId: string, @Query("anexo") attachmentName: string) {
        return this.AnnotationService.deleteAttachment(annotationId, attachmentName);
    }

    @Roles("ADMIN", "DELETE")
    @Delete("delete/:annotationId")
    async deleteByUser(@Param('annotationId') annotationId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.deleteAnnotation(annotationId);
    }

    @Roles("ADMIN", "DELETE")
    @Delete("delete/:groupId/:annotationId")
    async deleteByGroup(@Param('annotationId') annotationId: string, @Param('groupId') groupId: string) {
        return this.AnnotationService.deleteAnnotationByGroup(annotationId, groupId);
    }

    @Roles("ADMIN")
    @Delete("delete/:annotationId/members/:memberId")
    async deleteMember(@Param('annotationId') annotationId: string, @Param('memberId') memberId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.deleteMember(annotationId, memberId, user);
    }

    @Roles("ADMIN")
    @Delete("delete/:annotationId/groups/:groupId")
    async deleteGroup(@Param('annotationId') annotationId: string, @Param('groupId') newGroupId: string) {
        return this.AnnotationService.deleteGroup(annotationId, newGroupId);
    }
}
