import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AnnotationsService } from '../services/annotation.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateAnnotationDTO, UpdateAnnotationDTO, } from '@/contracts/annotation.dto';
import { Roles } from '@/decorator/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { RoleGuard } from '@/guards/roles.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MemberDTO } from '@/contracts/member.dto';

@ApiTags('Annotation')
@Controller("annotation")
@ApiBearerAuth('access-token')
@UseGuards(RoleGuard)
@UseGuards(JwtAuthGuard)
export class AnnotationController {
    constructor(
        private readonly AnnotationsService: AnnotationsService,
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
        return this.AnnotationsService.create(body, user, files.files, files.attachments);
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
        return this.AnnotationsService.createByGroup(body, groupId, user, files.files, files.attachments);
    }

    @Get("fetchByUser")
    async fetchBysearchAndUser(@CurrentUser() user: TokenPayloadSchema, @Query("p") page: number, @Query("q") query?: string) {
        return this.AnnotationsService.fetchBySearchAndUser(user, page, query);
    }

    @Get("fetchById/:annotationId")
    async fetchById(@Param('annotationId') annotationId: string) {
        return this.AnnotationsService.fetchById(annotationId);
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
        return this.AnnotationsService.update(annotationId, annotation, user, files.files, files.attachments)
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
        return this.AnnotationsService.updateByGroup(annotationId, groupId, annotation, user, files.files, files.attachments)
    }

    @Roles("ADMIN")
    @Patch("update/:annotationId/members")
    async addNewMember(@Param('annotationId') annotationId: string, @Body() members: MemberDTO[], @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationsService.addMember(annotationId, members, user)
    }

    @Roles("ADMIN")
    @Patch("update/:annotationId/members/:memberId")
    async updatePermissonMember(@Param('annotationId') annotationId: string, @Param('memberId') memberId: string, @Body("accessType") accessType: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationsService.updatePermissonMember(annotationId, memberId, accessType, user)
    }

    @Roles("ADMIN")
    @Patch("update/:annotationId/groups/:groupId")
    async addNewGroup(@Param('annotationId') annotationId: string, @Param('groupId') newGroupId: string) {
        return this.AnnotationsService.addGroup(annotationId, newGroupId)
    }

    @Roles("ADMIN", "DELETE")
    @Delete("delete/:annotationId/attachment/:attachmentName")
    async deleteAttachment(@Param('annotationId') annotationId: string, @Param("attachmentName") attachmentName: string) {
        return this.AnnotationsService.deleteAttachment(annotationId, attachmentName);
    }

    @Roles("ADMIN")
    @Delete("delete/:annotationId")
    async deleteByUser(@Param('annotationId') annotationId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationsService.deleteAnnotation(annotationId);
    }

    @Roles("ADMIN")
    @Delete("delete/:annotationId/members/:memberId")
    async deleteMember(@Param('annotationId') annotationId: string, @Param('memberId') memberId: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.AnnotationsService.deleteMember(annotationId, memberId, user);
    }

    @Roles("ADMIN")
    @Delete("delete/:annotationId/groups/:groupId")
    async deleteGroup(@Param('annotationId') annotationId: string, @Param('groupId') newGroupId: string) {
        return this.AnnotationsService.deleteGroup(annotationId, newGroupId);
    }
}
