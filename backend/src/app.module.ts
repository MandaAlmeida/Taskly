import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { TaskModule } from './modules/task.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user.module';
import { CategoriesModule } from './modules/categories.module';
import { SubCategoryModule } from './modules/subCategories.module';
import { GroupModule } from './modules/group.module';
import { AnnotationModule } from './modules/annotation.module';
import { UploadModule } from './modules/upload.module';
import { envSchema } from './env/env';
import { NotificationModule } from './modules/notifications.module';
import { BullModule } from '@nestjs/bull';

config()

@Module({
    imports: [
        ConfigModule.forRoot({
            validate: env => envSchema.parse(env),
            isGlobal: true,
        }),
        BullModule.forRoot({
            redis: {
                host: 'localhost', // endereço do Redis
                port: 6379, // porta do Redis
            },
            defaultJobOptions: {
                removeOnComplete: 100, // mantem salvo os ultimos 100 jobs da fila
                removeOnFail: 1000, // remove os que nao conseguiram executar, mas mantem os ultimos 1000
                attempts: 3, // tenta 3 vezes caso ocorra um erro 
                backoff: { // tempo para fazer uma nova tentativa
                    type: 'exponential',
                    delay: 1000
                }
            }
        }),
        MongooseModule.forRoot(process.env.DATABASE_URL!),
        CategoriesModule,
        TaskModule,
        UserModule,
        AuthModule,
        SubCategoryModule,
        GroupModule,
        AnnotationModule,
        UploadModule,
        NotificationModule
    ],
})
export class AppModule {
    constructor() {
        console.log('Conectado ao MongoDB');
    }
}
