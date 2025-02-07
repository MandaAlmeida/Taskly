
import AsyncStorage from "@react-native-async-storage/async-storage";

import { CATEGORY_COLLECTION, TASKS_COLLECTION } from "../storageConfig";

import { categoryGetAll } from "./categoryGetAll";

export async function categoryRemoveByName(categoryDeleted: string) {
    try {
        const storedCategory = await categoryGetAll();
        const category = storedCategory.filter(category => category !== categoryDeleted);

        await AsyncStorage.setItem(CATEGORY_COLLECTION, JSON.stringify(category));
        await AsyncStorage.removeItem(`${TASKS_COLLECTION}-${categoryDeleted}`)
    } catch (error) {
        throw error
    }
}