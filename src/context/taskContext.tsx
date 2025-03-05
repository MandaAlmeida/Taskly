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
    fetchTaskByCategory: (category: string, date?: DateData, filter?: string) => void;
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

    async function getUser() {
        const token = await getToken();

        if (!token) {
            console.error("Token não encontrado");
            return;
        }

        const userID = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));

        try {
            const response = await axios.get(`http://10.0.2.2:3001/user/${userID.id}`, {
                headers: {
                    "Authorization": `Bearer ${token.replace(/"/g, '')}`,
                },
            });


            const user: User = {
                _id: response.data.user._id,
                email: response.data.user.email,
                name: response.data.user.name,
            };

            setUser(user); // Atualiza o estado do usuário
            setToken(token);

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
                        // setTasks(prevState => prevState.filter(task => task.id !== id));
                        // setTasksCategory(prevState => prevState.filter(task => task.id !== id));
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
            // setTasksCategory(prevTasks =>
            //     prevTasks.map(task =>
            //         task.id === id ? { ...task, active: !task.active } : task
            //     )
            // );
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
            const response = await axios.post("http://10.0.2.2:3001/task",
                {
                    name: data.name,
                    category: data.category,
                    priority: data.priority,
                    date: data.date,
                    active: data.active,
                }, {
                headers: {
                    Authorization: `Bearer ${token.replace(/"/g, '')}`,
                },
            });

            await taskAddByCategory(data, data.category);
            fetchTaskByCategory("Todas");
            if (response.status === 201) {
                console.log("Task criado com sucesso!");
            } else {
                console.error("Erro ao criar task:", response.data.message);
            }

        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova Tarefa', error.message);
            } else {
                console.log(error);
                Alert.alert('Nova tarefa', 'Não foi possível adicionar');
            }
        }
    }

    async function fetchTaskByCategory(category: string, date?: DateData, filter?: string) {
        try {
            const response = await axios.get(`http://10.0.2.2:3001/tasks/${user?._id}`, {
                headers: {
                    Authorization: `Bearer ${token.replace(/"/g, '')}`,
                },
            });

            const tasks = Array.isArray(response.data) ? response.data : [response.data];

            const formattedTasks = tasks.map((task: any) => ({
                _id: task._id,
                name: task.name,
                category: task.category,
                priority: task.priority,
                date: task.date,
                active: task.active,
            }));

            let filteredTasks = formattedTasks;

            // Filtro pela categoria
            if (category !== "Todas") {
                filteredTasks = filteredTasks.filter((item) => item.category === category);
            }

            // Filtro pela data (caso fornecida)
            if (date) {
                filteredTasks = filteredTasks.filter(
                    (item) => convertDateFormat(item.date) === date.dateString
                );
            }

            // Filtro pelo nome 
            if (filter) {
                filteredTasks = filteredTasks.filter((task: any) =>
                    task.name.toLowerCase().startsWith(filter.toLowerCase())
                );
            }

            // Ordena as tarefas pela data (presumindo que 'FormatDate' seja uma função para formatar datas)
            filteredTasks.sort((a: any, b: any) => FormatDate(a.date) - FormatDate(b.date));

            // Atualiza o estado com as tarefas filtradas
            setTasksCategory(filteredTasks);

        } catch (error) {
            console.error(error);
            Alert.alert("Categoria", "Não foi possível carregar as tarefas da categoria selecionada");
        }
    }

    async function groupTasksByWeek(tasks: TaskProps[]) {
        const weekDays = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

        // Função para converter a string de data ISO 8601 em objeto Date
        const parseDate = (dateStr: string) => {
            const dateObj = new Date(dateStr); // O formato ISO 8601 é nativo no JavaScript
            if (isNaN(dateObj.getTime())) return null; // Verifica se a data é válida
            return dateObj;
        };

        const groupedData = tasks.reduce((acc, task) => {
            const dateObj = parseDate(task.date);

            if (!dateObj) return acc;

            const weekDay = weekDays[dateObj.getDay()];
            const weekNumber = getWeekNumber(dateObj); // A função getWeekNumber deve retornar o número da semana
            const weekKey = `Semana ${weekNumber}`;

            // Se a semana ainda não foi criada, inicializa
            if (!acc.has(weekKey)) {
                const weekStructure = new Map<string, { pending: number; completed: number }>();
                weekDays.forEach(day => weekStructure.set(day, { pending: 0, completed: 0 }));
                acc.set(weekKey, weekStructure);
            }

            const weekStructure = acc.get(weekKey)!;

            // Verifica se a tarefa está ativa ou não e conta corretamente
            if (!task.active) {
                weekStructure.get(weekDay)!.pending += 1;
            } else {
                weekStructure.get(weekDay)!.completed += 1;
            }

            return acc;
        }, new Map<string, Map<string, { pending: number; completed: number }>>());

        // Ordena as semanas em ordem crescente
        const weeks = Array.from(groupedData.keys()).sort((a, b) => {
            const weekNumberA = parseInt(a.replace('Semana ', ''), 10);
            const weekNumberB = parseInt(b.replace('Semana ', ''), 10);
            return weekNumberA - weekNumberB; // Ordenação crescente
        });

        // Mapeia as tarefas pendentes e concluídas por semana
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

    function convertDateFormat(dateString: string): string {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0'); // Pega o dia e garante que tenha 2 dígitos
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Pega o mês e garante que tenha 2 dígitos (Lembre-se que o mês é 0-indexed)
        const year = date.getFullYear(); // Pega o ano

        return `${year}-${day}-${month}`;
    }

    useEffect(() => {
        const completedTaskIds = tasksCategory
            .filter(task => task.active === true)
            .map(task => task._id!);
        setTasksConcluid(completedTaskIds); 1
        featchCategory();
        groupTasksByWeek(tasksCategory);
        getUser();
    }, [tasksCategory]);

    return (
        <TaskContext.Provider value={{ tasks, taskName, category, taskConcluid, selectedCategory, tasksCategory, isDropdownOpen, completedTasks, pendingTasks, dateGraph, weekDaysGraph, user, token, setTasks, setTaskName, setIsDropdownOpen, setSelectedCategory, handleTaskToggle, handleTaskRemove, handleAddCategory, removeCategory, handleAddTask, fetchTaskByCategory, createUser, login }}>
            {children}
        </TaskContext.Provider>
    )
}


