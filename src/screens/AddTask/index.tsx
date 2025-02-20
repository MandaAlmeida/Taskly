import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { styles } from "./styles";
import { Input } from "@/components/input";
import { Priority } from "@/components/priority";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TaskProps } from "@/@types/task";
import { useTask } from "@/hooks/useTask";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@/components/button";
import { theme } from "@/styles/theme";
import { SelectCategory } from "@/components/selectCategory";



export function AddTask() {
    const [selectedCategory, setSelectedCategory] = useState("Pessoal");
    const { navigate } = useNavigation();
    const { isDropdownOpen, setIsDropdownOpen, setTasks, handleAddTask } = useTask();
    const [text, setText] = useState("Alta");
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskProps>({})

    function handleBackToTask() {
        navigate("tasks")
    }


    function handleActivePriority(selectedPriority: string) {
        setText(selectedPriority);
    }

    function HandleAddTask(data: TaskProps) {
        const Task: TaskProps = {
            id: Date.now().toString(),
            name: data.name,
            priority: text,
            category: selectedCategory,
            active: false,
            date: new Date().toString(),

        }

        setTasks((prevTasks) => [...prevTasks, Task]);
        handleAddTask(Task);
        setSelectedCategory("Todas");
        handleBackToTask();
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Adicione uma nova tarefa</Text>
                <TouchableOpacity onPress={handleBackToTask}>
                    <Feather name="x" size={24} color={theme.gray2} />
                </TouchableOpacity>
            </View>

            <View style={{ gap: 20 }}>
                <Input formProps={{
                    name: "name",
                    control,
                    rules: {
                        required: "Nome é obrigatório"
                    }
                }}
                    inputProps={{
                        placeholder: "Nome",
                    }}
                    error={errors.name?.message} />

                <View style={{ position: "relative" }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <Text style={styles.text}>Categoria: {selectedCategory}</Text>
                    </TouchableOpacity>
                    {isDropdownOpen && (
                        <SelectCategory selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} isAddTask />
                    )}
                </View>
                <View style={styles.priority}>
                    <Text style={styles.text}>Prioridade</Text>
                    <Priority
                        text="Alta"
                        isFocus={text === "Alta"}
                        Focused={() => handleActivePriority("Alta")}
                    />
                    <Priority
                        text="Media"
                        isFocus={text === "Media"}
                        Focused={() => handleActivePriority("Media")}
                    />
                    <Priority
                        text="Baixa"
                        isFocus={text === "Baixa"}
                        Focused={() => handleActivePriority("Baixa")}
                    />
                </View>
            </View>

            <Button text="Adicionar tarefa" onPress={handleSubmit(HandleAddTask)} style={{ width: "100%" }} />
        </View>
    );
}
