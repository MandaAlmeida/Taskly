import { createContext, ReactNode, useEffect, useState } from "react";
import { CreateSubTaskProps, CreateTaskProps, TaskProps } from "@/@types/task";
import { Alert } from "react-native";
import { AppError } from "@/utils/AppError";
import { DateData } from "react-native-calendars";
import axios from "axios";
import { addToken } from "@/storage/token/addToken";
import { getToken } from "@/storage/token/getToken";
import { CategoryProps } from "@/@types/category";
import api from "@/api/axios";
import { AnnotationProps, attachmentProps } from "@/@types/annotation";
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
    attachment: image[];
    taskById: TaskProps | undefined;
    isTaskOpen: boolean;
    openSections: { [key: string]: boolean };
    logado: boolean;
    createUserAnnotation: userCreate | undefined;
    isAttachmentOpen: boolean;
    annotationSearch: AnnotationProps[]

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
    }>>;
    setIsAttachmentOpen: React.Dispatch<React.SetStateAction<boolean>>;

    handleTaskRemove: (id: string, name: string) => void;
    handleAddCategory: (name: string, icon: string, color: string) => void;
    removeCategory: (category: string, id?: string) => void;
    handleAddTask: (data: CreateTaskProps, handleBackToTask: () => void) => void;
    handleUpdateTask: ({
        _id,
        handleBackToTask,
        ...rest
    }: UpdateTaskParams) => void;
    fetchTask: () => void;
    fetchTaskBySearch: (item: string) => void;
    fetchTaskByDate: (date: string) => void;
    createUser: (formData: FormData, handleBackToLogin: () => void) => void
    login: (email: string, password: string) => void;
    deslogar: () => void;
    fetchAnnotation: () => void
    fetchAttachment: (fileName: attachmentProps) => void;
    fetchAnnotationById: (id: string) => void;
    featchSubCategory: () => void;
    fetchTaskById: (taskId: string) => void;
    handleSubTaskRemove: (taskId: string, subTask: string, subTaskId?: string) => void;
    handleAddAnnotation: (data: FormData) => void;
    handleAddSubCategory: (name: string, icon: string, color: string) => void;
    getNameUser: (userId: string) => void;
    deleteUser: () => void;
    handleUpdateAnnotation: (id: string, data: FormData, handleBackToTask?: () => void) => void;
    handleAnnotationRemove: (id: string, name: string) => void;
    fetchAnnotationBySearch: (item: string) => void;
    handleAttachmentRemove: (id: string, name: string, url: string) => void;
}

export const TaskContext = createContext({} as TaskContextProps);

interface TaskContextProviderProps {
    children: ReactNode;
}

type UpdateTaskParams = Partial<{
    name: string;
    category: string;
    priority: string;
    date: string;
    status: string;
    subCategory: string;
    subTask: CreateSubTaskProps[]
    subTaskId: string;
}> & { _id: string; handleBackToTask?: () => void, task: TaskProps };


type image = {
    title: string;
    url: any;
}

type userCreate = {
    _id: string,
    userName: string
}

export function TaskContextProvider({ children }: TaskContextProviderProps) {
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const [taskById, setTaskById] = useState<TaskProps | undefined>();
    const [annotation, setAnnotation] = useState<AnnotationProps[]>([]);
    const [annotationSearch, setAnnotationSearch] = useState<AnnotationProps[]>([]);
    const [annotationById, setAnnotationById] = useState<AnnotationProps | undefined>();
    const [tasksSearch, setTasksSearch] = useState<TaskProps[]>([]);
    const [tasksData, setTasksData] = useState<TaskProps[]>([]);

    const [taskName, setTaskName] = useState('');
    const [createUserAnnotation, setCreateUserAnnotation] = useState<userCreate | undefined>();

    const [category, setCategory] = useState<CategoryProps[]>([]);
    const [subCategory, setSubCategory] = useState<SubCategoryProps[]>([]);
    const [attachment, setAttachment] = useState<image[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isAnnotationOpen, setIsAnnotationOpen] = useState(false);
    const [isTaskOpen, setIsTaskOpen] = useState(false);
    const [isGroupOpen, setIsGroupOpen] = useState(false);
    const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
    const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryProps | undefined>();
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryProps | undefined>();
    const [logado, setLogado] = useState(false)

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
    async function createUser(formData: FormData, handleBackToLogin: () => void,) {
        try {
            await api.post("/user/register", formData, {
                headers: {
                    "Content-Type": `multipart/form-data`,
                },
            });
        } catch (error: any) {
            console.log("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);
            alert(`Erro: ${error.message}`);
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
                getUser()
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


            setUser(user);
            featchCategory();
            setLogado(true);
        } catch (error: any) {
            console.log("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);
        }
    }

    async function getNameUser(userId: string) {
        try {
            const response = await api.get(`/user/fetch/${userId}`);

            setCreateUserAnnotation(response.data)
        } catch (error: any) {
            console.log("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);
        }
    }

    async function fetchImageUser(fileName: string) {
        try {
            const response = await api.get(`/uploads/${fileName}`);
            return response.data.url
        } catch (error) {
            console.log("Erro ao buscar os arquivos:", error);
        }
    }

    async function deleteUser() {
        try {
            Alert.alert("Ecluir", `Deseja realmente excluir sua conta ${user?.name}?`, [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            await api.delete("/user/delete");
                            deslogar();
                            Alert.alert("Sucesso", "Usúario excluido com sucesso!");
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Erro", "Não foi possível remover a categoria.");
                        }
                    }
                },

            ])

        } catch (error) {
            console.log(error)
            Alert.alert("Remover usuario", "Não foi possivel remover essa usuario.")
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
            }
        }
    }

    async function deslogar() {
        addToken("");
        setToken("");
        setLogado(false)
    }

    // CATEGORY
    async function handleAddCategory(name: string, icon: string, color: string) {
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
                console.log("Erro ao tentar criar a categoria", response.data.message);
            }
        } catch (error: any) {
            Alert.alert("Novo categoria", error.messag)
            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
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

                setCategory(response.data);
                featchSubCategory();
            }
        } catch (error) {
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
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
                            console.log(error);
                            Alert.alert("Erro", "Não foi possível remover a categoria.");
                        }
                    }
                },

            ])
        } catch (error) {
            console.log(error)
            Alert.alert("Remover categoria", "Não foi possivel remover essa categoria.")
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
            }
        }
    }

    // SUB CATEGORY
    async function handleAddSubCategory(name: string, icon: string, color: string) {
        try {

            const subCategory = {
                subCategory: name,
                categoryName: selectedCategory?.category,
                icon,
                color

            }
            await api.post("/sub-category/create", subCategory);
            console.log("Categoria criada com sucesso!");
            featchCategory()

        } catch (error: any) {
            Alert.alert("Nova categoria", error.message)
            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
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
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
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
                            await api.delete(`/sub-category/delete/${id}`);

                            setCategory(prevTasks => prevTasks.filter(task => task._id !== id));

                            Alert.alert("Sucesso", "Categoria removida com sucesso!");
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Erro", "Não foi possível remover a categoria.");
                        }
                    }
                },

            ])
        } catch (error) {
            console.log(error)
            Alert.alert("Remover categoria", "Não foi possivel remover essa categoria.")
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
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
                    subTask: data.subTask,
                    priority: data.priority,
                    date: data.date,
                },
            );

            fetchTask();
            if (response.status === 201) {
                console.log("Tarefa criada com sucesso!");
                handleBackToTask();
            } else {
                console.log("Erro ao criar task:", response.data.message);
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


                const tasks = response.data

                featchCategory();
                featchSubCategory();
                setTasks(tasks);
            }
        } catch (error) {
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
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
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
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
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
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
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
            }
        }
    }

    async function handleUpdateTask({
        _id,
        handleBackToTask,
        task,
        ...rest
    }: UpdateTaskParams) {
        try {
            const updatePayload: any = {};


            if (rest.name) { updatePayload.name = rest.name } else { updatePayload.name = task.name };
            if (rest.category) { updatePayload.category = rest.category } else { updatePayload.category = task.category };
            if (rest.priority) updatePayload.priority = rest.priority;
            if (rest.date) { updatePayload.date = new Date(rest.date).toISOString() } else { updatePayload.date = new Date(task.date).toISOString() };
            if (rest.status) updatePayload.status = rest.status;
            if (rest.subCategory) updatePayload.subCategory = rest.subCategory;
            if (rest.subTask) {
                updatePayload.subTask = rest.subTask.map(({ _id, task, status }) => ({
                    ...(!!_id && { _id }),
                    task,
                    status,
                }));
            }

            await api.put(`/task/update/${_id}`, updatePayload)
            await fetchTask();
            await fetchTaskById(_id);
            if (handleBackToTask) handleBackToTask();
        } catch (error) {
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                Alert.alert("Erro:", `${error.response?.data.message}`);
            } else {
                console.log("Erro não Axios:", error);
            }
        }
    }

    async function handleSubTaskRemove(taskId: string, subTask: string, subTaskId?: string) {
        try {
            Alert.alert("Remover", `Remover a tarefa ${subTask}?`, [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            await api.delete(`/task/deleteSubTask/${taskId}?sub=${subTaskId}`);

                            fetchTaskById(taskId)

                            Alert.alert("Sucesso", "Tarefa removida com sucesso!");
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Erro", "Não foi possível remover a tarefa.");
                        }
                    }
                },
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Ocorreu um problema ao tentar remover a tarefa.");
        }
    }

    async function handleTaskRemove(id: string, name: string,) {
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

                            fetchTask()
                            setIsTaskOpen(false)
                            Alert.alert("Sucesso", "Tarefa removida com sucesso!");
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Erro", "Não foi possível remover a tarefa.");
                        }
                    }
                },
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Ocorreu um problema ao tentar remover a tarefa.");
        }
    }

    //Annotation

    async function handleAddAnnotation(data: FormData) {

        try {
            await api.post("/annotation/create", data, {
                headers: {
                    "Content-Type": `multipart/form-data`,
                },
            });

            fetchAnnotation();
        } catch (error: any) {
            if (error.response) {
                // Aqui você consegue acessar a resposta completa do erro.
                console.log("Erro do back-end:", error.response.data);
                Alert.alert('Nova Anotacao', error.response.data.message);
            } else if (error instanceof AppError) {
                Alert.alert('Nova Anotacao', error.message);
            } else {
                console.log(error);
                Alert.alert('Nova Anotacao', 'Não foi possível adicionar');
            }
        }

    }

    async function fetchAttachment(file: attachmentProps) {
        try {
            const response = await api.get(`/uploads/${file.url}`);

            const image = {
                type: file.type,
                title: file.title,
                url: response.data.url
            };

            setAttachment(prevAttachment => [...prevAttachment, image]);

        } catch (error) {
            console.log("Erro ao buscar os arquivos:", error);
        }
    }

    async function fetchAnnotation() {
        try {
            const response = await api.get(`/annotation/fetchByUser`);


            if (!response.data || response.data.length === 0) {
                return;
            }

            const annotations = response.data

            setAnnotation(annotations);
        } catch (error) {
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
            }
        }
    }

    async function fetchAnnotationBySearch(item: string) {
        try {
            if (user) {
                const response = await api.get(`/annotation/search?q=${item}`);


                setAnnotationSearch(response.data)
            }
        } catch (error) {
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
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
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
            }
        }
    }

    async function handleUpdateAnnotation(id: string, data: FormData, handleBackToTask?: () => void) {
        try {
            console.log(data.get("attachments"))
            await api.put(`/annotation/update/${id}`, data, {
                headers: {
                    "Content-Type": `multipart/form-data`,
                },
            });
            await fetchAnnotation();
            if (handleBackToTask) handleBackToTask();

        } catch (error: any) {
            if (error.response) {
                console.log("Erro do back-end:", error.response.data);
                Alert.alert('Nova Anotacao', error.response.data.message);
            } else if (error instanceof AppError) {
                Alert.alert('Nova Anotacao', error.message);
            } else {
                console.log(error);
                Alert.alert('Nova Anotacao', 'Não foi possível adicionar');
            }
        }
    }

    async function handleAttachmentRemove(id: string, name: string, url: string) {
        try {
            Alert.alert("Remover", `Remover o anexo ${name}?`, [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            await api.delete(`/annotation/delete/${id}/attachment/${url}`);

                            annotationById?.attachments?.filter(attachment => attachment.url !== url)
                            setIsAttachmentOpen(false)
                            Alert.alert("Sucesso", "Anotação removida com sucesso!");
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Erro", "Não foi possível remover a Anotação.");
                        }
                    }
                },
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Ocorreu um problema ao tentar remover a tarefa.");
        }
    }

    async function handleAnnotationRemove(id: string, name: string) {
        try {
            Alert.alert("Remover", `Remover a anotação ${name}?`, [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            await api.delete(`/annotation/delete/${id}`);

                            fetchAnnotation()
                            setIsAnnotationOpen(false)
                            Alert.alert("Sucesso", "Anotação removida com sucesso!");
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Erro", "Não foi possível remover a Anotação.");
                        }
                    }
                },
            ]);
        } catch (error) {
            console.log(error);
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
            tasks, tasksSearch, tasksData, taskName, category, selectedCategory, isDropdownOpen, user, token, loading, error, date, priority, isCategoryOpen, isGroupOpen, isCreateCategoryOpen, selectedSubCategory, annotation, annotationById, isAnnotationOpen, attachment, subCategory, taskById, isTaskOpen, openSections, logado, createUserAnnotation, isAttachmentOpen, annotationSearch, setOpenSections, setIsTaskOpen, fetchTaskById, setIsAnnotationOpen, setAnnotationById, setAnnotation, setSelectedSubCategory, setIsCreateCategoryOpen, setIsGroupOpen, setTasks, setTaskName, setIsDropdownOpen, setSelectedCategory, setDate, setPriority, setIsCategoryOpen, setIsAttachmentOpen, handleTaskRemove, handleAddCategory, handleAddTask, handleUpdateTask, fetchTask, fetchTaskBySearch, fetchTaskByDate, createUser, login, removeCategory, fetchAnnotation, deslogar, fetchAttachment, fetchAnnotationById, featchSubCategory, handleSubTaskRemove, handleAddAnnotation, handleAddSubCategory, getNameUser, deleteUser, handleUpdateAnnotation, handleAnnotationRemove, fetchAnnotationBySearch, handleAttachmentRemove
        }}>
            {children}
        </TaskContext.Provider>
    )
}


