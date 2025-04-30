import { CurrentUser } from '@/auth/current-user-decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from '@/contracts/user.dto';
import { UserService } from '@/services/user.service';
import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller("user")
export class UserController {
    constructor(
        private readonly UserService: UserService,
    ) { }

    @Post("register")
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateUserDTO })
    async create(@UploadedFile() file: Express.Multer.File, @Body() user: CreateUserDTO) {
        return this.UserService.create(user, file);
    }

    @Post("login")
    async login(@Body() user: LoginUserDTO): Promise<{ token: string }> {
        return this.UserService.login(user)
    }


    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get("fetch")
    async fetchByToken(@CurrentUser() user: TokenPayloadSchema) {
        return this.UserService.fetchByToken(user)
    }

    @Get("fetch/:id")
    async fetchById(@Param("id") userId: string) {
        return this.UserService.fetchById(userId)
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateUserDTO })
    @Put("update")
    async update(@Body() updateUser: UpdateUserDTO, @CurrentUser() user: TokenPayloadSchema, @UploadedFile() file: Express.Multer.File) {
        return this.UserService.update(updateUser, user, file)
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Delete("delete")
    async delete(@CurrentUser() user: TokenPayloadSchema) {
        return this.UserService.delete(user)
    }

}
