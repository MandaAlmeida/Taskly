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

export function Home() {
    const { data, uiState, fetchTask } = useTask();


    if (uiState.loading) {
        return <Loading />;
    }


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
