import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateGroupDTO, UpdateGroupDTO } from '@/contracts/group.dto';
import { GroupService } from "../services/group.service"
import { RoleGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorator/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Group')
@ApiBearerAuth('access-token')
@Controller("group")
@UseGuards(JwtAuthGuard, RoleGuard)
export class GroupController {
    constructor(
        private readonly GroupService: GroupService,
    ) { }

    @Post("create")
    async create(@Body() event: CreateGroupDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.GroupService.create(event, user);
    }

    @Get("fetch")
    async fetch(@CurrentUser() user: TokenPayloadSchema) {
        return this.GroupService.fetch(user);
    }

    @Get("fetchByPage")
    async fetchByPage(@CurrentUser() user: TokenPayloadSchema, @Query("p") page: number) {
        return this.GroupService.fetchByPage(user, page);
    }

    @Get("search")
    async fetchBySearch(@Query("q") query: string, @CurrentUser() user: TokenPayloadSchema) {
        return this.GroupService.fetchBySearch(query, user);
    }

    @Roles("ADMIN")
    @Put("update/:id")
    async update(@Param('id') groupId: string, @Body() group: UpdateGroupDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.GroupService.update(groupId, group, user)
    }

    @Roles("ADMIN")
    @Patch("update/:groupId/members")
    async addMember(@Param('groupId') groupId: string, @Body() members: UpdateGroupDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.GroupService.addMember(groupId, members)
    }

    @Roles("ADMIN")
    @Patch("update/:groupId/members/:memberId")
    async updatePermissonMember(@Param('groupId') groupId: string, @Param('memberId') memberId: string, @Body() body: { accessType: string }) {
        return this.GroupService.updatePermissonMember(groupId, memberId, body)
    }

    @Roles("ADMIN")
    @Delete("delete/:id")
    async delete(@Param('id') groupId: string) {
        return this.GroupService.delete(groupId);
    }

    @Roles("ADMIN")
    @Delete("delete/:groupId/members/:memberId")
    async deleteMember(@Param('groupId') groupId: string, @Param('memberId') memberId: string) {
        return this.GroupService.deleteMember(groupId, memberId);
    }
}
