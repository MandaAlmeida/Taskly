import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

export type AnnotationDocument = Annotation;

@Schema({ timestamps: true })
export class Annotation {
    @Prop({
        required: true,
        auto: true,
        type: mongoose.Schema.Types.ObjectId,
    })
    _id: ObjectId;

    @Prop({ required: true, index: true })
    title: string;

    @Prop({
        type: [
            {
                type: { type: String, required: true },
                value: { type: mongoose.Schema.Types.Mixed, required: true },
            },
        ],
        required: false,
    })
    content: Array<{
        type: string;
        value: string | { title: string; url: string };
    }>;


    @Prop({ required: true, index: true })
    category: string

    @Prop({ required: true, index: true })
    createdUserId: string;

    @Prop({
        type: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                name: { type: String, required: true },
                accessType: { type: String, required: true }
            }
        ],
    })
    members: {
        userId: string;
        name: string;
        accessType: string;
    }[];

    @Prop({ type: Array, ref: 'Group', required: false })
    groupId?: [];

    @Prop({ type: [{ url: String, title: String, type: String }] }) // <- AQUI!
    attachments?: {
        url: string
        title: string
        type: string
    }[]
}

export const AnnotationSchema = SchemaFactory.createForClass(Annotation);
