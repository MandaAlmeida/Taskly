import React, { useEffect, useState } from "react"
import { Text, View, Image, ScrollView } from "react-native"

import { styles } from "./styles"

import { useTask } from "@/hooks/useTask";

import { FlatListTaks } from "@/components/flatListTasks";

import ImageHome from "@/assets/Checklist-rafiki.png";
import { Header } from "@/components/header";
import { Search } from "@/components/search";
import { TextFilter } from "@/components/textFilter";


export function PageTasks() {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        today: true,
        pending: false,
        futurePending: false,
        completed: false,
    });

    function toggleSection(key: string) {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }

    const {
        tasksToday,
        tasksPendent,
        tasksFuture,
        tasksConcluid,
        taskName,
        fetchTaskByCategory,
    } = useTask();


    useEffect(() => {
        fetchTaskByCategory(undefined, taskName);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Header text="Tarefas" />
            </View>
            {tasksToday.length > 0 || tasksPendent.length > 0 || tasksFuture.length > 0 || tasksConcluid.length > 0 ? (
                <>
                    <Search />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.containerList}>
                            <TextFilter text="Pra terminar hoje 🙌" number={tasksToday.length > 0 ? tasksToday.length : "0"} Open={() => toggleSection("today")} isOpen={openSections["today"]} />
                            {openSections["today"] ? <FlatListTaks data={tasksToday} /> : ""}
                        </View>
                        <View style={styles.containerList}>
                            <TextFilter text="Procrastinadas 😅" number={tasksPendent.length > 0 ? tasksPendent.length : "0"} Open={() => toggleSection("pending")} isOpen={openSections["pending"]} />
                            {openSections["pending"] ? <FlatListTaks data={tasksPendent} /> : ""}
                        </View>
                        <View style={styles.containerList}>
                            <TextFilter text="Depois eu vejo 👀" number={tasksFuture.length > 0 ? tasksFuture.length : "0"} Open={() => toggleSection("futurePending")} isOpen={openSections["futurePending"]} />
                            {openSections["futurePending"] ? <FlatListTaks data={tasksFuture} /> : ""}
                        </View>
                        <View style={styles.containerList}>
                            <TextFilter text="Missão cumprida 🎯" number={tasksConcluid.length > 0 ? tasksConcluid.length : "0"} Open={() => toggleSection("completed")} isOpen={openSections["completed"]} />
                            {openSections["completed"] ? <FlatListTaks data={tasksConcluid} /> : ""}
                        </View>
                    </ScrollView>
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Image source={ImageHome} style={styles.image} />
                    <Text style={styles.title}>O que você quer fazer hoje?</Text>
                    <Text>Toque em "+" para adicionar suas tarefas.</Text>
                </View>
            )
            }
        </View >
    );
}