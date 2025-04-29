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
    const { loading, user, tasks, tasksSearch, openSections, taskById, subCategory, fetchTask } = useTask();


    if (loading) {
        return <Loading />;
    }


    useEffect(() => {
        fetchTask();
    }, []);


    const sections = [
        {
            title: 'Pra terminar hoje 🙌',
            content: 'TODAY',
            lenght: tasksSearch.length > 0 ? tasksSearch.filter(task => task.status === 'TODAY').length.toString() : tasks.filter(task => task.status === 'TODAY').length.toString(),
            data: openSections['TODAY'] ? tasksSearch.length > 0 ? tasksSearch.filter(task => task.status === 'TODAY') : tasks.filter(task => task.status === 'TODAY') : [],
        }
    ];


    console.log(sections[0].lenght)
    return (
        <View style={styles.container}>
            <Header text="Inicio" />
            <View>
                <Text style={styles.title}>Bem-vindo(a) de volta </Text>
                <Text style={styles.name}>{user?.name}</Text>
            </View>

            {sections[0].lenght === "0" ?
                <EmptyState text="tarefas" title="Você não possui tarefas para hoje" />
                :
                <View>
                    <SectionTask sections={sections} />
                </View>
            }

            {taskById && <ModalTask
                _id={taskById._id}
                name={taskById.name}
                category={taskById.category}
                subCategory={taskById.subCategory}
                subTask={taskById.subTask}
                priority={taskById.priority}
                date={taskById.date}
                status={taskById.status}
                userId={taskById.userId}
                color={subCategory.find((subCategory) => subCategory._id === taskById.subCategory)?.color || theme.blue1}
            />}
        </View>
    );
}
