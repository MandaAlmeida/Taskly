import { EnvService } from "@/env/env.service";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";

const tokenPayloadSchema = z.object({
    sub: z.string(),
})

export type TokenPayloadSchema = z.infer<typeof tokenPayloadSchema>


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: EnvService) {
        const publicKey = config.get("JWT_PUBLIC_KEY")
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(publicKey, "base64"),
            algorithms: ["RS256"]
        })
    }

    async validate(playload: TokenPayloadSchema) {
        return tokenPayloadSchema.parse(playload)
    }
}