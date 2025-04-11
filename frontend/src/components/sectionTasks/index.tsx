import { SectionList, View } from "react-native"
import { Task } from "../task";
import { useTask } from "@/hooks/useTask";
import { TaskProps } from "@/@types/task";
import { useState } from "react";
import { TextFilter } from "../textFilter";

type Props = {
    data: TaskProps[]
}

export function SectionTaks() {
    const { tasks, tasksFilter, handleUpdateTask } = useTask();
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        TODAY: true,
        PENDING: true,
        FUTURE: true,
        COMPLETED: true,
    });

    function toggleSection(key: string) {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }

    const sections = [
        {
            title: 'Pra terminar hoje 🙌',
            content: 'TODAY',
            lenght: tasksFilter ? tasksFilter.filter(task => task.status === 'TODAY').length.toString() : tasks.filter(task => task.status === 'TODAY').length.toString(),
            data: openSections['TODAY'] ? tasksFilter ? tasksFilter.filter(task => task.status === 'TODAY') : tasks.filter(task => task.status === 'TODAY') : [],
        },
        {
            title: 'Procrastinadas 😅',
            content: 'PENDING',
            lenght: tasksFilter ? tasksFilter.filter(task => task.status === 'PENDING').length.toString() : tasks.filter(task => task.status === 'PENDING').length.toString(),
            data: openSections['PENDING'] ? tasksFilter ? tasksFilter.filter(task => task.status === 'PENDING') : tasks.filter(task => task.status === 'PENDING') : [],
        },
        {
            title: 'Depois eu vejo 👀',
            content: 'FUTURE',
            lenght: tasksFilter ? tasksFilter.filter(task => task.status === 'FUTURE').length.toString() : tasks.filter(task => task.status === 'FUTURE').length.toString(),
            data: openSections['FUTURE'] ? tasksFilter ? tasksFilter.filter(task => task.status === 'FUTURE') : tasks.filter(task => task.status === 'FUTURE') : [],
        },
        {
            title: 'Missão cumprida 🎯',
            content: 'COMPLETED',
            lenght: tasksFilter ? tasksFilter.filter(task => task.status === 'COMPLETED').length.toString() : tasks.filter(task => task.status === 'COMPLETED').length.toString(),
            data: openSections['COMPLETED'] ? tasksFilter ? tasksFilter.filter(task => task.status === 'COMPLETED') : tasks.filter(task => task.status === 'COMPLETED') : [],
        },
    ];

    function formatDate(dateString: string): string {
        const [year, month, day] = dateString.split("T")[0].split("-");
        return `${day}/${month}/${year}`;
    }

    function handleTaskConclue(data: TaskProps) {
        const task = { ...data };

        handleUpdateTask(task)
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
                    status={item.status}
                    priority={item.priority}
                    category={item.category}
                    date={formatDate(item.date)}

                />
            )}
            renderSectionHeader={({ section: { title, content, lenght } }) => (
                <TextFilter text={title} number={lenght ? lenght : "0"} Open={() => toggleSection(content)} isOpen={openSections[content]} />
            )}
        />
    )
}