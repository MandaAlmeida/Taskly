import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';


import { Header } from "@/components/header";

import { theme } from "@/styles/theme";
import { Graph } from "@/components/Graph";
import { styles } from "./styles";
import { useTask } from "@/hooks/useTask";
import { SelectCategory } from "@/components/selectCategory";
import { useEffect } from "react";


export function Home() {
    const { selectedCategory, tasksCategory, taskConcluid, isDropdownOpen, pendingTasks, completedTasks, dateGraph, setIsDropdownOpen, setSelectedCategory, fetchTaskByCategory } = useTask();

    const tasksPendentes = tasksCategory.length - taskConcluid.length;

    useEffect(() => {
        fetchTaskByCategory(selectedCategory);
    }, [selectedCategory])

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <View style={styles.container}>
                <Text style={styles.text}>
                    Olá, <Text style={styles.name}>Amanda Almeida</Text>
                </Text>
                <View style={styles.section}>
                    <Text style={styles.text}>Visão geral de tarefas</Text>
                    <View style={{ position: "relative" }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <Text style={styles.textbutton}>{selectedCategory}</Text>
                            <MaterialIcons name="keyboard-arrow-down" size={24} color={theme.white} />
                        </TouchableOpacity>
                        {isDropdownOpen && (
                            <SelectCategory selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                        )}
                    </View>

                </View>
                <View style={styles.section}>
                    <View style={[styles.count, { backgroundColor: theme.blue1 }]}>
                        <Text style={styles.textbutton}>{tasksPendentes}</Text>
                        <Text style={styles.textbutton}>Tarefas pendentes</Text>
                    </View>
                    <View style={[styles.count, { backgroundColor: theme.green1 }]}>
                        <Text style={styles.textbutton}>{taskConcluid ? taskConcluid.length : 0}</Text>
                        <Text style={styles.textbutton}>Tarefas concluidas</Text>
                    </View>
                </View>
                <Graph
                    datasets={[
                        { data: pendingTasks, color: theme.blue1 },
                        { data: completedTasks, color: theme.green1 }
                    ]}
                    title="Progresso diária"
                    days={dateGraph}
                />
            </View>
        </View>
    )
}