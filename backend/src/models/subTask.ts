import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema({ _id: true })
export class SubTask {
    @Prop({
        required: true,
        auto: true,
        type: mongoose.Schema.Types.ObjectId,
    })
    _id: ObjectId;

    @Prop({ required: true })
    task: string;

    @Prop({ required: true, enum: ['COMPLETED', 'PENDING'] })
    status: 'COMPLETED' | 'PENDING';
}
