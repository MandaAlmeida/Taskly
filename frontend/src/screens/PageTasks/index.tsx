import React, { useEffect, useState } from "react"
import { View } from "react-native"

import { styles } from "./styles"

import { useTask } from "@/hooks/useTask";

import { Header } from "@/components/header";
import { Search } from "@/components/search";
import { SectionTask } from "@/components/sectionTasks";
import { EmptyState } from "@/components/emptyState";



export function PageTasks() {
    const { fetchTask, fetchTaskBySearch, data, uiState } = useTask();
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchTask();
    }, []);


    const sections = [
        {
            title: 'Pra terminar hoje 🙌',
            content: 'TODAY',
            lenght: data.tasksSearch.length > 0 ? data.tasksSearch.filter(task => task.status === 'TODAY').length.toString() : data.tasks.filter(task => task.status === 'TODAY').length.toString(),
            data: uiState.openSections['TODAY'] ? data.tasksSearch.length > 0 ? data.tasksSearch.filter(task => task.status === 'TODAY') : data.tasks.filter(task => task.status === 'TODAY') : [],
        },
        {
            title: 'Procrastinadas 😅',
            content: 'PENDING',
            lenght: data.tasksSearch.length > 0 ? data.tasksSearch.filter(task => task.status === 'PENDING').length.toString() : data.tasks.filter(task => task.status === 'PENDING').length.toString(),
            data: uiState.openSections['PENDING'] ? data.tasksSearch.length > 0 ? data.tasksSearch.filter(task => task.status === 'PENDING') : data.tasks.filter(task => task.status === 'PENDING') : [],
        },
        {
            title: 'Depois eu vejo 👀',
            content: 'FUTURE',
            lenght: data.tasksSearch.length > 0 ? data.tasksSearch.filter(task => task.status === 'FUTURE').length.toString() : data.tasks.filter(task => task.status === 'FUTURE').length.toString(),
            data: uiState.openSections['FUTURE'] ? data.tasksSearch.length > 0 ? data.tasksSearch.filter(task => task.status === 'FUTURE') : data.tasks.filter(task => task.status === 'FUTURE') : [],
        },
        {
            title: 'Missão cumprida 🎯',
            content: 'COMPLETED',
            lenght: data.tasksSearch.length > 0 ? data.tasksSearch.filter(task => task.status === 'COMPLETED').length.toString() : data.tasks.filter(task => task.status === 'COMPLETED').length.toString(),
            data: uiState.openSections['COMPLETED'] ? data.tasksSearch.length > 0 ? data.tasksSearch.filter(task => task.status === 'COMPLETED') : data.tasks.filter(task => task.status === 'COMPLETED') : [],
        },
    ];


    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Header text="Tarefas" />
            </View>
            {data.tasks.length > 0 ? (
                <>
                    <Search fetchSearch={fetchTaskBySearch} placeholder="Pesquisar por tarefa ou subCategoria" setName={setSearch} name={search} />
                    <SectionTask sections={sections} />
                </>
            ) : (
                <EmptyState text="tarefas" title="O que você quer fazer hoje?" />
            )
            }
        </View >
    );
}