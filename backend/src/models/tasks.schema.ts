import { Status } from '@/enum/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

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

    @Prop({ required: true })
    priority: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    status: Status;

    @Prop({ required: true })
    userId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
