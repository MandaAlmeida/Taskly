import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@/utils/AppError";
import { TASKS_COLLECTION } from "../storageConfig";
import { tasksGetByCategory } from "./tasksGetByCategory";
import { TaskProps } from "@/@types/task";
import { FormatDate } from "@/utils/formatDate";

export async function taskAddByCategory(newTask: TaskProps, category: string) {
    try {
        // Obtém todas as tarefas da categoria informada
        const storedTasks = await tasksGetByCategory();

        // Verifica se a tarefa já existe no mesmo dia e categoria
        const taskAlreadyExists = storedTasks.some(
            task => task.name === newTask.name &&
                task.category === category &&
                FormatDate(task.date) === FormatDate(newTask.date)
        );

        if (taskAlreadyExists) {
            throw new AppError('Essa tarefa já está adicionada neste dia e categoria');
        }

        // Adiciona a nova tarefa
        const updatedTasks = [...storedTasks, newTask];
        await AsyncStorage.setItem(TASKS_COLLECTION, JSON.stringify(updatedTasks));

    } catch (error) {
        throw error;
    }
}
