
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from "zod-validation-error"

// Fazer validacao do zod, global
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) { }

    transform(value: unknown) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (error) {
            //especifica o erro
            if (error instanceof ZodError) {
                throw new BadRequestException({
                    erros: fromZodError(error),
                    message: 'Validation failed',
                    statusCode: 400
                })
            }
            throw new BadRequestException('Validation failed');
        }
    }
}
