import { Group, GroupSchema } from '@/models/groups.schema';
import { GroupController } from '../controllers/group.controller';
import { GroupService } from '../services/group.service';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnotationModule } from './annotation.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Group.name, schema: GroupSchema },
        ]),
        forwardRef(() => AnnotationModule)
    ],
    controllers: [GroupController],
    providers: [GroupService],
    exports: [MongooseModule, GroupService]
})
export class GroupModule { }
