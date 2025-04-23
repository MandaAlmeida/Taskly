import { Annotation, AnnotationSchema } from '@/models/annotations.schema';
import { AnnotationController } from '../controllers/annotation.controller';
import { AnnotationService } from '../services/annotation.service';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupModule } from './group.module';
import { UploadModule } from './upload.module';
import { UploadService } from '@/services/upload.service';
import { EnvModule } from '@/env/env.module';
import { EnvService } from '@/env/env.service';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Annotation.name, schema: AnnotationSchema },
        ]),
        forwardRef(() => GroupModule),
        UploadModule,
        EnvModule
    ],
    controllers: [AnnotationController],
    providers: [AnnotationService, UploadService, EnvService],
    exports: [MongooseModule, AnnotationService]
})
export class AnnotationModule { }
