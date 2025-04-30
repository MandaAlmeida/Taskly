import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsIn, IsOptional, ValidateNested } from "class-validator";
import { AttachmentDTO } from "./attachment.dto";
import { Type } from "class-transformer";

export class ContentDTO {
    @ApiProperty({
        description: "Tipo do conteúdo",
        example: "text",
    })
    @IsIn(["text", "image"], { message: "O tipo de conteúdo deve ser 'text' ou 'image'" })
    type: string;

    @ApiProperty({
        description: "Conteúdo a ser adicionado (pode ser texto ou um anexo)",
        oneOf: [
            { type: 'string', example: "Texto da anotação" },
            { $ref: '#/components/schemas/AttachmentDTO' }
        ]
    })
    @IsOptional()
    @IsString({ message: 'Se for uma string, deve ser um texto válido.' })
    @ValidateNested({ each: true })
    @Type(() => AttachmentDTO)
    value: string | AttachmentDTO;
}
