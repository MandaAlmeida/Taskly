import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { styles } from "./styles";

import { useTask } from "@/hooks/useTask";

import { Header } from "@/components/header";
import { Search } from "@/components/search";
import { SectionTask } from "@/components/sectionTasks";
import { EmptyState } from "@/components/emptyState";

const SECTION_DEFINITIONS = [
    { title: "Pra terminar hoje 🙌", status: "TODAY" },
    { title: "Procrastinadas 😅", status: "PENDING" },
    { title: "Depois eu vejo 👀", status: "FUTURE" },
    { title: "Missão cumprida 🎯", status: "COMPLETED" },
];

export function PageTasks() {
    const { fetchTask, fetchTaskBySearch, data, uiState } = useTask();
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchTask();
    }, []);

    // Sempre que o search mudar, buscar novamente
    useEffect(() => {
        if (search.trim().length > 0) {
            fetchTaskBySearch(search);
        }
    }, [search]);

    // Quando limpar a busca, limpar os resultados também
    useEffect(() => {
        if (search.trim().length === 0 && data.tasksSearch.length > 0) {
            fetchTask(); // recarrega todas as tarefas
        }
    }, [search]);

    const currentTasks = search.trim().length > 0 ? data.tasksSearch : data.tasks;

    const sections = SECTION_DEFINITIONS.map(({ title, status }) => {
        const filteredTasks = currentTasks.filter((task) => task.status === status);
        const isOpen = uiState.openSections[status];

        return {
            title,
            content: status,
            length: filteredTasks.length.toString(),
            data: isOpen ? filteredTasks : [],
            shouldShow: filteredTasks.length > 0,
        };
    })
        .filter(section => section.shouldShow); // 👈 aqui ele remove se estiver vazio


    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Header text="Tarefas" />
            </View>

            {data.tasks ? (
                <>
                    <Search
                        fetchSearch={fetchTaskBySearch}
                        placeholder="Pesquisar por tarefa"
                        setName={setSearch}
                        name={search}
                    />
                    <SectionTask sections={sections} />
                </>
            ) : (
                <EmptyState text="tarefas" title="O que você quer fazer hoje?" />
            )}
        </View>
    );
}
