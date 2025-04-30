import { IsString } from "class-validator";

export class AttachmentDTO {
    @IsString()
    type: string

    @IsString()
    title: string;

    @IsString()
    url: string;
}