import { createContext, ReactNode, useEffect, useState } from "react";
import { CreateTaskProps, TaskProps } from "@/@types/task";
import { Alert } from "react-native";
import { AppError } from "@/utils/AppError";
import { FormatDate } from "@/utils/formatDate";
import { DateData } from "react-native-calendars";
import axios from "axios";

import { addToken } from "@/storage/token/addToken";
import { getToken } from "@/storage/token/getToken";
import { CategoryProps } from "@/@types/category";
import api from "@/api/axios";
import { AnnotationProps, attachmentProps, CreateAnnotationProps } from "@/@types/annotation";
import { SubCategoryProps } from "@/@types/subCategory";

type User = {
    _id: string;
    email: string;
    name: string;
    imageUser: string;
    birth: string
}

interface TaskContextProps {
    tasks: TaskProps[];
    tasksSearch: TaskProps[];
    tasksData: TaskProps[];
    category: CategoryProps[];
    subCategory: SubCategoryProps[];
    taskName: string;
    isDropdownOpen: boolean;
    selectedCategory: CategoryProps | undefined;
    selectedSubCategory: SubCategoryProps | undefined;

    token: string;
    user: User | null;
    loading: boolean;
    error: boolean;
    priority: string;
    date: DateData;
    isCategoryOpen: boolean;
    isGroupOpen: boolean;
    isCreateCategoryOpen: boolean;
    annotation: AnnotationProps[];
    annotationById: AnnotationProps | undefined;
    isAnnotationOpen: boolean;
    attachment: string[];
    taskById: TaskProps | undefined;
    isTaskOpen: boolean;
    openSections: { [key: string]: boolean };

    setTasks: React.Dispatch<React.SetStateAction<TaskProps[]>>;
    setAnnotation: React.Dispatch<React.SetStateAction<AnnotationProps[]>>;
    setAnnotationById: React.Dispatch<React.SetStateAction<AnnotationProps | undefined>>;
    setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedCategory: React.Dispatch<React.SetStateAction<CategoryProps | undefined>>;
    setSelectedSubCategory: React.Dispatch<React.SetStateAction<SubCategoryProps | undefined>>;
    setTaskName: React.Dispatch<React.SetStateAction<string>>;
    setPriority: React.Dispatch<React.SetStateAction<string>>;
    setDate: React.Dispatch<React.SetStateAction<DateData>>;
    setIsCategoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsCreateCategoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAnnotationOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenSections: React.Dispatch<React.SetStateAction<{
        [key: string]: boolean;
    }>>

    handleTaskRemove: (id: string, name: string) => void;
    handleAddCategory: (name: string, icon: number, color: string) => void;
    removeCategory: (category: string, id?: string) => void;
    handleAddTask: (data: CreateTaskProps, handleBackToTask: () => void) => void;
    handleUpdateTask: (data: TaskProps, handleBackToTask?: () => void) => void;
    fetchTask: () => void;
    fetchTaskBySearch: (item: string) => void;
    fetchTaskByDate: (date: string) => void;
    createUser: (name: string, email: string, password: string, confirmPassword: string, handleBackToLogin: () => void) => void;
    login: (email: string, password: string) => void;
    deslogar: () => void;
    formatDate: (dateString: string) => string;
    handleTaskConclue: (tasks: TaskProps) => void;
    fetchAnnotation: () => void
    fetchAttachment: (fileName: attachmentProps[]) => void;
    fetchAnnotationById: (id: string) => void;
    featchSubCategory: () => void;
    fetchTaskById: (taskId: string) => void;
}

export const TaskContext = createContext({} as TaskContextProps);

interface TaskContextProviderProps {
    children: ReactNode;
}

export function TaskContextProvider({ children }: TaskContextProviderProps) {
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const [taskById, setTaskById] = useState<TaskProps | undefined>();
    const [annotation, setAnnotation] = useState<AnnotationProps[]>([]);
    const [annotationById, setAnnotationById] = useState<AnnotationProps | undefined>();
    const [tasksSearch, setTasksSearch] = useState<TaskProps[]>([]);
    const [tasksData, setTasksData] = useState<TaskProps[]>([]);

    const [taskName, setTaskName] = useState('');
    const [category, setCategory] = useState<CategoryProps[]>([]);
    const [subCategory, setSubCategory] = useState<SubCategoryProps[]>([]);
    const [attachment, setAttachment] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isAnnotationOpen, setIsAnnotationOpen] = useState(false);
    const [isTaskOpen, setIsTaskOpen] = useState(false);
    const [isGroupOpen, setIsGroupOpen] = useState(false);
    const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryProps | undefined>();
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryProps | undefined>();

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
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        TODAY: true,
        PENDING: true,
        FUTURE: true,
        COMPLETED: true,
    });

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

            let Image

            if (response.data.imageUser) {
                Image = await fetchImageUser(response.data.imageUser)
            }

            const user: User = {
                _id: response.data._id,
                email: response.data.email,
                name: response.data.name,
                imageUser: Image,
                birth: response.data.birth
            };

            console.log(user)
            setUser(user);
            featchCategory();
        } catch (error: any) {
            console.log("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);
        }
    }

    async function fetchImageUser(fileName: string) {
        try {
            const response = await api.get(`/annotation/fetchAttachment?attachment=${fileName}`);
            console.log(response.data)
            return response.data
        } catch (error) {
            console.error("Erro ao buscar os arquivos:", error);
        }
    }

    async function deslogar() {
        addToken("");
        setToken("");
    }

    // CATEGORY
    async function handleAddCategory(name: string, icon: number, color: string) {
        try {
            if (name.length === 0) {
                return Alert.alert("Nova categoria", "Informe o nome da categoria")
            }


            const response = await api.post("/categories/create", {
                category: name,
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
                    const fetchedCategories = response.data;
                    setCategory(fetchedCategories);
                    featchSubCategory();
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

    // SUB CATEGORY
    async function handleAddSubCategory(name: string, icon: number, color: string) {
        try {
            if (name.length === 0) {
                return Alert.alert("Nova categoria", "Informe o nome da categoria")
            }


            const response = await api.post("/categories/create", {
                category: name,
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

    async function featchSubCategory() {
        try {
            if (user) {

                const response = await api.get(`/sub-category/fetch/`);


                if (!response.data || response.data.length === 0) {
                    return;
                }


                setSubCategory(response.data)
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

    async function removeSubCategory(category: string, id?: string) {
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
    async function handleAddTask(data: CreateTaskProps, handleBackToTask: () => void) {
        if (data.name.trim().length === 0) {
            return Alert.alert("Nova Tarefa", "Informe nome da nova tarefa para adicionar");
        }

        try {
            const response = await api.post("/task/create",
                {
                    name: data.name,
                    category: data.category,
                    subCategory: data.subCategory,
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

    async function fetchTask() {
        try {
            if (user) {
                const response = await api.get(`/task/fetch`);

                if (!response.data || response.data.length === 0) {
                    return;
                }


                const tasks = response.data.map((task: any) => ({
                    _id: task._id,
                    name: task.name,
                    category: task.category,
                    subCategory: task.subCategory,
                    priority: task.priority,
                    status: task.status,
                    date: task.date,
                }));

                setTasks(tasks);
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

    async function fetchTaskById(taskId: string) {
        try {
            if (user) {
                const response = await api.get(`/task/fetchById/${taskId}`);

                if (!response.data || response.data.length === 0) {
                    return;
                }

                const task = response.data

                setTaskById(task);
                setIsTaskOpen(true)
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


                setTasksSearch(response.data)
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

    async function fetchTaskByDate(date: string) {
        try {
            if (user) {
                const response = await api.get(`/task/search?q=${date}`);


                setTasksData(response.data)
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
            await api.put(`/task/update/${data._id}`,
                {
                    ...data,
                }
            );

            await fetchTask();
            if (handleBackToTask)
                handleBackToTask();

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

    function formatDate(dateString: string): string {
        const [year, month, day] = dateString.split("T")[0].split("-");
        return `${day}/${month}/${year}`;
    }

    function handleTaskConclue(tasks: TaskProps) {
        const task = { ...tasks };

        handleUpdateTask(task)
    }

    //Annotation

    async function handleAddAnnotation(data: CreateAnnotationProps, handleBackToTask: () => void) {
        if (data.title.trim().length === 0) {
            return Alert.alert("Nova Tarefa", "Informe nome da nova tarefa para adicionar");
        }

        try {
            const response = await api.post("/annotation/create",
                {
                    title: data.title,
                    content: data.content,
                    category: data.category,
                    attachment: data.attachment,
                    members: data.members,
                    groupId: data.groupId
                },
            );

            fetchTask();
            if (response.status === 201) {
                console.log("Anotacao criado com sucesso!");
                handleBackToTask();
            } else {
                console.error("Erro ao criar anotacao:", response.data.message);
            }

        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova Anotacao', error.message);
            } else {
                console.log(error);
                Alert.alert('Nova Anotacao', 'Não foi possível adicionar');
            }
        }
    }

    async function fetchAttachment(fileNames: attachmentProps[]) {
        try {
            const responses = await Promise.all(
                fileNames.map(async (fileName) => {
                    const response = await api.get(`/annotation/fetchAttachment?attachment=${fileName.url}`);
                    return response.data;
                })
            );

            setAttachment(responses);
        } catch (error) {
            console.error("Erro ao buscar os arquivos:", error);
        }
    }

    async function fetchAnnotation() {
        try {
            const response = await api.get(`/annotation/fetchByUser`);


            if (!response.data || response.data.length === 0) {
                return;
            }

            const annotations = response.data.map((annotation: AnnotationProps) => ({
                _id: annotation._id,
                title: annotation.title,
                content: annotation.content,
                category: annotation.category,
                createdAt: annotation.createdAt,
                updatedAt: annotation.updatedAt,
                attachment: annotation.attachment,
                members: annotation.members,
                groupId: annotation.groupId,
                createdUserId: annotation.createdUserId
            }))

            setAnnotation(annotations);
        } catch (error) {
            console.error("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.error("Erro Axios:", error.response?.data || error.message);
            } else {
                console.error("Erro não Axios:", error);
            }
        }
    }


    async function fetchAnnotationBySearch(item: string) {
        try {
            if (user) {
                const response = await api.get(`/task/search?q=${item}`);


                setTasksSearch(response.data)
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

    async function fetchAnnotationById(id: string) {
        try {
            if (user) {
                const response = await api.get(`/annotation/fetchById/${id}`);

                setAnnotationById(response.data);
                setIsAnnotationOpen(true)
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

    async function handleUpdateAnnotation(data: AnnotationProps, handleBackToTask?: () => void) {
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

    async function handleAnnotationRemove(id: string, name: string) {
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
        featchCategory();
        async function updateStatuses() {
            await api.patch("/task/update-status");
        }

        updateStatuses();
    }, [tasks]);

    return (
        <TaskContext.Provider value={{
            tasks, tasksSearch, tasksData, taskName, category, selectedCategory, isDropdownOpen, user, token, loading, error, date, priority, isCategoryOpen, isGroupOpen, isCreateCategoryOpen, selectedSubCategory, annotation, annotationById, isAnnotationOpen, attachment, subCategory, taskById, isTaskOpen, openSections, setOpenSections, setIsTaskOpen, fetchTaskById, setIsAnnotationOpen, setAnnotationById, setAnnotation, setSelectedSubCategory, setIsCreateCategoryOpen, setIsGroupOpen, setTasks, setTaskName, setIsDropdownOpen, setSelectedCategory, setDate, setPriority, setIsCategoryOpen, handleTaskRemove, handleAddCategory, handleAddTask, handleUpdateTask, fetchTask, fetchTaskBySearch, fetchTaskByDate, createUser, login, removeCategory, fetchAnnotation, deslogar, formatDate, handleTaskConclue, fetchAttachment, fetchAnnotationById, featchSubCategory

        }}>
            {children}
        </TaskContext.Provider>
    )
}


