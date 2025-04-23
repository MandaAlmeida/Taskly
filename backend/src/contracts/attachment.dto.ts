import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AttachmentDTO {
    @IsString()
    title: string;

    @IsString()
    url: string;
}