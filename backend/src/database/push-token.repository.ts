import { SavePushTokenDto } from "@/contracts/save-token.dto";
import { PushToken, PushTokenDocument } from "@/models/saveToken.schema";
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class PushTokenRepository {
    constructor(
        @InjectModel(PushToken.name) private pushTokenModel: Model<PushTokenDocument>,
    ) { }

    async findByUserId(userId: string): Promise<string | null> {
        const tokenDoc = await this.pushTokenModel.findOne({ userId }).exec();
        return tokenDoc ? tokenDoc.token : null;
    }

    async saveToken(PushToken: SavePushTokenDto) {
        const { token, userId } = PushToken

        // Validação simples para garantir que o userId e token existam
        if (!userId || !token) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'Faltando userId ou token',
                error: 'Bad Request',
            });
        }

        try {
            const existing = await this.pushTokenModel.findOne({ userId });

            // Se já existir um token para esse userId
            if (existing) {
                // Se o token for diferente, atualiza
                if (existing.token !== token) {
                    existing.token = token;
                    await existing.save();
                    return existing;
                }
                // Se o token já for o mesmo, retorna
                return existing;
            }

            // Se não existir, cria um novo token
            const newToken = await this.pushTokenModel.create({ userId, token });
            return newToken;

        } catch (error: any) {
            // Captura qualquer erro inesperado, por exemplo, falha no banco de dados
            throw new InternalServerErrorException({
                statusCode: 500,
                message: 'Erro ao salvar o token no banco de dados',
                error: error.message || 'Internal Server Error',
            });
        }
    }
}