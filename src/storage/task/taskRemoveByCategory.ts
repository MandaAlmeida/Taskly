import AsyncStorage from "@react-native-async-storage/async-storage";

import { TASKS_COLLECTION } from "../storageConfig";
import { tasksGetByCategory } from "./tasksGetByCategory";

export async function taskRemoveByCategory(id: string) {
    try {
        const storage = await tasksGetByCategory();

        const filtered = storage.filter(task => task.id === id);
        const tasks = JSON.stringify(filtered)

        await AsyncStorage.setItem(TASKS_COLLECTION, tasks)

    } catch (error) {
        throw error
    }

}