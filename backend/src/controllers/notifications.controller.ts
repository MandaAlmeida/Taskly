import { CurrentUser } from '@/auth/current-user-decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { TokenPayloadSchema } from '@/auth/jwt.strategy';
import { SavePushTokenDto } from '@/contracts/save-token.dto';
import { PushTokenRepository } from '@/database/push-token.repository';
import admin from '@/firebase/firebase-admin';
import { NotificationsService } from '@/services/notifications.service';
import {
    Controller,
    Get,
    Delete,
    Param,
    Query,
    Put,
    Body,
    UseGuards,
    Post,
    InternalServerErrorException,
} from '@nestjs/common';


@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly pushTokenRepository: PushTokenRepository

    ) { }

    /**
     * Buscar notificação por usuario
     */
    @Get('fetch')
    async fetch(@CurrentUser() user: TokenPayloadSchema, @Query("p") page: number) {
        return await this.notificationsService.fetch(user, page);
    }

    @Put('updateViewAll')
    async updateViewAll(@CurrentUser() user: TokenPayloadSchema) {
        return await this.notificationsService.updateStatusViewAll(user);
    }

    @Put('updateView/:notificationId')
    async updateView(@CurrentUser() user: TokenPayloadSchema, @Param('notificationId') notificationId: string, @Body("status") status: boolean) {
        return await this.notificationsService.updateStatusView(user, notificationId, status);
    }


    @Post("save-token")
    async savaToken(@Body() PushToken: SavePushTokenDto) {
        return await this.pushTokenRepository.saveToken(PushToken)
    }

    /**
     * Deletar notificação
     */
    @Delete(':notificationId')
    async deleteFile(@CurrentUser() user: TokenPayloadSchema, @Param('notificationId') notificationId: string) {
        return await this.notificationsService.delete(user, notificationId);
    }
}
