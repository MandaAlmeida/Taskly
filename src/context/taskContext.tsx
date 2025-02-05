import { createContext, ReactNode, useEffect, useState } from "react";
import { TaskProps } from "@/@types/task";
import { Alert } from "react-native";

interface TaskContextProps {
    tasks: TaskProps[];
    tasksCategory: TaskProps[];
    category: string[];
    taskName: string;
    taskConcluid: string[];

    setTasks: React.Dispatch<React.SetStateAction<TaskProps[]>>;
    setTaskName: React.Dispatch<React.SetStateAction<string>>;

    handleTaskRemove: (name: string) => void;
    handleTaskToggle: (id: string) => void;
    handleTaskSeek: () => void;
    handleFilterCategory: (name: string) => void;
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
    const [category, setCategory] = useState(["Pessoal", "Trabalho", "Estudo"]);

    function handleTaskRemove(name: string) {
        Alert.alert("Remover", `Remover a tarefa ${name}?`, [
            {
                text: 'Sim',
                onPress: () => setTasks(prevState => prevState.filter(task => task.name != name))
            },
            {
                text: 'Não',
                style: 'cancel'
            },
        ])
    }

    function handleTaskToggle(id: string) {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, active: !task.active } : task
            )
        );
    }

    function handleTaskSeek() {
        const taskAlreadyExists = tasks.some(task => task.name === taskName);

        if (!taskAlreadyExists) {
            return Alert.alert('Tarefa não encontrada', 'Não existe uma tarefa com esse nome na lista');
        } else {
            Alert.alert('Nome inválido', 'O nome da tarefa não pode estar vazio.');
        }
    }

    function handleFilterCategory(name: string) {
        const TaskCategory = tasks.filter((item) => item.category === name);
        setTasksCategory(TaskCategory);

        console.log(TaskCategory)
    }



    useEffect(() => {
        const completedTaskIds = tasks
            .filter(task => task.active === true)
            .map(task => task.id);

        setTasksConcluid(completedTaskIds);

        console.log('Tarefas concluídas (ids):', completedTaskIds);
    }, [tasks]);

    return (
        <TaskContext.Provider value={{ tasks, handleTaskRemove, handleTaskToggle, handleTaskSeek, category, setTaskName, taskConcluid, taskName, setTasks, handleFilterCategory, tasksCategory }}>
            {children}
        </TaskContext.Provider>
    )
}
