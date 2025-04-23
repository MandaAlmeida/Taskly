import { Task, TaskSchema } from '@/models/tasks.schema';
import { TaskController } from '../controllers/task.controller';
import { TaskService } from '../services/task.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Task.name, schema: TaskSchema },
        ]),
    ],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [MongooseModule]
})
export class TaskModule { }
