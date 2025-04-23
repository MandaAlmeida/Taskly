import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type SubCategoryDocument = HydratedDocument<SubCategory>

@Schema({ collection: 'sub_category' })
export class SubCategory {
    @Prop({
        required: true,
        auto: true,
        type: mongoose.Schema.Types.ObjectId,
    })
    _id: ObjectId;

    @Prop({ required: true })
    subCategory: string;

    @Prop({ required: true })
    categoryName: string;

    @Prop({ required: true })
    categoryId: string;

    @Prop({ required: true, type: String })
    icon: string;

    @Prop({ required: true, type: String })
    color: string;

    @Prop({ required: true, type: String })
    userId: string;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
