import React, { useEffect, useState } from "react"
import { Text, TextInput, View, Image } from "react-native"

import { styles } from "./styles"


import { useTask } from "@/hooks/useTask";

import { useNavigation } from "@react-navigation/native";

import { FlatListTaks } from "@/components/flatListTasks";
import { theme } from "@/styles/theme";

import ImageHome from "@/assets/Checklist-rafiki.png";
import { Header } from "@/components/header";


export function PageTasks() {
    const [isFocused, setIsFocused] = useState(false);
    const { navigate } = useNavigation();
    const {
        tasksCategory,
        selectedCategory,
        taskConcluid,
        taskName,
        fetchTaskByCategory,
        setTaskName,
    } = useTask();


    useEffect(() => {
        fetchTaskByCategory(selectedCategory, undefined, taskName);
    }, [selectedCategory]);

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Header text="Tarefas" />
            </View>
            {tasksCategory.length > 0 ? (
                <>
                    <View style={styles.form}>
                        <TextInput
                            style={[styles.input, isFocused && styles.inputFocused]}
                            placeholder="Pesquisar tarefa"
                            placeholderTextColor={theme.gray2}
                            onChangeText={(text) => {
                                setTaskName(text);
                                fetchTaskByCategory(selectedCategory, undefined, text);
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    </View>
                    <View style={styles.containerList}>
                        <View style={styles.list}>
                            <View style={styles.listContent}>
                                <Text style={styles.textCreate}>Criadas </Text>
                                <Text style={[styles.textCount, { backgroundColor: theme.blue1 }]}>
                                    {tasksCategory.length > 0 ? tasksCategory.length : "0"}
                                </Text>
                            </View>
                            <View style={styles.listContent}>
                                <Text style={styles.textConclude}>Concluídas</Text>
                                <Text style={[styles.textCount, { backgroundColor: theme.green1 }]}>
                                    {taskConcluid ? taskConcluid.length : "0"}
                                </Text>
                            </View>
                        </View>

                        <FlatListTaks />
                    </View>
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Image source={ImageHome} style={styles.image} />
                    <Text style={styles.title}>O que você quer fazer hoje?</Text>
                    <Text>Toque em "+" para adicionar suas tarefas. </Text>
                </View>
            )
            }
        </View >
    );
}