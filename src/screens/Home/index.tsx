import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';


import { Header } from "@/components/header";

import { theme } from "@/styles/theme";
import { Graph } from "@/components/Graph";
import { styles } from "./styles";
import { useTask } from "@/hooks/useTask";
import { SelectCategory } from "@/components/selectCategory";
import { useState } from "react";


export function Home() {
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const { tasks, taskConcluid, isDropdownOpen, setIsDropdownOpen } = useTask();

    const data = [15, 50, 20, 10, 40, 30, 2]
    const data1 = [10, 30, 50, 25, 15, 5, 35]

    const tasksPendentes = tasks.length - taskConcluid.length;

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
                        { data: data, color: theme.blue1 },
                        { data: data1, color: theme.green1 }
                    ]}
                    title="Progresso diária"
                />
            </View>
        </View>
    )
}