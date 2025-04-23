import { UserRole } from "@/enum/userRole.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsMongoId } from "class-validator";
import { ObjectId } from "mongoose";

export class MemberDTO {
    @IsMongoId()
    @ApiProperty({
        description: "Id do usuario",
        example: "67f84a94f3512313ce56e030"
    })
    userId: ObjectId;

    @IsIn(["ADMIN", "EDIT", "DELETE", "VIEWER"], { message: "O tipo de acesso deve ser 'ADMIN', 'EDIT', 'DELETE', 'VIEWER'" })
    @ApiProperty({
        description: "Define o que o usuario tem permissao para fazer",
        example: "EDIT"
    })
    accessType: UserRole;
}