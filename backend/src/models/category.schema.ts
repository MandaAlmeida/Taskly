import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type CategoriesDocument = HydratedDocument<Categories>

@Schema({ collection: 'category' })
export class Categories {
    @Prop({
        required: true,
        auto: true,
        type: mongoose.Schema.Types.ObjectId,
    })
    _id: ObjectId;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true, type: String })
    icon: string;

    @Prop({ required: true, type: String })
    color: string;

    @Prop({ required: true, type: String })
    userId: string;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
