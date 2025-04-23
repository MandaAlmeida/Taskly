import { Check, Clock, Flag, GitBranch, PencilLine, Tag, Trash, X } from "lucide-react-native";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { TaskProps } from "@/@types/task";
import React from "react";
import { useTask } from "@/hooks/useTask";

export function ModalTask(task: TaskProps) {
    const {
        isTaskOpen,
        setIsTaskOpen,
        handleTaskRemove,
        handleUpdateTask
    } = useTask();

    return (
        <Modal visible={isTaskOpen} transparent>
            <View style={styles.container}>
                <View style={styles.header}>
                    <X size={24} color={theme.gray4} onPress={() => setIsTaskOpen(false)} />
                    <Text style={styles.textHeader}>{task.name}</Text>
                    <PencilLine size={24} color={theme.gray4} />
                </View>
                <View style={styles.containerContent}>
                    <View style={styles.containerItem}>
                        <Clock size={20} color={theme.gray4} />
                        <Text style={styles.title}>Data:</Text>
                        <Text style={styles.content}>{task.date}</Text>
                    </View>
                    <View style={styles.containerItem}>
                        <Tag size={20} color={theme.gray4} />
                        <Text style={styles.title}>Categoria:</Text>
                        <Text style={styles.content}>{task.category}</Text>
                    </View>
                    <View style={styles.containerItem}>
                        <Tag size={20} color={theme.gray4} />
                        <Text style={styles.title}>Sub-categoria:</Text>
                        <Text style={styles.content}>{task.subCategory}</Text>
                    </View>
                    <View style={styles.containerItem}>
                        <Flag size={20} color={theme.gray4} />
                        <Text style={styles.title}>Prioridade:</Text>
                        <Text style={styles.content}>{task.priority}</Text>
                    </View>
                    <View style={styles.subTasks}>
                        <GitBranch size={20} color={theme.gray4} />
                        <Text style={styles.title}>Sub-tarefas:</Text>
                        <View>

                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => handleTaskRemove(task._id, task.name)} style={styles.containerItem}>
                    <Trash size={20} color={theme.red} />
                    <Text style={styles.delete}>Deletar Tarefa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleUpdateTask(task)} style={styles.editTask}>
                    <Text style={styles.text}>Salvar Tarefa</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}