import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class CreateSubTaskDTO {
    @IsString()
    @ApiProperty({
        description: "Qual a tarefa a ser executada",
        example: "O que é o NestJS? Arquitetura e conceitos principais"
    })
    task: string;

    @IsIn(["COMPLETED", "PENDING"], { message: "O tipo de status deve ser 'COMPLETED', 'PENDING'" })
    @ApiProperty({
        description: "Define o status da sub tarefa",
        example: "PENDING"
    })
    status: "COMPLETED" | "PENDING";
}

export class SubTaskDTO {
    @IsString()
    _id: string;

    @IsString()
    @ApiProperty({
        description: "Qual a tarefa a ser executada",
        example: "O que é o NestJS? Arquitetura e conceitos principais"
    })
    task: string;

    @IsIn(["COMPLETED", "PENDING"], { message: "O tipo de status deve ser 'COMPLETED', 'PENDING'" })
    @ApiProperty({
        description: "Define o status da sub tarefa",
        example: "PENDING"
    })
    status: "COMPLETED" | "PENDING";
}