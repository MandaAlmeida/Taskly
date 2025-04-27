import { Text, View } from "react-native";
import { useTask } from "@/hooks/useTask";
import { Loading } from "@/components/loading";
import { SectionTask } from "@/components/sectionTasks";
import { ModalTask } from "@/components/modalTask";
import { theme } from "@/styles/theme";
import { useEffect } from "react";

export function Home() {
    const { loading, user, tasks, tasksSearch, openSections, taskById, category, subCategory, fetchTask } = useTask();


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

    return (
        <View style={{ flex: 1 }}>
            <Text>Bem-vindo(a) {user?.name}</Text>
            <View>
                <SectionTask sections={sections} />
            </View>
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
