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
import { AnnotationProps, attachmentProps, membersProps } from "@/@types/annotation";
import { SubCategoryProps } from "@/@types/subCategory";
import { GroupProps } from "@/@types/group";

type User = {
    _id: string;
    email: string;
    name: string;
    imageUser: string;
    birth: string
}

type dataProps = {
    tasks: TaskProps[];
    taskById: TaskProps | undefined;
    tasksSearch: TaskProps[];
    tasksData: TaskProps[];
    taskName: string;
    priority: string;
    annotation: AnnotationProps[];
    annotationSearch: AnnotationProps[];
    annotationById: AnnotationProps | undefined;
    attachment: image[];
    categories: CategoryProps[];
    subCategory: SubCategoryProps[];
    selectedCategory: CategoryProps | undefined;
    selectedSubCategory: SubCategoryProps | undefined;
    groups: GroupProps[];
    selectedGroup: GroupProps[];
    token: string;
    user: User | null;
    logado: boolean;
    createUserAnnotation: userCreate | undefined;
    member: membersProps[] | [];
    userExists: string
};

type ModalProps =
    | "isMenuGroupOpen"
    | "isMenuCategoryOpen"
    | "isCategoryOpen"
    | "isGroupOpen"
    | "isCreateCategoryOpen"
    | "isCreateGroupOpen"
    | "isDropdownOpen"
    | "isAnnotationOpen"
    | "isTaskOpen"
    | "isAttachmentOpen"
    | "isCreateMemberOpen"
    | null;


type uiStateProps = {
    finalUrl: string;
    loading: boolean;
    error: boolean;
    date: DateData;
    hours: string;
    openSections: { [key: string]: boolean };
};

interface TaskContextProps {
    // 📌 Tarefas
    data: dataProps;

    setData: React.Dispatch<React.SetStateAction<dataProps>>;

    // 📅 Datas e Seções Abertas
    uiState: uiStateProps;

    setUiState: React.Dispatch<React.SetStateAction<uiStateProps>>;

    // 📦 Modais e Dropdowns
    modalState: { name: ModalProps, data?: any };

    setModalState: React.Dispatch<React.SetStateAction<{ name: ModalProps, data?: any }>>;

    // 📌 Funções de Tarefa
    handleTaskRemove: (id: string, name: string) => void;
    handleAddTask: (data: CreateTaskProps, handleBackToTask: () => void) => void;
    handleUpdateTask: (params: UpdateTaskParams) => void;
    fetchTask: () => void;
    fetchTaskBySearch: (item: string) => void;
    fetchTaskByDate: (date: string) => void;
    fetchTaskById: (taskId: string) => void;
    handleSubTaskRemove: (taskId: string, subTask: string, subTaskId?: string) => void;

    // 🗒️ Funções de Anotação
    fetchAnnotation: () => void;
    fetchAnnotationById: (id: string) => void;
    fetchAnnotationBySearch: (item: string) => void;
    handleAddAnnotation: (data: FormData) => void;
    handleUpdateAnnotation: (id: string, data: FormData, handleBackToTask?: () => void) => void;
    handleAnnotationRemove: (id: string, name: string) => void;
    fetchByGroup: () => void;

    // 📁 Funções de Anexo
    fetchAttachment: (fileName: attachmentProps) => void;
    handleAttachmentRemove: (id: string, name: string, url: string) => void;
    handleDownloadAttachment: (url: string) => void;

    // 🗂️ Funções de Categoria
    handleAddCategory: (name: string, icon: number, color: string) => void;
    handleUpdateCategory: (id: string, name: string, icon: number, color: string) => void;
    removeCategory: (category: string, id?: string) => void;
    handleAddSubCategory: (name: string, icon: string, color: string) => void;
    removeSubCategory: (subCategory: string, id?: string) => void;
    featchSubCategory: () => void;

    // 👥 Funções de Grupo
    handleAddGroup: (name: string, description: string, icon: number, color: string, members?: membersProps[]) => void;
    handleUpdateGroup: (id: string, name: string, description: string, icon: number, color: string) => void;
    fetchGroup: () => void;
    removeGroup: (group: string, id?: string) => void;

    // 👤 Funções de Autenticação
    login: (email: string, password: string) => void;
    createUser: (formData: FormData, handleBackToLogin: () => void) => void;
    deslogar: () => void;
    deleteUser: () => void;
    getNameUser: (userId: string) => void;
    getUserMember: (name: string, accessType?: string, handleBackToNext?: () => void) => void;
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
    const [data, setData] = useState({
        tasks: [] as TaskProps[],
        taskById: undefined as TaskProps | undefined,
        tasksSearch: [] as TaskProps[],
        tasksData: [] as TaskProps[],
        taskName: "",
        priority: "",

        annotation: [] as AnnotationProps[],
        annotationSearch: [] as AnnotationProps[],
        annotationById: undefined as AnnotationProps | undefined,

        attachment: [] as image[],

        categories: [] as CategoryProps[],
        subCategory: [] as SubCategoryProps[],
        selectedCategory: undefined as CategoryProps | undefined,
        selectedSubCategory: undefined as SubCategoryProps | undefined,

        groups: [] as GroupProps[],
        selectedGroup: [] as GroupProps[],

        member: [] as membersProps[],

        token: "" as string,
        user: null as User | null,
        logado: false as boolean,
        createUserAnnotation: undefined as userCreate | undefined,
        userExists: ""
    });

    // Agrupar estados relacionados aos modais
    const [modalState, setModalState] = useState<{ name: ModalProps, data?: any }>({ name: null });


    // Agrupar estados de UI
    const [uiState, setUiState] = useState({
        finalUrl: "",
        loading: false,
        error: false,
        hours: "",
        date: {
            year: 0,
            month: 0,
            day: 0,
            timestamp: 0,
            dateString: "",
        } as DateData,
        openSections: {
            TODAY: true,
            PENDING: true,
            FUTURE: true,
            COMPLETED: true,
        } as { [key: string]: boolean },
    });

    // USER
    async function createUser(formData: FormData, handleBackToLogin: () => void,) {
        try {
            await api.post("/user/register", formData, {
                headers: {
                    "Content-Type": `multipart/form-data`,
                },
            });

            handleBackToLogin();
        } catch (error: any) {
            console.log("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);
            Alert.alert(`Erro: ${error.message}`);
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

            addToken(response.data.token);
            setData(prevState => ({ ...prevState, token: response.data.token, }));
            getUser()
            console.log(data.token)

        } catch (error: any) {
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

            setData(prevState => ({ ...prevState, user: user, logado: true }));
            featchCategory();
        } catch (error: any) {
            console.log("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);
        }
    }

    async function getNameUser(userId: string) {
        try {
            const response = await api.get(`/user/fetch/${userId}`);
            setData(prevState => ({ ...prevState, createUserAnnotation: response.data }));

        } catch (error: any) {
            console.log("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);
        }
    }

    async function getUserMember(name: string, accessType?: string, handleBackToNext?: () => void) {
        try {
            const response = await api.get(`/user/fetchByName?n=${name}`);

            if (accessType) {
                const memberData = {
                    userId: response.data._id,
                    name: response.data.userName,
                    accessType,
                };

                setData(prev => ({
                    ...prev,
                    member: [...(prev.member || []), memberData],
                }));
            }
            console.log(response.data)
            if (!response.data) {

                handleBackToNext && handleBackToNext();
            } else {
                Alert.alert("Nome de usuario:", "Já existe usuario com esse nome")
            }

        } catch (error: any) {
            console.log("Erro ao conectar com o servidor:", error.response ? error.response.data : error.message);
            return null;
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
            Alert.alert("Ecluir", `Deseja realmente excluir sua conta ${data.user?.name}?`, [
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
        setData(prevState => ({ ...prevState, token: "", logado: false }));

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
                console.log("Erro ao tentar criar a categoria", response.data.message);
            }
        } catch (error: any) {

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
                Alert.alert("Novo categoria", error.message)
            } else {
                console.log("Erro não Axios:", error);
            }
        }
    }

    async function handleUpdateCategory(id: string, name: string, icon: number, color: string) {
        try {
            await api.put(`/categories/update/${id}`, {
                category: name,
                icon,
                color
            });


            featchCategory()
        } catch (error: any) {

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
                Alert.alert("Novo categoria", error.message)
            } else {
                console.log("Erro não Axios:", error);
            }
        }
    }

    async function featchCategory() {
        try {
            if (data.user) {
                const response = await api.get(`/categories/fetch`);

                if (!response.data || response.data.length === 0) {
                    return;
                }

                setData(prevState => ({ ...prevState, categories: response.data }));

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

                            featchCategory()
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
                categoryName: data.selectedCategory?.category,
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
            if (data.user) {

                const response = await api.get(`/sub-category/fetch/`);


                if (!response.data || response.data.length === 0) {
                    return;
                }

                setData(prevState => ({ ...prevState, subCategory: response.data }));

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

    async function removeSubCategory(subCategory: string, id?: string) {
        try {
            Alert.alert("Remover", `Remover a categoria ${subCategory}?`, [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            await api.delete(`/sub-category/delete/${id}`);

                            featchSubCategory()

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
        try {
            await api.post("/task/create", data);

            fetchTask();
            handleBackToTask();
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
            if (data.user) {
                const response = await api.get(`/task/fetch`);

                if (!response.data || response.data.length === 0) {
                    return;
                }

                const tasks = response.data;

                featchCategory();
                featchSubCategory();
                setData(prevState => ({ ...prevState, tasks }));
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
            if (data.user) {
                const response = await api.get(`/task/fetchById/${taskId}`);

                if (!response.data || response.data.length === 0) {
                    return;
                }

                const task = response.data;

                setData(prevState => ({ ...prevState, taskById: task }));
                setModalState({ name: "isTaskOpen" });
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
            if (data.user) {
                const response = await api.get(`/task/search?q=${item}`);

                setData(prevState => ({ ...prevState, tasksSearch: response.data }));
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
            if (data.user) {
                const response = await api.get(`/task/search?q=${date}`);

                setData(prevState => ({ ...prevState, tasksData: response.data }));
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

            await api.put(`/task/update/${_id}`, updatePayload);
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

                            fetchTask();
                            setModalState({ name: null });
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

    // Anotação
    async function handleAddAnnotation(data: FormData) {
        try {
            await api.post("/annotation/create", data, {
                headers: {
                    "Content-Type": `multipart/form-data`,
                },
            });

            fetchAnnotation();
            setData(prevData => ({ ...prevData, member: [] }))
        } catch (error: any) {
            if (error.response) {
                console.log("Erro do back-end:", error.response.data);
                Alert.alert('Nova Anotação', error.response.data.message);
            } else if (error instanceof AppError) {
                Alert.alert('Nova Anotação', error.message);
            } else {
                console.log(error);
                Alert.alert('Nova Anotação', 'Não foi possível adicionar');
            }
        }
    }

    async function fetchAnnotation() {
        try {
            const response = await api.get(`/annotation/fetchByUser`);

            if (!response.data || response.data.length === 0) {
                return;
            }

            const annotations = response.data;

            setData(prevState => ({ ...prevState, annotation: annotations }));
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
            if (data.user) {
                const response = await api.get(`/annotation/search?q=${item}`);

                setData(prevState => ({ ...prevState, annotationSearch: response.data }));
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
            if (data.user) {
                const response = await api.get(`/annotation/fetchById/${id}`);

                setData(prevState => ({ ...prevState, annotationById: response.data }));
                setModalState({ name: "isAnnotationOpen" })
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

    async function fetchByGroup() {
        try {
            if (data.user) {
                const response = await api.get(`/annotation/fetchByGroup`);

                setData(prevState => ({ ...prevState, annotation: response.data }));
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
            console.log(data.get("attachments"));
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
                Alert.alert('Nova Anotação', error.response.data.message);
            } else if (error instanceof AppError) {
                Alert.alert('Nova Anotação', error.message);
            } else {
                console.log(error);
                Alert.alert('Nova Anotação', 'Não foi possível adicionar');
            }
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
                            setModalState({ name: null })

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

    // Grupos
    async function handleAddGroup(name: string, description: string, icon: number, color: string, members?: membersProps[]) {
        try {
            const response = await api.post("/group/create", {
                name,
                description,
                icon,
                color,
                members
            });

            if (response.status === 201) {
                console.log("Grupo criado com sucesso!");
                fetchGroup();
            } else {
                console.log("Erro ao tentar criar o grupo", response.data.message);
            }
        } catch (error: any) {
            Alert.alert("Novo grupo", error.message);
            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
            }
        }
    }

    async function handleUpdateGroup(id: string, name: string, description: string, icon: number, color: string) {
        try {
            await api.put(`/group/update/${id}`, {
                name,
                description,
                icon,
                color,
            });

            fetchGroup();
        } catch (error: any) {
            Alert.alert("Novo grupo", error.message);
            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
            }
        }
    }

    async function fetchGroup() {
        try {
            if (data.user) {
                const response = await api.get(`/group/fetch`);

                if (!response.data || response.data.length === 0) {
                    return;
                }
                setData(prevState => ({ ...prevState, groups: response.data }));
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

    async function removeGroup(group: string, id?: string) {
        try {
            Alert.alert("Remover", `Remover o grupo ${group}?`, [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            await api.delete(`/group/delete/${id}`);

                            fetchGroup();
                            Alert.alert("Sucesso", "Grupo removido com sucesso!");
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Erro", "Não foi possível remover o grupo.");
                        }
                    }
                },
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert("Remover grupo", "Não foi possível remover esse grupo.");
            console.log("Erro desconhecido:", error);

            if (axios.isAxiosError(error)) {
                console.log("Erro Axios:", error.response?.data || error.message);
            } else {
                console.log("Erro não Axios:", error);
            }
        }
    }

    //Anexos
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

                            data.annotationById?.attachments?.filter(attachment => attachment.url !== url)
                            setModalState({ name: "isAttachmentOpen" })

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

    async function fetchAttachment(file: attachmentProps) {
        try {
            const response = await api.get(`/uploads/${file.url}`);

            const image = {
                type: file.type,
                title: file.title,
                url: response.data.url
            };

            setData(prevState => ({
                ...prevState,
                attachment: [...prevState.attachment, image]
            }));

        } catch (error) {
            console.log("Erro ao buscar os arquivos:", error);
        }
    }

    async function handleDownloadAttachment(url: string) {
        try {
            const response = await api.get(`/uploads/download/${url}`);

            console.log(response)
            // setFinalUrl(response)

        } catch (error) {
            console.log("Erro ao buscar os arquivos:", error);
        }
    }



    useEffect(() => {
        async function saveTokenAndFetchUser() {
            const tokenLocal = await getToken();
            if (tokenLocal) {
                setData(prevState => ({ ...prevState, token: tokenLocal.replace(/"/g, "") }));
                getUser();
            }
        }

        if (!data.token) {
            saveTokenAndFetchUser();
        }

        featchCategory();
        async function updateStatuses() {
            await api.patch("/task/update-status");
        }

        updateStatuses();
    }, [data.tasks]);

    return (
        <TaskContext.Provider value={{
            data, modalState, uiState, setData, setModalState, setUiState,
            fetchTaskById, handleTaskRemove, handleAddCategory, handleAddTask, handleUpdateTask, fetchTask, fetchTaskBySearch, fetchTaskByDate, createUser, login, removeCategory, fetchAnnotation, deslogar, fetchAttachment, fetchAnnotationById, featchSubCategory, handleSubTaskRemove, handleAddAnnotation, handleAddSubCategory, getNameUser, deleteUser, handleUpdateAnnotation, handleAnnotationRemove, fetchAnnotationBySearch, handleAttachmentRemove, handleDownloadAttachment, removeSubCategory, fetchGroup, handleAddGroup, removeGroup, handleUpdateGroup, handleUpdateCategory, getUserMember, fetchByGroup
        }}>
            {children}
        </TaskContext.Provider>
    )
}


