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
    async fetch(@CurrentUser() user: TokenPayloadSchema) {
        return this.UserService.fetch(user)
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Put("update")
    async update(@Body() updateUser: UpdateUserDTO, @CurrentUser() user: TokenPayloadSchema) {
        return this.UserService.update(updateUser, user)
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Delete("delete/:id")
    async delete(@Param('id') userId: string) {
        return this.UserService.delete(userId)
    }

}
