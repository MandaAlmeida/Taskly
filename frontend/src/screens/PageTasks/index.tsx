import React, { useEffect } from "react"
import { View } from "react-native"

import { styles } from "./styles"

import { useTask } from "@/hooks/useTask";


import { Header } from "@/components/header";
import { Search } from "@/components/search";
import { SectionTaks } from "@/components/sectionTasks";
import { EmptyState } from "@/components/emptyState";
import { ModalTask } from "@/components/modalTask";



export function PageTasks() {
    const { tasks, fetchTask, subCategory, category, taskById, formatDate, tasksSearch, openSections } = useTask();

    useEffect(() => {
        fetchTask();
    }, []);


    const sections = [
        {
            title: 'Pra terminar hoje 🙌',
            content: 'TODAY',
            lenght: tasksSearch.length > 0 ? tasksSearch.filter(task => task.status === 'TODAY').length.toString() : tasks.filter(task => task.status === 'TODAY').length.toString(),
            data: openSections['TODAY'] ? tasksSearch.length > 0 ? tasksSearch.filter(task => task.status === 'TODAY') : tasks.filter(task => task.status === 'TODAY') : [],
        },
        {
            title: 'Procrastinadas 😅',
            content: 'PENDING',
            lenght: tasksSearch.length > 0 ? tasksSearch.filter(task => task.status === 'PENDING').length.toString() : tasks.filter(task => task.status === 'PENDING').length.toString(),
            data: openSections['PENDING'] ? tasksSearch.length > 0 ? tasksSearch.filter(task => task.status === 'PENDING') : tasks.filter(task => task.status === 'PENDING') : [],
        },
        {
            title: 'Depois eu vejo 👀',
            content: 'FUTURE',
            lenght: tasksSearch.length > 0 ? tasksSearch.filter(task => task.status === 'FUTURE').length.toString() : tasks.filter(task => task.status === 'FUTURE').length.toString(),
            data: openSections['FUTURE'] ? tasksSearch.length > 0 ? tasksSearch.filter(task => task.status === 'FUTURE') : tasks.filter(task => task.status === 'FUTURE') : [],
        },
        {
            title: 'Missão cumprida 🎯',
            content: 'COMPLETED',
            lenght: tasksSearch.length > 0 ? tasksSearch.filter(task => task.status === 'COMPLETED').length.toString() : tasks.filter(task => task.status === 'COMPLETED').length.toString(),
            data: openSections['COMPLETED'] ? tasksSearch.length > 0 ? tasksSearch.filter(task => task.status === 'COMPLETED') : tasks.filter(task => task.status === 'COMPLETED') : [],
        },
    ];


    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Header text="Tarefas" />
            </View>
            {tasks.length > 0 ? (
                <>
                    <Search />
                    <SectionTaks sections={sections} />
                    {taskById && <ModalTask
                        _id={taskById?._id}
                        name={taskById?.name}
                        category={category.find((category) => category._id === taskById.category)?.category || "Sem categoria"}
                        subCategory={subCategory.find((subCategory) => subCategory._id === taskById.subCategory)?.subCategory || "Sem sub categoria"}
                        priority={taskById?.priority}
                        date={formatDate(taskById?.date)}
                        status={taskById?.status}
                        userId={taskById?.userId}
                    />}

                </>
            ) : (
                <EmptyState />
            )
            }
        </View >
    );
}