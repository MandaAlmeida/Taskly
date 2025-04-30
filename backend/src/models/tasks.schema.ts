import { Status } from '@/enum/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { SubTask } from './subTask';

export type TaskDocument = Task;

@Schema({ timestamps: true })
export class Task {
    @Prop({
        required: true,
        auto: true,
        type: mongoose.Schema.Types.ObjectId,
    })
    _id: ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true })
    subCategory: string;

    @Prop({ type: [SubTask], default: [] })
    subTask: SubTask[];

    @Prop({ required: true })
    priority: string;

    @Prop({ required: true, index: true })
    date: Date;

    @Prop({ required: true, index: true })
    status: Status;

    @Prop({ required: true, index: true })
    userId: string;

}

export const TaskSchema = SchemaFactory.createForClass(Task);
