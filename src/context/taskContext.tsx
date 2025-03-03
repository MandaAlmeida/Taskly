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
import { FormatDate } from "@/utils/formatDate";
import { DateData } from "react-native-calendars";
import axios from "axios";

import { addToken } from "@/storage/token/addToken";
import { getToken } from "@/storage/token/getToken";

type User = {
    _id: string;
    email: string;
    name: string;
}

interface TaskContextProps {
    tasks: TaskProps[];
    tasksCategory: TaskProps[];
    category: string[];
    taskName: string;
    taskConcluid: string[];
    isDropdownOpen: boolean;
    selectedCategory: string;
    pendingTasks: number[][];
    completedTasks: number[][];
    dateGraph: string[];
    weekDaysGraph: string[];
    token: string;
    user: User | null;

    setTasks: React.Dispatch<React.SetStateAction<TaskProps[]>>;
    setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
    setTaskName: React.Dispatch<React.SetStateAction<string>>;

    handleTaskRemove: (id: string, name: string) => void;
    handleTaskToggle: (id: string) => void;
    handleAddCategory: (name: string) => void;
    removeCategory: (category: string) => void;
    handleAddTask: (data: TaskProps) => void;
    fetchTaskByCategory: (name: string, date?: DateData, filter?: string) => void;
    createUser: (name: string, email: string, password: string, confirmPassword: string) => void;
    login: (email: string, password: string) => void;
}

export const TaskContext = createContext({} as TaskContextProps);

interface TaskContextProviderProps {
    children: ReactNode;
}

export function TaskContextProvider({ children }: TaskContextProviderProps) {
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const [tasksCategory, setTasksCategory] = useState<TaskProps[]>([]);
    const [taskName, setTaskName] = useState('');
    const [taskConcluid, setTasksConcluid] = useState<string[]>([]);
    const [category, setCategory] = useState([""]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [pendingTasks, setPendingTasks] = useState<number[][]>([[0]])
    const [completedTasks, setCompletedTasks] = useState<number[][]>([[0]]);
    const [dateGraph, setDateGraph] = useState<string[]>([""]);
    const [weekDaysGraph, setWeekDaysGraph] = useState<string[]>([""]);
    const [token, setToken] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);


    async function createUser(name: string, email: string, password: string, confirmPassword: string) {
        try {
            const response = await axios.post("http://10.0.2.2:3001/auth/register", {
                name,
                email,
                password,
                confirmPassword
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                console.log("Usuário criado com sucesso!");
            } else {
                console.error("Erro ao criar usuário:", response.data.message);
            }
        } catch (error: any) {
            console.error("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);
        }
    }

    async function login(email: string, password: string) {
        try {
            const response = await axios.post("http://10.0.2.2:3001/auth/login", {
                email,
                password,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                addToken(response.data.token);
                setToken(response.data.token)
            } else {
                console.error("Erro ao fazer login:", response.data.message);
            }
        } catch (error: any) {
            console.error("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);
        }
    }

    async function authTokenUser() {
        const token = await getToken();
        if (token) {
            return setToken(token);
        }
        setToken("")
    }


    async function getUser() {
        const userID = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));

        try {
            const response = await axios.get(`http://10.0.2.2:3001/user/${userID.id}`);


            const user: User = {
                _id: response.data.user._id,
                email: response.data.user.email,
                name: response.data.user.name,
            };

            setUser(user);

        } catch (error: any) {
            console.error("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);

        }
    }

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

    async function featchCategory() {
        try {
            const data = await categoryGetAll();
            setCategory(data);

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

    async function fetchTaskByCategory(name: string, date?: DateData, filter?: string) {
        try {
            const task = await tasksGetByCategory();

            let filteredTasks = task;

            // Filtro pela categoria
            if (name !== "Todas") {
                filteredTasks = filteredTasks.filter((item) => item.category === name);
            }

            // Filtro pela data
            if (date) {
                filteredTasks = filteredTasks.filter(
                    (item) => convertDateFormat(item.date) === date.dateString
                );
            }

            // Filtro pelo nome (se o filtro for fornecido)
            if (filter) {
                filteredTasks = filteredTasks.filter((task) =>
                    task.name.toLowerCase().startsWith(filter.toLowerCase())
                );
            }

            // Ordena as tarefas pela data
            filteredTasks.sort((a, b) => FormatDate(a.date) - FormatDate(b.date));

            // Atualiza o estado com as tarefas filtradas
            setTasksCategory(filteredTasks);

        } catch (error) {
            console.log(error);
            Alert.alert("Categoria", "Não foi possível carregar as tarefas da categoria selecionada");
        }
    }


    async function groupTasksByWeek(tasks: TaskProps[]) {
        const weekDays = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];


        const parseDate = (dateStr: string) => {
            const [day, month, year] = dateStr.split('/').map(Number);
            const dateObj = new Date(year, month - 1, day);
            if (isNaN(dateObj.getTime())) return null;
            return dateObj;
        };

        const groupedData = tasks.reduce((acc, task) => {
            const dateObj = parseDate(task.date);
            if (!dateObj) return acc;

            const weekDay = weekDays[dateObj.getDay()];
            const weekNumber = getWeekNumber(dateObj);
            const weekKey = `Semana ${weekNumber}`;

            if (!acc.has(weekKey)) {
                const weekStructure = new Map<string, { pending: number; completed: number }>();
                weekDays.forEach(day => weekStructure.set(day, { pending: 0, completed: 0 }));
                acc.set(weekKey, weekStructure);
            }

            const weekStructure = acc.get(weekKey)!;

            if (!task.active) {
                weekStructure.get(weekDay)!.pending += 1;
            } else {
                weekStructure.get(weekDay)!.completed += 1;
            }

            return acc;
        }, new Map<string, Map<string, { pending: number; completed: number }>>());


        const weeks = Array.from(groupedData.keys());
        const pendingTasksByWeek = weeks.map(week =>
            weekDays.map(day => groupedData.get(week)?.get(day)?.pending || 0)
        );
        const completedTasksByWeek = weeks.map(week =>
            weekDays.map(day => groupedData.get(week)?.get(day)?.completed || 0)
        );

        setPendingTasks(pendingTasksByWeek);
        setCompletedTasks(completedTasksByWeek);
        setDateGraph(weekDays);
        setWeekDaysGraph(weeks);
    }

    function getWeekNumber(date: Date): number {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDays = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
        return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
    }

    function convertDateFormat(date: string): string {
        const [day, month, year] = date.split("/");
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        const completedTaskIds = tasksCategory
            .filter(task => task.active === true)
            .map(task => task.id);
        setTasksConcluid(completedTaskIds);
        featchCategory();
        groupTasksByWeek(tasksCategory);
        authTokenUser();
        getUser();
    }, [tasksCategory]);

    return (
        <TaskContext.Provider value={{ tasks, taskName, category, taskConcluid, selectedCategory, tasksCategory, isDropdownOpen, completedTasks, pendingTasks, dateGraph, weekDaysGraph, user, token, setTasks, setTaskName, setIsDropdownOpen, setSelectedCategory, handleTaskToggle, handleTaskRemove, handleAddCategory, removeCategory, handleAddTask, fetchTaskByCategory, createUser, login }}>
            {children}
        </TaskContext.Provider>
    )
}


