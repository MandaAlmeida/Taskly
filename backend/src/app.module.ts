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


config()

@Module({
    imports: [
        ConfigModule.forRoot({
            validate: env => envSchema.parse(env),
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.DATABASE_URL!),
        CategoriesModule,
        TaskModule,
        UserModule,
        AuthModule,
        SubCategoryModule,
        GroupModule,
        AnnotationModule,
        UploadModule
    ],
})
export class AppModule {
    constructor() {
        console.log('Conectado ao MongoDB');
    }
}
