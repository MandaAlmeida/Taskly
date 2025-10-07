
import { Type } from "class-transformer";
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { ObjectId } from "mongoose";
import { MemberDTO } from "./member.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateGroupDTO {
    @IsNotEmpty({ message: "Nome é obrigatório" })
    @IsString()
    @ApiProperty({
        description: "Nome do grupo",
        example: "Grupo de estudo"
    })
    name: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberDTO)
    @ApiProperty({
        description: "Com quem voce quer compartilhar esse grupo",
        example: [
            {
                "userId": "67f84a94f3512313ce56e030",
                "accessType": "VIEWER"
            }
        ]
    })
    members?: MemberDTO[];

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Descricao do grupo",
        example: "Grupo dedicado para estudo de Nest"
    })
    description?: string;

    @IsNotEmpty({ message: "Icone é obrigatória" })
    @IsNumber()
    @ApiProperty({
        description: "Icone da categoria",
        example: "1"
    })
    icon: number;

    @IsNotEmpty({ message: "Cor é obrigatória" })
    @IsString()
    @ApiProperty({
        description: "Cor da categoria",
        example: "#FBBC05"
    })
    color: string;
}

export class UpdateGroupDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Nome do grupo",
        example: "Grupo de estudo"
    })
    name: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Com quem criou esse grupo",
        example: "67f84a94f3512313ce56e030"
    })
    createdUserId: ObjectId[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberDTO)
    @ApiProperty({
        description: "Com quem voce quer compartilhar esse grupo",
        example: [
            {
                "userId": "67f84a94f3512313ce56e030",
                "accessType": "VIEWER"
            }
        ]
    })
    members?: MemberDTO[];

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Descricao do grupo",
        example: "Grupo dedicado para estudo de Nest"
    })
    description?: string;

    @IsNotEmpty({ message: "Icone é obrigatória" })
    @IsNumber()
    @ApiProperty({
        description: "Icone da categoria",
        example: "1"
    })
    icon: number;

    @IsNotEmpty({ message: "Cor é obrigatória" })
    @IsString()
    @ApiProperty({
        description: "Cor da categoria",
        example: "#FBBC05"
    })
    color: string;
}
