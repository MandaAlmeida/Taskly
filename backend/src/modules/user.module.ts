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
import { AnnotationService } from '@/services/annotation.service';
import { NotificationModule } from './notifications.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        CategoriesModule,
        TaskModule,
        SubCategoryModule,
        UploadModule,
        GroupModule,
        AnnotationModule,
        NotificationModule
    ],
    controllers: [UserController],
    providers: [
        UserService,
        AnnotationService
    ]
})
export class UserModule { }
