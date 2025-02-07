import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@/utils/AppError";
import { TASKS_COLLECTION } from "../storageConfig";

import { tasksGetByCategory } from "./tasksGetByCategory";
import { TaskProps } from "@/@types/task";

export async function taskAddByCategory(newTask: TaskProps, category: string) {
    try {
        const storedTask = await tasksGetByCategory();
        const taskAlreadyExists = storedTask.filter(task => task.name === newTask.name && task.category === category);

        if (taskAlreadyExists.length > 0) {
            throw new AppError('Essa tarefa já está adicionada neste dia e categoria');
        }

        const storage = JSON.stringify([...storedTask, newTask]);

        await AsyncStorage.setItem(TASKS_COLLECTION, storage)
    } catch (error) {
        throw (error)
    }
}