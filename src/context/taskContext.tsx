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
import { taskToggleActive } from "@/storage/task/taskToggleActive";

interface TaskContextProps {
    tasks: TaskProps[];
    tasksCategory: TaskProps[];
    category: string[];
    taskName: string;
    taskConcluid: string[];
    isDropdownOpen: boolean;
    selectedCategory: string;
    pendingTasks: number[];
    completedTasks: number[];
    dateGraph: string[];

    setTasks: React.Dispatch<React.SetStateAction<TaskProps[]>>;
    setTaskName: React.Dispatch<React.SetStateAction<string>>;
    setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;

    handleTaskRemove: (id: string, name: string) => void;
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [pendingTasks, setPendingTasks] = useState<number[]>([0])
    const [completedTasks, setCompletedTasks] = useState<number[]>([0]);
    const [dateGraph, setDateGraph] = useState<string[]>([""])


    async function handleTaskRemove(id: string, name: string) {
        try {

            Alert.alert("Remover", `Remover a tarefa ${name}?`, [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: () => {
                        setTasks(prevState => prevState.filter(task => task.id !== id));
                        setTasksCategory(prevState => prevState.filter(task => task.id !== id));
                        taskRemoveByCategory(id);
                    }
                },

            ])
        } catch (error) {
            console.log(error)
            Alert.alert("Remover pessoa", "Não foi possivel remover essa pessoa.")
        }
    }

    async function handleTaskToggle(id: string) {
        try {
            await taskToggleActive(id);
            console.log("Task atualizada com sucesso!");
            setTasksCategory(prevTasks =>
                prevTasks.map(task =>
                    task.id === id ? { ...task, active: !task.active } : task
                )
            );
        } catch (error) {
            console.error("Erro ao atualizar a task:", error);
        }

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

    async function groupTasksByDate(tasks: TaskProps[]) {
        const groupedData = tasks.reduce((acc, task) => {
            const [day, month, year] = task.date.split('/');
            const formattedDate = `${year}-${month}-${day}`; // Formato: yyyy-mm-dd

            const dateKey = new Date(formattedDate).toISOString().split("T")[0];

            if (!acc[dateKey]) {
                acc[dateKey] = { pending: 0, completed: 0 };
            }

            if (!task.active) {
                acc[dateKey].pending += 1;
            } else {
                acc[dateKey].completed += 1;
            }

            return acc;
        }, {} as Record<string, { pending: number; completed: number }>);

        const dates = Object.keys(groupedData); // As datas
        const pendingTasks = dates.map(date => groupedData[date].pending); // Tarefas pendentes
        const completedTasks = dates.map(date => groupedData[date].completed); // Tarefas concluídas
        setPendingTasks(pendingTasks)
        setCompletedTasks(completedTasks)
        setDateGraph(dates)
    }



    console.log(pendingTasks, completedTasks);

    useEffect(() => {
        const completedTaskIds = tasksCategory
            .filter(task => task.active === true)
            .map(task => task.id);
        setTasksConcluid(completedTaskIds);
        featchCategory();
        groupTasksByDate(tasksCategory);
    }, [tasksCategory]);

    return (
        <TaskContext.Provider value={{ tasks, category, taskConcluid, selectedCategory, taskName, tasksCategory, isDropdownOpen, completedTasks, pendingTasks, dateGraph, setTasks, setTaskName, setIsDropdownOpen, setSelectedCategory, handleTaskToggle, handleTaskSeek, handleTaskRemove, handleAddCategory, removeCategory, handleAddTask, fetchTaskByCategory }}>
            {children}
        </TaskContext.Provider>
    )
}
