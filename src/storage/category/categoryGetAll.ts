import AsyncStorage from "@react-native-async-storage/async-storage";
import { CATEGORY_COLLECTION } from "../storageConfig";

const defaultCategories = ["Todas", "Pessoal", "Trabalho", "Estudo"];

export async function categoryGetAll() {
    try {
        const storage = await AsyncStorage.getItem(CATEGORY_COLLECTION);

        if (!storage) {
            await AsyncStorage.setItem(CATEGORY_COLLECTION, JSON.stringify(defaultCategories));
            return defaultCategories;
        }
        const category: string[] = storage ? JSON.parse(storage) : [];

        return category;
    } catch (error) {
        throw error;
    }
}
