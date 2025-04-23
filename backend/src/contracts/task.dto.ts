import { Status } from "@/enum/status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";

export class CreateTaskDTO {
    @IsNotEmpty({ message: "Nome é obrigatório" })
    @IsString()
    @ApiProperty({
        description: "Nome da tarefa",
        example: "Estudar Nest"
    })
    name: string;

    @IsNotEmpty({ message: "Categoria é obrigatória" })
    @IsString()
    @ApiProperty({
        description: "Nome da categoria onde a tarefa sera alocada",
        example: "Estudo"
    })
    category: string;

    @IsNotEmpty({ message: "Sub Categoria é obrigatória" })
    @IsString()
    @ApiProperty({
        description: "Nome da sub-categoria onde a tarefa sera alocada",
        example: "Cursinho"
    })
    subCategory: string;

    @IsNotEmpty({ message: "Prioridade é obrigatória" })
    @IsString()
    @ApiProperty({
        description: "Prioridade para executar a tarefa",
        example: "3"
    })
    priority: string;

    @IsNotEmpty({ message: "Data é obrigatória" })
    @Type(() => Date)
    @IsDate()
    @ApiProperty({
        description: "Data que deve executar a tarefa",
        example: "2025-04-16T12:00:00.000+00:00"
    })
    date: Date;
}

export class UpdateTaskDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Nome da tarefa",
        example: "Estudar Nest"
    })
    name?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Nome da categoria onde a tarefa sera alocada",
        example: "Estudo"
    })
    category?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Nome da sub-categoria onde a tarefa sera alocada",
        example: "Cursinho"
    })
    subCategory?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Prioridade para executar a tarefa",
        example: "3"
    })
    priority?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    @ApiProperty({
        description: "Data que deve executar a tarefa",
        example: "2025-04-16T12:00:00.000+00:00"
    })
    date?: Date;

    @IsOptional()
    @IsEnum(Status, {
        message: 'Status inválido',
    })
    @ApiProperty({
        description: "Status da tarefa",
        example: "Today"
    })
    status?: Status;
}
