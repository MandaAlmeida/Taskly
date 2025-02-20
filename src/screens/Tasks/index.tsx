import React, { useEffect, useState } from "react"
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native"

import { styles } from "./styles"

import { Feather, MaterialIcons } from '@expo/vector-icons';

import { useTask } from "@/hooks/useTask";
import DateTimePicker from "@react-native-community/datetimepicker"

import { useNavigation } from "@react-navigation/native";
import { Category } from "@/components/category";
import { FlatListTaks } from "@/components/flatListTasks";
import { theme } from "@/styles/theme";
import { Header } from "@/components/header";


export function Tasks() {
    const [isFocusedCategory, setIsFocusedCategory] = useState("Todas");
    const [isFocused, setIsFocused] = useState(false);
    const { navigate } = useNavigation();
    const { tasksCategory, category, taskConcluid, taskName, handleTaskSeek, setTaskName, fetchTaskByCategory } = useTask();
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false)


    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date);
    };


    const changeDate = (type: "day" | "month" | "year", value: number) => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate);
            if (type === "day") newDate.setDate(newDate.getDate() + value);
            if (type === "month") newDate.setMonth(newDate.getMonth() + value);
            if (type === "year") newDate.setFullYear(newDate.getFullYear() + value);
            return newDate;
        });
    };

    function handleAddTask() {
        navigate("addTask");
    }

    function handleAddCategory() {
        console.log("Ativado")
        navigate("addCategory");
    }

    function handleActivePriority(selectedPriority: string) {
        setIsFocusedCategory(selectedPriority);
    }

    const onChange = ({ type }: any, selectedDate: any) => {
        if (type == "set") {
            const currentDate = selectedDate;
            setDate(currentDate);
        } else {
            setShowPicker(!showPicker)
        }
    }

    useEffect(() => {
        fetchTaskByCategory(isFocusedCategory);
    }, [isFocusedCategory])

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Header />
                <View style={styles.form}>
                    <TextInput
                        style={[styles.input, isFocused && styles.inputFocused]}
                        placeholder='Pesquisar tarefa'
                        placeholderTextColor={theme.gray2}
                        onChangeText={setTaskName}
                        value={taskName}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleTaskSeek}>
                        <Feather name="search" size={18} color={theme.white} />
                    </TouchableOpacity>
                </View>
                <View style={styles.month}>
                    <TouchableOpacity onPress={() => changeDate("day", -1)}>
                        <MaterialIcons name="arrow-back-ios" size={24} color={theme.blue1} />
                    </TouchableOpacity>

                    <View>
                        <TouchableOpacity onPress={() => setShowPicker(!showPicker)}>
                            <Text style={styles.text}>{formatDate(date)}</Text>
                        </TouchableOpacity>
                        {showPicker && (
                            <DateTimePicker mode="date" display="spinner" value={date} onChange={onChange} />
                        )}
                    </View>

                    <TouchableOpacity onPress={() => changeDate("day", 1)}>
                        <MaterialIcons name="arrow-forward-ios" size={24} color={theme.blue1} />
                    </TouchableOpacity>
                </View>
                <View style={styles.category}>
                    <FlatList
                        data={category}
                        keyExtractor={(index) => index.toString()}
                        renderItem={({ item }) => (
                            <Category text={item} isFocus={isFocusedCategory === item} Focused={() => handleActivePriority(item)} />
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