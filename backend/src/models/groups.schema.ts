import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema({ timestamps: true })
export class Group {
    @Prop({
        required: true,
        auto: true,
        type: mongoose.Schema.Types.ObjectId,
    })
    _id: ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true })
    createdUserId: ObjectId;

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

    @Prop()
    description?: string;

    @Prop({ required: true, type: Number })
    icon: number;

    @Prop({ required: true, type: String })
    color: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
