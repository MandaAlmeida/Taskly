import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { MemberDTO } from "./member.dto";

export class CreateNotificationDto {
    @IsNotEmpty({ message: "Titulo é obrigatório" })
    @IsString()
    @ApiProperty({
        description: "Titulo da notificacao",
        example: "Nova anotação"
    })
    title: string;

    @IsNotEmpty({ message: "Mensagem é obrigatório" })
    @IsString()
    @ApiProperty({
        description: "Mensagem da notificacao",
        example: "Você foi adicionado a anotação Teste"
    })
    message: string;

    @IsNotEmpty({ message: "Tipo é obrigatório" })
    @IsString()
    @ApiProperty({
        description: "Tipo da notificacao",
        example: "Grupo"
    })
    type: "ANNOTATION" | "GROUP";

    @IsNotEmpty({ message: "Status é obrigatório" })
    @IsBoolean()
    @ApiProperty({
        description: "Status da notificacao",
        example: "false"
    })
    status: boolean;

    @IsNotEmpty({ message: "O item e obrigatorio" })
    @IsString()
    @ApiProperty({
        description: "Id da anotação ou do grupo",
        example: "681cb49d58c85d3c0e107648"
    })
    itemId: string

    @IsNotEmpty({ message: "Usuario é obrigatório" })
    @IsString()
    @ApiProperty({
        description: "Id do usuario que recebeu a notificacao",
        example: "681910f7ab7bf761f48c1d5e"
    })
    userId: string[];
}