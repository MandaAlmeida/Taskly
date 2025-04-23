import { UserRole } from '@/enum/userRole.enum';
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

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    createdUserId: ObjectId;

    @Prop({
        type: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                accessType: { type: String, required: true }
            }
        ],
        default: []
    })
    members: {
        userId: ObjectId;
        accessType: UserRole;
    }[];

    @Prop()
    description?: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
