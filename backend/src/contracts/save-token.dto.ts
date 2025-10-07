import { IsString } from 'class-validator';

export class SavePushTokenDto {
    @IsString()
    userId: string;

    @IsString()
    token: string;
}
