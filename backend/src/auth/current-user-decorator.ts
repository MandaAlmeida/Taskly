import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { TokenPayloadSchema } from "./jwt.strategy";


// Criado current como as que existe @Body, @Request,..., para limitar o que sera retornado
export const CurrentUser = createParamDecorator((_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as TokenPayloadSchema
}) 