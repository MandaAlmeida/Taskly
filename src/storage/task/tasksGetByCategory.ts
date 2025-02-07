import AsyncStorage from "@react-native-async-storage/async-storage";
import { TASKS_COLLECTION } from "../storageConfig";
import { TaskProps } from "@/@types/task";

export async function tasksGetByCategory() {
    try {
        const storage = await AsyncStorage.getItem(TASKS_COLLECTION);
        const tasks: TaskProps[] = storage ? JSON.parse(storage) : [];

        return tasks;

    } catch (error) {
        throw error
    }
}