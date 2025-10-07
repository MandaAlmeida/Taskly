import { Module } from "@nestjs/common";
import { EnvService } from "./env.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    providers: [
        EnvService
    ],
    exports: [EnvService, ConfigModule]
})

export class EnvModule { }