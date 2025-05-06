import { UserRole } from "@/enum/userRole.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsMongoId, IsString } from "class-validator";

export class MemberDTO {
    @IsString()
    @ApiProperty({
        description: "Id do usuario",
        example: "67f84a94f3512313ce56e030"
    })
    userId: string;

    @IsIn(["ADMIN", "EDIT", "DELETE", "VIEWER"], { message: "O tipo de acesso deve ser 'ADMIN', 'EDIT', 'DELETE', 'VIEWER'" })
    @ApiProperty({
        description: "Define o que o usuario tem permissao para fazer",
        example: "EDIT"
    })
    accessType: UserRole;
}