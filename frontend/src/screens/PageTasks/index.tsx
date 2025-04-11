import React, { useEffect } from "react"
import { Text, View, Image } from "react-native"

import { styles } from "./styles"

import { useTask } from "@/hooks/useTask";


import ImageHome from "@/assets/Checklist-rafiki.png";
import { Header } from "@/components/header";
import { Search } from "@/components/search";
import { SectionTaks } from "@/components/sectionTasks";



export function PageTasks() {
    const {
        tasks,
        taskName,
        fetchTask,
    } = useTask();


    useEffect(() => {
        fetchTask(undefined, taskName);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Header text="Tarefas" />
            </View>
            {tasks.length > 0 ? (
                <>
                    <Search />
                    <SectionTaks />

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