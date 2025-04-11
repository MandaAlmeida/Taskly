import { createContext, ReactNode, useEffect, useState } from "react";
import { TaskProps } from "@/@types/task";
import { Alert } from "react-native";
import { AppError } from "@/utils/AppError";
import { FormatDate } from "@/utils/formatDate";
import { DateData } from "react-native-calendars";
import axios from "axios";

import { addToken } from "@/storage/token/addToken";
import { getToken } from "@/storage/token/getToken";
import { convertDateFormat } from "@/utils/convertDateFormat";
import { getWeekNumber } from "@/utils/getWeekNumber";
import { CategoryProps } from "@/@types/category";
import api from "@/api/axios";

type User = {
    _id: string;
    email: string;
    name: string;
}

interface TaskContextProps {
    tasks: TaskProps[];
    tasksFilter: TaskProps[];
    category: CategoryProps[];
    taskName: string;
    isDropdownOpen: boolean;
    selectedCategory: string;
    pendingTasks: number[][];
    completedTasks: number[][];
    dateGraph: string[];
    weekDaysGraph: string[];
    token: string;
    user: User | null;
    loading: boolean;
    error: boolean;
    priority: string;
    date: DateData;

    setTasks: React.Dispatch<React.SetStateAction<TaskProps[]>>;
    setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
    setTaskName: React.Dispatch<React.SetStateAction<string>>;
    setPriority: React.Dispatch<React.SetStateAction<string>>;
    setDate: React.Dispatch<React.SetStateAction<DateData>>;

    handleTaskRemove: (id: string, name: string) => void;
    handleAddCategory: (name: string, icon: string, color: string) => void;
    removeCategory: (category: string, id?: string) => void;
    handleAddTask: (data: TaskProps, handleBackToTask: () => void) => void;
    handleUpdateTask: (data: TaskProps, handleBackToTask?: () => void) => void;
    fetchTask: (date?: DateData, filter?: string) => void;
    fetchTaskBySearch: (item: string) => void;
    createUser: (name: string, email: string, password: string, confirmPassword: string, handleBackToLogin: () => void) => void;
    login: (email: string, password: string) => void;
    deslogar: () => void;
}

export const TaskContext = createContext({} as TaskContextProps);

interface TaskContextProviderProps {
    children: ReactNode;
}

export function TaskContextProvider({ children }: TaskContextProviderProps) {
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const [tasksFilter, setTasksFilter] = useState<TaskProps[]>([]);
    const [taskName, setTaskName] = useState('');
    const [category, setCategory] = useState<CategoryProps[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [pendingTasks, setPendingTasks] = useState<number[][]>([[0]])
    const [completedTasks, setCompletedTasks] = useState<number[][]>([[0]]);
    const [dateGraph, setDateGraph] = useState<string[]>([""]);
    const [weekDaysGraph, setWeekDaysGraph] = useState<string[]>([""]);
    const [token, setToken] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [priority, setPriority] = useState("");
    const [date, setDate] = useState<DateData>({
        year: 0,
        month: 0,
        day: 0,
        timestamp: 0,
        dateString: "",
    })


    // USER
    async function createUser(name: string, email: string, password: string, passwordConfirm: string, handleBackToLogin: () => void) {
        try {
            const response = await api.post("/user/register", {
                name,
                email,
                password,
                passwordConfirm
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                console.log("Usuário criado com sucesso!");
                setError(false)
                handleBackToLogin();
            } else {
                console.log("Erro ao criar usuário:", response.data.message);
                setError(true)
            }
        } catch (error: any) {
            console.log("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);
            setError(true)
        }
    }

    async function login(email: string, password: string) {
        try {
            const response = await api.post("/user/login", {
                email,
                password,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });


            if (response.status === 201) {
                setError(false)
                addToken(response.data.token);
                setToken(response.data.token);
            }
            else {
                setError(true)
                console.log("Erro ao fazer login:", response.data.message);
            }
        } catch (error: any) {
            setError(true)
            console.log("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);
        }
    }

    async function getUser() {
        try {
            const response = await api.get(`/user/fetch`);

            const user: User = {
                _id: response.data._id,
                email: response.data.email,
                name: response.data.name,
            };

            setUser(user);
            featchCategory();
        } catch (error: any) {
            console.log("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);
        }
    }

    async function deslogar() {
        addToken("");
        setToken("");
    }

    // CATEGORY
    async function handleAddCategory(name: string, icon: string, color: string) {
        try {
            if (name.length === 0) {
                return Alert.alert("Nova categoria", "Informe o nome da categoria")
            }

            const response = await api.post("/categories/create", {
                category,
                icon,
                color
            });

            if (response.status === 201) {
                console.log("Categoria criada com sucesso!");
                featchCategory()
            } else {
                console.error("Erro ao tentar criar a categoria", response.data.message);
            }
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert("Novo categoria", error.message)
            } else {
                Alert.alert("Novo categoria", "Não foi possível criar uma nova categoria.")
                console.error("Erro desconhecido:", error);

                if (axios.isAxiosError(error)) {
                    console.error("Erro Axios:", error.response?.data || error.message);
                } else {
                    console.error("Erro não Axios:", error);
                }
            }

        }

    }

    async function featchCategory() {
        try {
            if (user) {
                const response = await api.get(`/categories/fetch`);


                if (!response.data || response.data.length === 0) {
                    return;
                }


                if (response.status === 200) {
                    setCategory(response.data);
                }
            }
        } catch (error) {
            console.error("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.error("Erro Axios:", error.response?.data || error.message);
            } else {
                console.error("Erro não Axios:", error);
            }
        }
    }

    async function removeCategory(category: string, id?: string) {
        try {
            Alert.alert("Remover", `Remover a categoria ${category}?`, [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            await api.delete(`/categories/delete/${id}`);

                            setCategory(prevTasks => prevTasks.filter(task => task._id !== id));

                            Alert.alert("Sucesso", "Categoria removida com sucesso!");
                        } catch (error) {
                            console.error(error);
                            Alert.alert("Erro", "Não foi possível remover a categoria.");
                        }
                    }
                },

            ])
        } catch (error) {
            console.log(error)
            Alert.alert("Remover categoria", "Não foi possivel remover essa categoria.")
            console.error("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.error("Erro Axios:", error.response?.data || error.message);
            } else {
                console.error("Erro não Axios:", error);
            }
        }
    }

    // TASK
    async function handleAddTask(data: TaskProps, handleBackToTask: () => void) {
        if (data.name.trim().length === 0) {
            return Alert.alert("Nova Tarefa", "Informe nome da nova tarefa para adicionar");
        }

        const existingTask = tasks.filter((task: TaskProps) =>
            task.name.toLowerCase() === data.name.toLowerCase() &&
            convertDateFormat(task.date) === convertDateFormat(data.date) && task.category === data.category
        );

        if (existingTask.length > 0) {
            return Alert.alert("Tarefa Existente", "Essa tarefa já está cadastrada");
        }

        try {
            const response = await api.post("/task/create",
                {
                    name: data.name,
                    category: data.category,
                    priority: data.priority,
                    date: data.date,
                },
            );

            fetchTask();
            if (response.status === 201) {
                console.log("Task criado com sucesso!");
                handleBackToTask();
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

    async function fetchTask(date?: DateData, filter?: string) {
        try {
            if (user) {
                const response = await api.get(`/task/fetch`);

                if (!response.data || response.data.length === 0) {
                    return;
                }

                const tasks = Array.isArray(response.data) ? response.data : [response.data];

                const formattedTasks = tasks.map((task: any) => ({
                    _id: task._id,
                    name: task.name,
                    category: task.category,
                    priority: task.priority,
                    status: task.status,
                    date: task.date,
                }));

                let filteredTasks = formattedTasks;



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

                filteredTasks.sort((a: any, b: any) => FormatDate(a.date) - FormatDate(b.date));

                setTasks(filteredTasks);
                groupTasksByWeek(filteredTasks)
            }
        } catch (error) {
            console.error("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.error("Erro Axios:", error.response?.data || error.message);
            } else {
                console.error("Erro não Axios:", error);
            }
        }
    }

    async function fetchTaskBySearch(item: string) {
        try {
            if (user) {
                const response = await api.get(`/task/search?q=${item}`);


                setTasksFilter(response.data)
            }
        } catch (error) {
            console.error("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.error("Erro Axios:", error.response?.data || error.message);
            } else {
                console.error("Erro não Axios:", error);
            }
        }
    }

    async function handleUpdateTask(data: TaskProps, handleBackToTask?: () => void) {
        try {
            const response = await api.put(`/task/update/${data._id}`,
                {
                    ...data,
                }
            );

            if (response.status === 200) {
                await fetchTask();
                if (handleBackToTask)
                    handleBackToTask();
            } else {
                console.error("Erro ao modificar a task:", response.data.message);
            }
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Tarefa', error.message);
            } else {
                console.log(error);
                Alert.alert('Tarefa', 'Não foi possível editar a tarefa');
            }
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
                    onPress: async () => {
                        try {
                            await api.delete(`/task/delete/${id}`);

                            setTasks(prevTasks => prevTasks.filter(task => task._id !== id));

                            Alert.alert("Sucesso", "Tarefa removida com sucesso!");
                        } catch (error) {
                            console.error(error);
                            Alert.alert("Erro", "Não foi possível remover a tarefa.");
                        }
                    }
                },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Ocorreu um problema ao tentar remover a tarefa.");
        }
    }

    // GRAPH
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

        // Atualiza os estados com as tarefas pendentes e concluídas
        setPendingTasks(pendingTasksByWeek);
        setCompletedTasks(completedTasksByWeek);
        setDateGraph(weekDays);
        setWeekDaysGraph(weeks);
    }

    useEffect(() => {
        async function saveTokenAndFetchUser() {
            const tokenLocal = await getToken();
            if (tokenLocal) {
                setToken(tokenLocal.replace(/"/g, ""));
                getUser();
            }
        }

        if (!token) {
            saveTokenAndFetchUser();
        }

        setLoading(false);

        async function updateStatuses() {
            await api.patch("/task/update-status");
        }

        updateStatuses();
    }, [tasks]);

    return (
        <TaskContext.Provider value={{
            tasks, tasksFilter, taskName, category, selectedCategory, isDropdownOpen, completedTasks, pendingTasks, dateGraph, weekDaysGraph, user, token, loading, error, date, priority, setTasks, setTaskName, setIsDropdownOpen, setSelectedCategory, setDate, setPriority, handleTaskRemove, handleAddCategory, handleAddTask, handleUpdateTask, fetchTask, createUser, login, removeCategory,
            deslogar, fetchTaskBySearch

        }}>
            {children}
        </TaskContext.Provider>
    )
}


