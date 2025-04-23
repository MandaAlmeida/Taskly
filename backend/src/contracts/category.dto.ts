import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";

export class CreateCategoryDTO {
    @IsNotEmpty({ message: "Nome da categoria é obrigatório" })
    @IsString()
    @ApiProperty({
        description: "Nome da categoria",
        example: "Estudo"
    })
    category: string;

    @IsNotEmpty({ message: "Icone é obrigatória" })
    @IsNumber()
    @ApiProperty({
        description: "Icone da categoria",
        example: "GraduationCap"
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


export class UpdateCategoryDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Nome da categoria",
        example: "Estudo"
    })
    category: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: "Icone da categoria",
        example: "GraduationCap"
    })
    icon: number;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Cor da categoria",
        example: "#FBBC05"
    })
    color: string;
}
