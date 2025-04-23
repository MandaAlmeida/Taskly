import { Type } from "class-transformer";
import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { MemberDTO } from "./member.dto";
import { ApiProperty } from "@nestjs/swagger";
import { AttachmentDTO } from "./attachment.dto";

export class CreateAnnotationDTO {
    @IsNotEmpty({ message: "Titulo é obrigatório" })
    @IsString()
    @ApiProperty({
        description: "Titulo da anotacao",
        example: "Estudo sobre Nest"
    })
    title: string;

    @IsNotEmpty({ message: "Conteudo é obrigatório" })
    @IsString()
    @ApiProperty({
        description: "Conteudo da anotacao",
        example: "NestJS é um framework para construção de aplicações Node.js escaláveis e de fácil manutenção. Ele utiliza TypeScript por padrão e é fortemente inspirado na arquitetura do Angular, com uso de decorators, injeção de dependência e módulos, tornando o código mais organizado e testável. É ideal para criar APIs robustas, sendo compatível com bibliotecas populares como TypeORM, Mongoose, Passport, entre outras."
    })
    content: string;

    @IsNotEmpty({ message: "Categoria é obrigatória" })
    @IsString()
    @ApiProperty({
        description: "Categoria onde a anotacao se encontra",
        example: "Estudo"
    })
    category: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberDTO)
    @ApiProperty({
        description: "Com quem voce quer compartilhar essa anotacao",
        example: [
            {
                "userId": "67f84a94f3512313ce56e030",
                "accessType": "VIEWER"
            }
        ]
    })
    members?: MemberDTO[];

    @ApiProperty({ type: AttachmentDTO, required: false })
    @IsOptional()
    @IsArray()
    attachment?: Express.Multer.File;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    groupId?: string[];
}

export class UpdateAnnotationDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Titulo da anotacao",
        example: "Estudo sobre Nest"
    })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Conteudo da anotacao",
        example: "NestJS é um framework para construção de aplicações Node.js escaláveis e de fácil manutenção. Ele utiliza TypeScript por padrão e é fortemente inspirado na arquitetura do Angular, com uso de decorators, injeção de dependência e módulos, tornando o código mais organizado e testável. É ideal para criar APIs robustas, sendo compatível com bibliotecas populares como TypeORM, Mongoose, Passport, entre outras."
    })
    content?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Categoria onde a anotacao se encontra",
        example: "Estudo"
    })
    category?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberDTO)
    @ApiProperty({
        description: "Com quem voce quer compartilhar essa anotacao",
        example: [
            {
                "userId": "67f84a94f3512313ce56e030",
                "accessType": "VIEWER"
            }
        ]
    })
    members?: MemberDTO[];

    @ApiProperty({ type: AttachmentDTO, required: false })
    @IsOptional()
    @IsArray()
    attachment?: AttachmentDTO[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    groupId?: string[];
}
