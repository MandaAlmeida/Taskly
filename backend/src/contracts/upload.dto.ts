import { IsString, IsNumber } from 'class-validator';

export class UploadDTO {
    @IsString()
    fieldname: string;

    @IsString()
    originalname: string;

    @IsString()
    encoding: string;

    @IsString()
    mimetype: string;

    buffer: Buffer;

    @IsNumber()
    size: number;
}
