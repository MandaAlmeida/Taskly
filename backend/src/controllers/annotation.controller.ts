import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AnnotationService } from '../services/annotation.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateAnnotationDTO, UpdateAnnotationDTO, } from '@/contracts/annotation.dto';
import { Roles } from '@/decorator/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { RoleGuard } from '@/guards/roles.guard';
import { AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';

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
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'files', maxCount: 5 },
        { name: 'attachments', maxCount: 10 },
    ]))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateAnnotationDTO })
    async create(
        @Body(new ValidationPipe({ transform: true })) body: CreateAnnotationDTO,
        @CurrentUser() user: TokenPayloadSchema,
        @UploadedFiles() files: { files?: Express.Multer.File[], attachments?: Express.Multer.File[] }
    ) {
        return this.AnnotationService.create(body, user, files.files, files.attachments);
    }

    @Roles("ADMIN", "EDIT", "DELETE")
    @Post("createByGroup/:groupId")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'files', maxCount: 5 },
        { name: 'attachments', maxCount: 10 },
    ]))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateAnnotationDTO })
    async createByGroup(@Body() body: CreateAnnotationDTO, @Param("groupId") groupId: string, @CurrentUser() user: TokenPayloadSchema, @UploadedFiles() files: { files?: Express.Multer.File[], attachments?: Express.Multer.File[] }) {
        return this.AnnotationService.createByGroup(body, groupId, user, files.files, files.attachments);
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

    @Get("search")
    async fetchByFilter(@Query("q") query: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.fetchBySearch(query, user);
    }

    @Roles("ADMIN", "EDIT", "DELETE")
    @Put("update/:annotationId")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'files', maxCount: 5 },
        { name: 'attachments', maxCount: 10 },
    ]))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateAnnotationDTO })
    async update(@Param('annotationId') annotationId: string, @Body() annotation: UpdateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema, @UploadedFiles() files: { files?: Express.Multer.File[], attachments?: Express.Multer.File[] }) {
        return this.AnnotationService.update(annotationId, annotation, user, files.files, files.attachments)
    }

    @Roles("ADMIN", "EDIT", "DELETE")
    @Put("update/:annotationId/groups/:groupId")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'files', maxCount: 5 },
        { name: 'attachments', maxCount: 10 },
    ]))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateAnnotationDTO })
    async updateByGroup(@Param('annotationId') annotationId: string, @Param('groupId') groupId: string, @Body() annotation: UpdateAnnotationDTO, @CurrentUser() user: TokenPayloadSchema, @UploadedFiles() files: { files?: Express.Multer.File[], attachments?: Express.Multer.File[] }) {
        return this.AnnotationService.updateByGroup(annotationId, groupId, annotation, user, files.files, files.attachments)
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
    @Delete("delete/:annotationId/attachment/:attachmentName")
    async deleteAttachment(@Param('annotationId') annotationId: string, @Param("attachmentName") attachmentName: string) {
        return this.AnnotationService.deleteAttachment(annotationId, attachmentName);
    }

    @Roles("ADMIN")
    @Delete("delete/:annotationId")
    async deleteByUser(@Param('annotationId') annotationId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationService.deleteAnnotation(annotationId);
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
