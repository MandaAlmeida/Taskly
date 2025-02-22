import AsyncStorage from "@react-native-async-storage/async-storage";
import { TASKS_COLLECTION } from "../storageConfig";
import { tasksGetByCategory } from "./tasksGetByCategory";

export async function taskToggleActive(taskId: string) {
    try {
        // Obtém todas as tasks armazenadas na categoria informada
        const storedTasks = await tasksGetByCategory();

        // Mapeia as tarefas e altera o estado `active` da task correspondente
        const updatedTasks = storedTasks.map(task =>
            task.id === taskId ? { ...task, active: !task.active } : task
        );

        // Salva a lista atualizada no AsyncStorage
        await AsyncStorage.setItem(TASKS_COLLECTION, JSON.stringify(updatedTasks));

    } catch (error) {
        throw error;
    }
}
