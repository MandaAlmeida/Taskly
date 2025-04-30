import { Status } from "@/enum/status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";
import { CreateSubTaskDTO, SubTaskDTO } from "./subTask.dto";

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
        example: "6807b90e03651e11e3d74804"
    })
    category: string;

    @IsNotEmpty({ message: "Sub Categoria é obrigatória" })
    @IsString()
    @ApiProperty({
        description: "Nome da sub-categoria onde a tarefa sera alocada",
        example: "680917898733608bb5f0cd9a"
    })
    subCategory: string;

    @IsOptional()
    @IsArray()
    @ApiProperty({
        description: "Sub-tarefas a serem executadas dentro da tarefa",
        example: [
            {
                task: "O que é o NestJS? Arquitetura e conceitos principais",
                status: "COMPLETED"
            },
            {
                task: "Estrutura de pastas (modularização)",
                status: "PENDING"
            },
            {
                task: "Decorators (@Module(), @Controller(), @Injectable(), etc.)",
                status: "PENDING"
            },
            {
                task: "Controllers e rotas",
                status: "PENDING"
            },
            {
                task: "Services e injeção de dependência (DI)",
                status: "PENDING"
            },
            {
                task: "Pipes, Guards e Interceptors – o que são e para que servem",
                status: "PENDING"
            }
        ]
    })
    subTask?: CreateSubTaskDTO[];

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
        example: "6807b90e03651e11e3d74804"
    })
    category?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Nome da sub-categoria onde a tarefa sera alocada",
        example: "680917898733608bb5f0cd9a"
    })
    subCategory?: string;


    @IsOptional()
    @IsArray()
    @ApiProperty({
        description: "Sub-tarefas a serem executadas dentro da tarefa",
        example: [
            {
                task: "O que é o NestJS? Arquitetura e conceitos principais",
                status: "COMPLETED"
            },
            {
                task: "Estrutura de pastas (modularização)",
                status: "PENDING"
            },
            {
                task: "Decorators (@Module(), @Controller(), @Injectable(), etc.)",
                status: "PENDING"
            },
            {
                task: "Controllers e rotas",
                status: "PENDING"
            },
            {
                task: "Services e injeção de dependência (DI)",
                status: "PENDING"
            },
            {
                task: "Pipes, Guards e Interceptors – o que são e para que servem",
                status: "PENDING"
            }
        ]
    })
    subTask?: SubTaskDTO[];

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
