
import { SubCategoryController } from '@/controllers/subCategory.controller';
import { SubCategory, SubCategorySchema } from '@/models/subCategory.schema';
import { SubCategoryService } from '@/services/subCategory.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: SubCategory.name, schema: SubCategorySchema }]),
        CategoriesModule
    ],
    controllers: [SubCategoryController],
    providers: [SubCategoryService],
    exports: [MongooseModule]
})

export class SubCategoryModule { }
