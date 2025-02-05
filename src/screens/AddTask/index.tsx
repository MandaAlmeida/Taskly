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



export function AddTask() {
    const { navigate } = useNavigation();
    const { setTasks } = useTask();
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
            category: data.category,
            active: false,
            date: new Date().toString(),

        }

        setTasks((prevTasks) => [...prevTasks, Task])
        handleBackToTask()
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Adicione uma nova tarefa</Text>
                <TouchableOpacity onPress={handleBackToTask}>
                    <Feather name="x" size={24} color="#F4F4F4" />
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

                <Input formProps={{
                    name: "category",
                    control,
                    rules: {
                        required: "Categoria é obrigatória"
                    }
                }}
                    inputProps={{
                        placeholder: "Categoria",
                    }}
                    error={errors.category?.message} />

                <View style={styles.priority}>
                    <Text style={styles.title}>Prioridade</Text>
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

            <TouchableOpacity style={styles.button} onPress={handleSubmit(HandleAddTask)}>
                <Text style={styles.text}>Adicionar tarefa</Text>
            </TouchableOpacity>
        </View>
    );
}
