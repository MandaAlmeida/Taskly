import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";


export class CreateSubCategoryDTO {
    @IsNotEmpty({ message: "Nome da sub categoria é obrigatório" })
    @IsString()
    @ApiProperty({
        description: "Nome da subCategoria",
        example: "Curso"
    })
    subCategory: string;

    @IsNotEmpty({ message: "Selecionar a categoria é obrigatório" })
    @IsString()
    @ApiProperty({
        description: "Nome da categoria onde subcategoria sera alocada",
        example: "Estudo"
    })
    categoryName: string;

    @IsNotEmpty({ message: "Icone é obrigatória" })
    @IsString()
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

export class UpdateSubCategoryDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Nome da subCategoria",
        example: "Curso"
    })
    subCategory: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Nome da categoria onde subcategoria sera alocada",
        example: "Estudo"
    })
    categoryName: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Icone da categoria",
        example: "GraduationCap"
    })
    icon: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Cor da categoria",
        example: "#FBBC05"
    })
    color: string;
}