import { SectionList, View } from "react-native"
import { Task } from "../task";
import { useTask } from "@/hooks/useTask";
import { TextFilter } from "../textFilter";
import { TaskProps } from "@/@types/task";
import { theme } from "@/styles/theme";

type Section = {
    title: string;
    content: string;
    lenght: string;
    data: TaskProps[];
}

type SectionProps = {
    sections: Section[];
};

export function SectionTaks({ sections }: SectionProps) {
    const { handleTaskConclue, formatDate, subCategory, fetchTaskById, openSections, setOpenSections } = useTask();


    function toggleSection(key: string) {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }

    function handleOpenTask(taskId: string) {
        fetchTaskById(taskId)
    }

    return (
        <SectionList
            sections={sections}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => (
                <Task
                    name={item.name}
                    handleTaskConclue={() => handleTaskConclue(item)}
                    handleOpenTask={() => handleOpenTask(item._id)}
                    status={item.status}
                    priority={item.priority}
                    category={
                        subCategory.find((subCategory) => subCategory._id === item.subCategory)?.subCategory || "Sem sub categoria"
                    }
                    date={formatDate(item.date)}
                    color={subCategory.find((subCategory) => subCategory._id === item.subCategory)?.color || theme.blue1}
                />
            )
            }
            renderSectionHeader={({ section: { title, content, lenght } }) => (
                <TextFilter text={title} number={lenght ? lenght : "0"} Open={() => toggleSection(content)} isOpen={openSections[content]} />
            )}
        />
    )
}