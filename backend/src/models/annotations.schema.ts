import { UserRole } from '@/enum/userRole.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

export type AnnotationDocument = Annotation;

@Schema({ timestamps: true }) // adiciona createdAt e updatedAt automatico
export class Annotation {
    @Prop({
        required: true,
        auto: true,
        type: mongoose.Schema.Types.ObjectId,
    })
    _id: ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    category: string

    @Prop({ required: true })
    createdUserId: string;

    @Prop({
        type: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                accessType: { type: String, required: true }
            }
        ],
    })
    members: {
        userId: ObjectId;
        accessType: UserRole;
    }[];

    @Prop({ type: Array, ref: 'Group', required: false })
    groupId?: [];

    @Prop({ type: Array, ref: 'Attachent', required: false })
    attachment?: [];
}

export const AnnotationSchema = SchemaFactory.createForClass(Annotation);
