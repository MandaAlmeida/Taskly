import { Text, View } from "react-native";
import { useTask } from "@/hooks/useTask";
import { Loading } from "@/components/loading";
import { SectionTask } from "@/components/sectionTasks";
import { useEffect } from "react";
import { styles } from "./styles";
import { Header } from "@/components/header";
import { EmptyState } from "@/components/emptyState";
import { socket } from "@/notification";

export function Home() {
    const { data, uiState, fetchTask, setData } = useTask();

    useEffect(() => {
        fetchTask();
    }, []);

    useEffect(() => {
        if (data.user?._id) {
            socket.emit('join', data.user._id);
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

    if (uiState.loading) {
        return <Loading />;
    }

    // 🔍 Usa as tarefas filtradas ou todas
    const currentTasks = data.tasksSearch.length > 0 ? data.tasksSearch : data.tasks;
    const todayTasks = currentTasks.filter(task => task.status === 'TODAY');

    const sections = todayTasks.length > 0
        ? [{
            title: 'Pra terminar hoje 🙌',
            content: 'TODAY',
            length: todayTasks.length.toString(),
            data: uiState.openSections['TODAY'] ? todayTasks : [],
        }]
        : [];

    return (
        <View style={styles.container}>
            <Header text="Início" />

            {data.notification?.map(notification => (
                <View key={notification._id}>
                    <Text>Notificação: {notification.message}</Text>
                </View>
            ))}

            <View>
                <Text style={styles.title}>Bem-vindo(a) de volta</Text>
                <Text style={styles.name}>{data.user?.name}</Text>
            </View>

            {sections.length === 0 ? (
                <EmptyState text="tarefas" title="Você não possui tarefas para hoje" />
            ) : (
                <SectionTask sections={sections} />
            )}
        </View>
    );
}
