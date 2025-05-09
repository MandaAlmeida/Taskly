import { SectionList, View } from "react-native"
import { Task } from "../task";
import { useTask } from "@/hooks/useTask";
import { TextFilter } from "../textFilter";
import { TaskProps } from "@/@types/task";
import { theme } from "@/styles/theme";
import { formatDate } from "@/utils/formatDate";

type Section = {
    title: string;
    content: string;
    lenght: string;
    data: TaskProps[];
}

type SectionProps = {
    sections: Section[];
};

export function SectionTask({ sections }: SectionProps) {
    const { data, setUiState, uiState, fetchTaskById } = useTask();


    function toggleSection(key: string) {
        setUiState(prev => ({
            ...prev,
            openSections: {
                ...prev.openSections,
                [key]: !prev.openSections[key],
            },
        }));
    }


    return (
        <SectionList
            sections={sections}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => (
                <Task
                    _id={item._id}
                    name={item.name}
                    handleOpenTask={() => fetchTaskById(item._id)}
                    status={item.status}
                    priority={item.priority}
                    date={formatDate(item.date)}
                    color={data.categories.find((category) => category._id === item.category)?.color || theme.blue1}
                    category={data.categories.find((category) => category._id === item.category)?.category || "Categoria nao encontrada"}
                    hours={item.hours}
                    subTask={item.subTask}
                    userId={item.userId}
                />
            )
            }
            renderSectionHeader={({ section: { title, content, lenght } }) => (
                <TextFilter text={title} number={lenght ? lenght : "0"} Open={() => toggleSection(content)} isOpen={uiState.openSections[content]} />
            )}
        />
    )
}