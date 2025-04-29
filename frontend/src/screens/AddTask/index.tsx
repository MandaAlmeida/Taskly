import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList } from "react-native";
import { Feather } from '@expo/vector-icons';
import { styles } from "./styles";
import { useTask } from "@/hooks/useTask";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@/components/button";
import { theme } from "@/styles/theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "@/routes/app.routes";
import { ModalCalendar } from "@/components/modalCalendar";
import { ModalSubCategory } from "@/components/modalSubCategory";
import { ModalPriority } from "@/components/modalPriority";
import { ModalCategory } from "@/components/modalCategory";
import { CreateSubTaskProps } from "@/@types/task";
import { Keyboard } from "react-native";
import { Plus } from "lucide-react-native";

type NavigationProps = StackNavigationProp<StackParamList>;

export function AddTask() {
    const [taskName, setTaskName] = useState("");
    const navigation = useNavigation<NavigationProps>();
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

    const { handleAddTask, selectedSubCategory, selectedCategory, priority, date, setDate, setPriority, setSelectedSubCategory, setSelectedCategory, setIsCreateCategoryOpen } = useTask();
    const [showSubTasks, setShowSubTasks] = useState(false);
    const [localSubTasks, setLocalSubTasks] = useState<CreateSubTaskProps[]>([]);

    const hasEmptyTask = localSubTasks.some(sub => sub.task.trim() === '');

    function handleSubTaskChange(text: string, index: number) {
        const updatedSubTasks = [...localSubTasks];
        updatedSubTasks[index] = {
            ...updatedSubTasks[index],
            task: text,
            status: "PENDING",
        };
        setLocalSubTasks(updatedSubTasks);
    };

    function addNewSubTask() {
        setLocalSubTasks([...localSubTasks, { task: '', status: 'PENDING' }]);
        focusOnNewInput(localSubTasks.length);
    };

    function toggleSection(key: string) {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }

    function handleBackToTask() {
        navigation.navigate('tabs', { screen: 'tasks' })
        setDate({
            year: 0,
            month: 0,
            day: 0,
            timestamp: 0,
            dateString: "",
        })
        setSelectedSubCategory(undefined)
        setPriority("")
        setSelectedCategory(undefined);
    };


    const inputRefs = useRef<TextInput[]>([]); // Aqui armazenamos as refs

    const focusOnNewInput = (index: number) => {
        setTimeout(() => {
            inputRefs.current[index]?.focus(); // Foca no input novo
        }, 100); // Pequeno delay para garantir que o input existe
    };

    function handleSaveTask() {
        if (date.dateString === "", selectedSubCategory === undefined, priority === "") {
            return;
        }
        const task = {
            name: taskName,
            priority,
            category: selectedCategory?._id,
            subCategory: selectedSubCategory?._id,
            date: date.dateString,
            subTask: localSubTasks,
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
        setSelectedCategory(undefined)
    }

    useEffect(() => {
        const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
            if (taskName.trim() !== "") {
                setShowSubTasks(true);
            }
        });

        return () => keyboardHideListener.remove();
    }, [taskName]);


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
                    multiline
                    numberOfLines={2}
                    placeholder="Escreva uma nova tarefa..."
                    value={taskName}
                    onChangeText={(text) => {
                        if (text.includes('\n')) {
                            setTaskName(text.replace('\n', '')); // remove o Enter
                            if (!showSubTasks) {
                                setShowSubTasks(true); // Mostra subtarefas
                            }
                            if (localSubTasks.length === 0) {
                                addNewSubTask(); // Se não existe nenhuma subtarefa, cria
                            }
                        } else {
                            setTaskName(text);
                        }
                    }}
                />

                {showSubTasks && (
                    <FlatList
                        data={localSubTasks}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.containerItem}>
                                <View style={styles.circle} />
                                <TextInput
                                    ref={(ref) => {
                                        if (ref) inputRefs.current[index] = ref;
                                    }}
                                    style={styles.input}
                                    multiline
                                    numberOfLines={3}
                                    placeholder="Digite a subtarefa..."
                                    value={item.task}
                                    onChangeText={(text) => {
                                        if (text.includes('\n')) {
                                            handleSubTaskChange(text.replace('\n', ''), index);
                                            addNewSubTask();
                                        } else {
                                            handleSubTaskChange(text, index);
                                        }
                                    }}
                                />
                            </View>
                        )} ListFooterComponent={
                            !hasEmptyTask ? (
                                <TouchableOpacity onPress={addNewSubTask} style={styles.addButton}>
                                    <Plus color={theme.blue1} size={20} />
                                    <Text style={styles.addButtonText}>Nova sub-tarefa</Text>
                                </TouchableOpacity>
                            ) : null
                        }
                    />
                )}
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

                <TouchableOpacity style={styles.buttonSelect} onPress={() => [toggleSection("category"),
                setIsCreateCategoryOpen(false)
                ]}>
                    <Feather name="tag" size={24} color={theme.gray4} />
                    {selectedCategory !== undefined ? <Text>{selectedCategory?.category}</Text> : ""}
                </TouchableOpacity>
                {selectedCategory &&
                    <TouchableOpacity style={styles.buttonSelect} onPress={() => [toggleSection("subCategory"),
                    setIsCreateCategoryOpen(false)
                    ]}>
                        <Feather name="tag" size={24} color={theme.gray4} />
                        {selectedSubCategory !== undefined ? <Text>{selectedSubCategory?.subCategory}</Text> : ""}
                    </TouchableOpacity>
                }

                <TouchableOpacity style={styles.buttonSelect} onPress={() => toggleSection("priority")}>
                    <Feather name="flag" size={24} color={theme.gray4} />
                    {priority ? <Text>{priority}</Text> : ""}
                </TouchableOpacity>
            </View>
            {openSections["calendar"] ?
                <ModalCalendar isVisible={openSections["calendar"]} handleOnVisible={() => toggleSection("calendar")} />
                : ""}
            {openSections["category"] ?
                <ModalCategory isVisible={openSections["category"]} handleOnVisible={() => toggleSection("category")} />
                : ""}
            {openSections["subCategory"] ?
                <ModalSubCategory isVisible={openSections["subCategory"]} handleOnVisible={() => toggleSection("subCategory")} />
                : ""}
            {openSections["priority"] ?
                <ModalPriority isVisible={openSections["priority"]} handleOnVisible={() => toggleSection("priority")} />
                : ""}
            <Button
                text={"Adicionar tarefa"}
                onPress={handleSaveTask}
                style={{ width: "100%" }}
            />
        </View>
    );
}
