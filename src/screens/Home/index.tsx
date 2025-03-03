import { Text, TouchableOpacity, View } from "react-native";

import { Header } from "@/components/header";

import { Feather } from "@expo/vector-icons";

import { theme } from "@/styles/theme";
import { Graph } from "@/components/Graph";
import { styles } from "./styles";
import { useTask } from "@/hooks/useTask";
import { SelectCategory } from "@/components/selectCategory";
import { useEffect, useState } from "react";


export function Home() {
    const { selectedCategory, isDropdownOpen, pendingTasks, completedTasks, dateGraph, weekDaysGraph, user, setIsDropdownOpen, setSelectedCategory, fetchTaskByCategory } = useTask();
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

    const currentWeek = weekDaysGraph[selectedWeekIndex] || "Semana";


    const currentPendingTasks = pendingTasks[selectedWeekIndex] || [];
    const currentCompletedTasks = completedTasks[selectedWeekIndex] || [];

    const totalPendingTasks = currentPendingTasks.reduce((acc, currentValue) => acc + currentValue, 0);
    const totalCompletedTasks = currentCompletedTasks.reduce((acc, currentValue) => acc + currentValue, 0);

    useEffect(() => {
        fetchTaskByCategory(selectedCategory);
    }, [selectedCategory])


    return (
        <View style={{ flex: 1 }}>
            <Header />
            <View style={styles.container}>
                <Text style={styles.text}>
                    Olá, <Text style={styles.name}>{user ? user.name : "Bem-vindo"}</Text>
                </Text>
                <View style={styles.section}>
                    <Text style={styles.text}>Visão geral de tarefas</Text>
                    <View style={{ position: "relative" }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <Text style={styles.textbutton}>{selectedCategory}</Text>
                            <Feather size={24} color={theme.white} name={`chevron-down`} />
                        </TouchableOpacity>
                        {isDropdownOpen && (
                            <SelectCategory selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                        )}
                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                    <TouchableOpacity
                        onPress={() => setSelectedWeekIndex(prev => Math.max(0, prev - 1))}
                        disabled={selectedWeekIndex <= 0}>

                        <Feather
                            size={24}
                            color={selectedWeekIndex <= 0 ? theme.gray2 : theme.blue1}
                            name={`chevron-left`} />

                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
                        {currentWeek}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setSelectedWeekIndex(prev => Math.min(dateGraph.length - 1, prev + 1))}
                        disabled={selectedWeekIndex >= weekDaysGraph.length - 1}>

                        <Feather
                            size={24}
                            color={selectedWeekIndex >= weekDaysGraph.length - 1 ? theme.gray2 : theme.blue1}
                            name={`chevron-right`}
                        />

                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <View style={[styles.count, { backgroundColor: theme.blue1 }]}>
                        <Text style={styles.textbutton}>{totalPendingTasks}</Text>
                        <Text style={styles.textbutton}>Tarefas pendentes</Text>
                    </View>
                    <View style={[styles.count, { backgroundColor: theme.green1 }]}>
                        <Text style={styles.textbutton}>{totalCompletedTasks}</Text>
                        <Text style={styles.textbutton}>Tarefas concluidas</Text>
                    </View>
                </View>
                <View>
                    <Graph
                        datasets={[
                            { data: currentPendingTasks, color: theme.blue1 },
                            { data: currentCompletedTasks, color: theme.green1 }
                        ]}
                        title="Progresso semanal"
                        days={dateGraph}
                    />
                </View>
            </View>
        </View>
    )
}