import React, { useEffect, useState } from "react"
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native"

import { styles } from "./styles"

import { Feather } from '@expo/vector-icons';

import { useTask } from "@/hooks/useTask";

import { useNavigation } from "@react-navigation/native";
import { Category } from "@/components/category";
import { FlatListTaks } from "@/components/flatListTasks";
import { theme } from "@/styles/theme";
import { Header } from "@/components/header";


export function PageTasks() {
    const [isFocused, setIsFocused] = useState(false);
    const { navigate } = useNavigation();
    const { tasksCategory, selectedCategory, category, taskConcluid, taskName, setSelectedCategory, fetchTaskByCategory, setTaskName } = useTask();

    function handleAddTask() {
        navigate("addTask");
    }

    function handleAddCategory() {
        navigate("addCategory");
    }

    function handleActivePriority(selectedPriority: string) {
        setSelectedCategory(selectedPriority);
    }

    useEffect(() => {
        fetchTaskByCategory(selectedCategory, undefined, taskName);
    }, [selectedCategory])

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Header />
                <View style={styles.form}>
                    <TextInput
                        style={[styles.input, isFocused && styles.inputFocused]}
                        placeholder='Pesquisar tarefa'
                        placeholderTextColor={theme.gray2}
                        onChangeText={(text) => {
                            setTaskName(text);
                            fetchTaskByCategory(selectedCategory, undefined, text)
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    {/* <TouchableOpacity style={styles.button} onPress={() => handleTaskSeek(taskName)}>
                        <Feather name="search" size={18} color={theme.white} />
                    </TouchableOpacity> */}
                </View>
                <View style={styles.category}>
                    <FlatList
                        data={category}
                        keyExtractor={(index) => index.toString()}
                        renderItem={({ item }) => (
                            <Category text={item} isFocus={selectedCategory === item} Focused={() => handleActivePriority(item)} />
                        )}
                        ListFooterComponent={
                            <TouchableOpacity style={styles.buttonCategory} onPress={handleAddCategory}>
                                <Feather name="plus" size={24} color={theme.white} />
                            </TouchableOpacity>
                        }
                        horizontal
                    />

                </View>
            </View>
            <View style={styles.containerList}>
                <View style={styles.list}>
                    <View style={styles.listContent}>
                        <Text style={styles.textCreate}>Criadas </Text>
                        <Text style={[styles.textCount, { backgroundColor: theme.blue1 }]}>{tasksCategory ? tasksCategory.length : 0}</Text></View>
                    <View style={styles.listContent}>
                        <Text style={styles.textConclude}>Concluídas</Text>
                        <Text style={[styles.textCount, { backgroundColor: theme.green1 }]}>{taskConcluid ? taskConcluid.length : 0}</Text>
                    </View>
                </View>

                <FlatListTaks />
            </View>
            <TouchableOpacity style={styles.buttonTask} onPress={handleAddTask}>
                <Feather name="plus" size={16} color={theme.white} />
            </TouchableOpacity>
        </View>
    )
}