import { Text, View } from "react-native";
import { useTask } from "@/hooks/useTask";
import { Loading } from "@/components/loading";
import { SectionTask } from "@/components/sectionTasks";
import { ModalTask } from "@/components/modalTask";
import { theme } from "@/styles/theme";
import { useEffect } from "react";
import { styles } from "./styles";
import { Header } from "@/components/header";
import { EmptyState } from "@/components/emptyState";
import { socket } from "@/notification";
import { notificationProps } from "@/@types/notification";

export function Home() {
    const { data, uiState, fetchTask, setData } = useTask();


    if (uiState.loading) {
        return <Loading />;
    }

    useEffect(() => {
        if (data.user?._id) {
            socket.emit('join', data.user._id); // B deve emitir isso ao entrar
        }

        const handleNotification = (notification: any) => {
            setData(prev => ({
                ...prev,
                notification: [...prev.notification, notification],
            }));
        };

        socket.on('notification', handleNotification);

        return () => {
            socket.off('notification', handleNotification);
        };
    }, [data.user?._id]);

    useEffect(() => {
        fetchTask();
    }, []);


    const sections = [
        {
            title: 'Pra terminar hoje 🙌',
            content: 'TODAY',
            lenght: data.tasksSearch.length > 0 ? data.tasksSearch.filter(task => task.status === 'TODAY').length.toString() : data.tasks.filter(task => task.status === 'TODAY').length.toString(),
            data: uiState.openSections['TODAY'] ? data.tasksSearch.length > 0 ? data.tasksSearch.filter(task => task.status === 'TODAY') : data.tasks.filter(task => task.status === 'TODAY') : [],
        }
    ];

    return (
        <View style={styles.container}>
            <Header text="Inicio" />
            {data.notification && data.notification.map(notification =>
                <View key={notification._id}>
                    <Text>Notificação: {notification.message}</Text>
                </View>)}
            <View>
                <Text style={styles.title}>Bem-vindo(a) de volta </Text>
                <Text style={styles.name}>{data.user?.name}</Text>
            </View>

            {sections[0].lenght === "0" ?
                <EmptyState text="tarefas" title="Você não possui tarefas para hoje" />
                :
                <View>
                    <SectionTask sections={sections} />
                </View>
            }

            {data.taskById && <ModalTask
                _id={data.taskById._id}
                name={data.taskById.name}
                category={data.taskById.category}
                subCategory={data.taskById.subCategory}
                subTask={data.taskById.subTask}
                priority={data.taskById.priority}
                date={data.taskById.date}
                status={data.taskById.status}
                userId={data.taskById.userId}
                color={data.subCategory.find((subCategory) => subCategory._id === data.taskById?.subCategory)?.color || theme.blue1}
            />}
        </View>
    );
}
