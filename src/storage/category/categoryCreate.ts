import AsyncStorage from "@react-native-async-storage/async-storage";
import { CATEGORY_COLLECTION } from "../storageConfig";
import { categoryGetAll } from "./categoryGetAll";
import { AppError } from "@/utils/AppError";

export async function categoryCreate(newCategory: string) {
    try {
        const storedCategory = await categoryGetAll();

        const categoryAlreadyExists = storedCategory.includes(newCategory);

        if (categoryAlreadyExists) {
            throw new AppError('Já existe uma categoria cadastrado com esse nome.');
        }

        const storage = JSON.stringify([...storedCategory, newCategory])

        await AsyncStorage.setItem(CATEGORY_COLLECTION, storage)
    } catch (error) {
        throw error;
    }
} 