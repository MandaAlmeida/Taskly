import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/models/user.schema';
import { CategoriesModule } from './categories.module';
import { TaskModule } from './task.module';
import { SubCategoryModule } from './subCategories.module';
import { UploadModule } from './upload.module';
import { GroupModule } from './group.module';
import { AnnotationModule } from './annotation.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        CategoriesModule,
        TaskModule,
        SubCategoryModule,
        UploadModule,
        GroupModule,
        AnnotationModule
    ],
    controllers: [UserController],
    providers: [
        UserService,
    ]
})
export class UserModule { }
