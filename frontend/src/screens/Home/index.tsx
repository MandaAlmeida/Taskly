import { Text, View } from "react-native";
import { useTask } from "@/hooks/useTask";
import { Loading } from "@/components/loading";
import { SectionTaks } from "@/components/sectionTasks";

export function Home() {
    const { loading, user, tasks, tasksSearch, openSections } = useTask();


    if (loading) {
        return <Loading />;
    }


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
                <SectionTaks sections={sections} />
            </View>
        </View>
    );
}
