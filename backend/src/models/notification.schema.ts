import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

export type NotificationDocument = Notification;

@Schema({ timestamps: true })
export class Notification {
    @Prop({
        required: true,
        auto: true,
        type: mongoose.Schema.Types.ObjectId,
    })
    _id: ObjectId;

    @Prop({ required: true, index: true })
    title: string;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true })
    type: "ANNOTATION" | "GROUP";

    @Prop({ required: true })
    status: boolean;

    @Prop({ required: true })
    itemId: string;

    @Prop({ required: true, index: true })
    userId: string[];
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
