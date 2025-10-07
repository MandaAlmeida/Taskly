import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PushTokenDocument = PushToken & Document;

@Schema({ timestamps: true })
export class PushToken {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true, unique: true })
    token: string;
}

export const PushTokenSchema = SchemaFactory.createForClass(PushToken);
