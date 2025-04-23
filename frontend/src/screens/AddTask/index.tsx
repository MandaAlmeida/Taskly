import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { Feather } from '@expo/vector-icons';
import { styles } from "./styles";
import { useTask } from "@/hooks/useTask";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@/components/button";
import { theme } from "@/styles/theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "@/routes/app.routes";
import { CalendarModal } from "@/components/calendarModal";
import { SubCategoryModal } from "@/components/subCategoryModal";
import { PriorityModal } from "@/components/priorityModal";

type NavigationProps = StackNavigationProp<StackParamList>;

export function AddTask() {
    const [taskName, setTaskName] = useState("");
    const navigation = useNavigation<NavigationProps>();
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        calendar: false
    });

    const { handleAddTask, selectedSubCategory, selectedCategory, priority, date, setDate, setPriority, setSelectedSubCategory } = useTask();

    function toggleSection(key: string) {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }

    function handleBackToTask() {
        navigation.navigate('tabs', { screen: 'tasks' });
    };

    function handleSaveTask() {
        if (date.dateString === "", selectedSubCategory === undefined, priority === "") {
            return;
        }
        const task = {
            name: taskName,
            priority: priority,
            category: selectedCategory?._id,
            subCategory: selectedSubCategory?._id,
            date: date.dateString,
        };

        handleAddTask(task, handleBackToTask);
        setDate({
            year: 0,
            month: 0,
            day: 0,
            timestamp: 0,
            dateString: "",
        })
        setSelectedSubCategory(undefined)
        setPriority("")
        setTaskName("")
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Adicionar tarefa</Text>
                <TouchableOpacity onPress={handleBackToTask}>
                    <Feather name="x" size={30} color={theme.gray4} />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                <TextInput
                    style={styles.input}
                    multiline={true}
                    numberOfLines={3}
                    placeholder="Escreva uma nova tarefa..."
                    value={taskName}
                    onChangeText={setTaskName}
                />
            </View>
            <View style={styles.containerButton}>
                <TouchableOpacity style={styles.buttonSelect} onPress={() => toggleSection("calendar")}>
                    <Feather name="clock" size={24} color={theme.gray4} />
                    {date.dateString !== "" ? (
                        <Text>
                            {date.day <= 9 ? `0${date.day}` : date.day}/
                            {date.month <= 9 ? `0${date.month}` : date.month}/
                            {date.year}
                        </Text>
                    ) : null}

                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonSelect} onPress={() => toggleSection("category")}>
                    <Feather name="tag" size={24} color={theme.gray4} />
                    {selectedSubCategory !== undefined ? <Text>{selectedSubCategory?.subCategory}</Text> : ""}
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSelect} onPress={() => toggleSection("priority")}>
                    <Feather name="flag" size={24} color={theme.gray4} />
                    {priority ? <Text>{priority}</Text> : ""}
                </TouchableOpacity>
            </View>
            {openSections["calendar"] ?
                <CalendarModal isVisible={openSections["calendar"]} handleOnVisible={() => toggleSection("calendar")} />
                : ""}
            {openSections["category"] ?
                <SubCategoryModal isVisible={openSections["category"]} handleOnVisible={() => toggleSection("category")} />
                : ""}
            {openSections["priority"] ?
                <PriorityModal isVisible={openSections["priority"]} handleOnVisible={() => toggleSection("priority")} />
                : ""}
            <Button
                text={"Adicionar tarefa"}
                onPress={handleSaveTask}
                style={{ width: "100%" }}
            />
        </View>
    );
}
