import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { TaskProps } from "@/@types/task";
import { Alert } from "react-native";
import { categoryCreate } from "@/storage/category/categoryCreate";
import { AppError } from "@/utils/AppError";
import { categoryGetAll } from "@/storage/category/categoryGetAll";
import { categoryRemoveByName } from "@/storage/category/categoryRemoveByName";
import { taskAddByCategory } from "@/storage/task/taskAddByCategory";
import { taskRemoveByCategory } from "@/storage/task/taskRemoveByCategory";
import { tasksGetByCategory } from "@/storage/task/tasksGetByCategory";

interface TaskContextProps {
    tasks: TaskProps[];
    tasksCategory: TaskProps[];
    category: string[];
    taskName: string;
    taskConcluid: string[];

    setTasks: React.Dispatch<React.SetStateAction<TaskProps[]>>;
    setTaskName: React.Dispatch<React.SetStateAction<string>>;

    handleTaskRemove: (name: string, category: string) => void;
    handleTaskToggle: (id: string) => void;
    handleTaskSeek: () => void;
    handleAddCategory: (name: string) => void;
    removeCategory: (category: string) => void;
    handleAddTask: (data: TaskProps) => void;
    fetchTaskByCategory: (name: string) => void;
}

export const TaskContext = createContext({} as TaskContextProps);

interface TaskContextProviderProps {
    children: ReactNode;
}

export function TaskContextProvider({ children }: TaskContextProviderProps) {
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const [tasksCategory, setTasksCategory] = useState<TaskProps[]>([])
    const [taskName, setTaskName] = useState('');
    const [taskConcluid, setTasksConcluid] = useState<string[]>([]);
    const [category, setCategory] = useState([""]);

    async function handleTaskRemove(name: string, category: string) {
        try {

            Alert.alert("Remover", `Remover a tarefa ${name}?`, [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: () => {
                        setTasks(prevState => prevState.filter(task => task.name !== name));
                        setTasksCategory(prevState => prevState.filter(task => task.name !== name));
                        taskRemoveByCategory(name, category);
                    }
                },

            ])
        } catch (error) {
            console.log(error)
            Alert.alert("Remover pessoa", "Não foi possivel remover essa pessoa.")
        }
    }

    function handleTaskToggle(id: string) {
        setTasksCategory(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, active: !task.active } : task
            )
        );
    }

    function handleTaskSeek() {
        const taskAlreadyExists = tasksCategory.some(task => task.name === taskName);

        if (!taskAlreadyExists) {
            return Alert.alert('Tarefa não encontrada', 'Não existe uma tarefa com esse nome na lista');
        } else {
            Alert.alert('Nome inválido', 'O nome da tarefa não pode estar vazio.');
        }
    }

    async function featchCategory() {
        try {
            const data = await categoryGetAll();
            setCategory(data);
            console.log(data)

        } catch (error) {
            console.log(error)
            Alert.alert("Turmas", "Não foi possivel carregar as turmas")
        }
    }

    async function handleAddCategory(name: string) {
        try {
            if (name.length === 0) {
                return Alert.alert("Nova categoria", "Informe o nome da categoria")
            }

            await categoryCreate(name);
            setCategory((prevTasks) => [...prevTasks, name])
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert("Novo categoria", error.message)
            } else {
                Alert.alert("Novo categoria", "Não foi possível criar um novo categoria.")
                console.log(error)
            }

        }

    }

    async function removeCategory(category: string) {
        try {
            Alert.alert("Remover", `Remover a categoria ${category}?`, [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: () => {
                        categoryRemoveByName(category);
                        setCategory((prevCategories) =>
                            prevCategories.filter((item) => item !== category)
                        );
                    }
                },

            ])
        } catch (error) {
            console.log(error)
            Alert.alert("Remover categoria", "Não foi possivel remover essa categoria.")
        }
    }

    async function handleAddTask(data: TaskProps) {
        if (data.name.trim().length === 0) {
            return Alert.alert("Nova Tarefa", "Informe nome da nova tarefa para adicionar");
        }
        try {
            await taskAddByCategory(data, data.category);
            fetchTaskByCategory("Todas");
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova tarafa', error.message)
            } else {
                console.log(error);
                Alert.alert('Nova tarefa', 'Não foi possivel adicionar')
            }
        }
    }

    async function fetchTaskByCategory(name: string) {
        try {
            const task = await tasksGetByCategory();
            if (name !== "Todas") {
                const TaskCategory = task.filter((item) => item.category === name);
                return setTasksCategory(TaskCategory);
            }
            return setTasksCategory(task)

        } catch (error) {
            console.log(error)
            Alert.alert("Pessoas", "Não foi possível carregar as pessoas do time selecionado");
        }
    }


    useEffect(() => {
        const completedTaskIds = tasksCategory
            .filter(task => task.active === true)
            .map(task => task.id);
        setTasksConcluid(completedTaskIds);
        featchCategory();
    }, [tasksCategory]);

    return (
        <TaskContext.Provider value={{ tasks, category, taskConcluid, taskName, tasksCategory, setTasks, setTaskName, handleTaskToggle, handleTaskSeek, handleTaskRemove, handleAddCategory, removeCategory, handleAddTask, fetchTaskByCategory }}>
            {children}
        </TaskContext.Provider>
    )
}
