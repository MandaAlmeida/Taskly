
import { CategoriesController } from '@/controllers/categories.controller';
import { Categories, CategoriesSchema } from '@/models/category.schema';
import { CategoriesService } from '@/services/category.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Categories.name, schema: CategoriesSchema }]),
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [MongooseModule]
})

export class CategoriesModule { }
