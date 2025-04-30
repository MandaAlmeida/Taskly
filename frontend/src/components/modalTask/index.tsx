import { Check, Clock, Flag, GitBranch, PencilLine, Tag, Trash2, X } from "lucide-react-native";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { TaskProps } from "@/@types/task";
import React, { useState } from "react";
import { useTask } from "@/hooks/useTask";
import { ModalSubCategory } from "../modalSubCategory";
import { ModalPriority } from "../modalPriority";
import { ModalCalendar } from "../modalCalendar";
import { ModalCategory } from "../modalCategory";
import { ModalSubTask } from "../modalSubTask";
import { ModalTaskName } from "../modalTaskName";
import { formatDate } from "@/utils/formatDate";

type taskType = TaskProps & {
    color: string,
}

export function ModalTask(task: taskType) {
    const {
        isTaskOpen,
        setIsTaskOpen,
        handleTaskRemove,
        handleUpdateTask,
        handleSubTaskRemove,
        subCategory,
        category
    } = useTask();

    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

    function toggleSection(key: string) {
        setOpenSections((prev) => ({
            [key]: !prev[key],
        }));
    }

    return (
        <Modal visible={isTaskOpen} transparent>
            <View style={styles.container}>
                <X size={20} color={theme.gray4} onPress={() => setIsTaskOpen(false)} />
                <View style={styles.header}>
                    {task.status === "COMPLETED" ?
                        <Check size={24} color={task.color} /> :
                        <Tag size={24} color={task.color} />
                    }
                    <Text style={styles.textHeader}>{task.name}</Text>
                    <TouchableOpacity onPress={() => toggleSection("taskName")}><PencilLine size={24} color={task.color} /></TouchableOpacity>


                </View>
                <View style={styles.containerContent}>
                    <View style={styles.containerItem}>
                        <Clock size={20} color={task.color} />
                        <Text style={styles.title}>Data:</Text>
                        <TouchableOpacity onPress={() => toggleSection("calendar")}><Text style={styles.content}>{formatDate(task.date)}</Text></TouchableOpacity>
                    </View>
                    <View style={styles.containerItem}>
                        <Tag size={20} color={task.color} />
                        <Text style={styles.title}>Categoria:</Text>
                        <TouchableOpacity onPress={() => toggleSection("category")}><Text style={styles.content}>{category.find((category) => category._id === task.category)?.category || "Sem categoria"}</Text></TouchableOpacity>
                    </View>
                    <View style={styles.containerItem}>
                        <Tag size={20} color={task.color} />
                        <Text style={styles.title}>Sub-categoria:</Text>
                        <TouchableOpacity onPress={() => toggleSection("subCategory")}><Text style={styles.content}>{subCategory.find((subCategory) => subCategory._id === task.subCategory)?.subCategory || "Sem sub categoria"}</Text></TouchableOpacity>
                    </View>
                    <View style={styles.containerItem}>
                        <Flag size={20} color={task.color} />
                        <Text style={styles.title}>Prioridade:</Text>
                        <TouchableOpacity onPress={() => toggleSection("priority")}><Text style={styles.content}>{task.priority}</Text></TouchableOpacity>
                    </View>
                    <View style={styles.subTasks} >
                        <View style={styles.containerItem}>
                            <GitBranch size={20} color={task.color} />
                            <Text style={styles.title}>Sub-tarefas:</Text>
                            <TouchableOpacity onPress={() => toggleSection("subTask")}>
                                <Text style={styles.content}>Add Sub Tarefa</Text>
                            </TouchableOpacity>
                        </View>
                        {task.subTask && task.subTask.length > 0 ? (
                            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
                                {task.subTask.map((subTask, index) => (
                                    <View key={index} style={[styles.containerCheck, { borderColor: `${task.color}40` }]}>
                                        {subTask.status === "COMPLETED" ? (
                                            <>
                                                <TouchableOpacity
                                                    style={[styles.conclude, { backgroundColor: task.color }]}
                                                    onPress={() => {
                                                        const updatedSubTasks = task.subTask?.map((item) =>
                                                            item.task === subTask.task
                                                                ? { ...item, status: 'PENDING' as 'PENDING' }
                                                                : item
                                                        );

                                                        handleUpdateTask({
                                                            _id: task._id,
                                                            subTask: updatedSubTasks,
                                                            task: task
                                                        });
                                                    }}
                                                >
                                                    <Check size={12} color="#F2F2F2" />
                                                </TouchableOpacity>
                                                <Text style={styles.nameCheck}>{subTask.task}</Text>
                                            </>
                                        ) : (
                                            <>
                                                <TouchableOpacity
                                                    style={[styles.circle, { borderColor: task.color }]}
                                                    onPress={() => {
                                                        const updatedSubTasks = task.subTask?.map((item) =>
                                                            item.task === subTask.task
                                                                ? { ...item, status: "COMPLETED" as "COMPLETED" }
                                                                : item
                                                        );

                                                        handleUpdateTask({
                                                            _id: task._id,
                                                            subTask: updatedSubTasks,
                                                            task: task
                                                        });
                                                    }}
                                                />
                                                <Text style={styles.name}>{subTask.task}</Text>
                                            </>
                                        )}
                                        <TouchableOpacity onPress={() => handleSubTaskRemove(task._id, subTask.task, subTask?._id)}>
                                            <Trash2 color={theme.red} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>

                        ) : (
                            ""
                        )}
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => handleTaskRemove(task._id, task.name)} style={[styles.containerItem, styles.completTask, { borderColor: theme.red, borderWidth: 1 }]}>
                            <Trash2 size={20} color={theme.red} />
                            <Text style={styles.delete}>Deletar Tarefa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleUpdateTask({ _id: task._id, status: task.status, task: task })} style={[styles.completTask, { backgroundColor: task.color }]}>
                            <Text style={styles.text}>Tarefa concluida</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {openSections["taskName"] ?
                <ModalTaskName isVisible={openSections["taskName"]} handleOnVisible={() => toggleSection("taskName")} task={task} />
                : ""}
            {openSections["calendar"] ?
                <ModalCalendar isVisible={openSections["calendar"]} handleOnVisible={() => toggleSection("calendar")} task={task} />
                : ""}
            {openSections["category"] ?
                <ModalCategory isVisible={openSections["category"]} handleOnVisible={() => toggleSection("category")} task={task} />
                : ""}
            {openSections["subCategory"] ?
                <ModalSubCategory isVisible={openSections["subCategory"]} handleOnVisible={() => toggleSection("subCategory")} task={task} />
                : ""}
            {openSections["priority"] ?
                <ModalPriority isVisible={openSections["priority"]} handleOnVisible={() => toggleSection("priority")} task={task} />
                : ""}
            {openSections["subTask"] ?
                <ModalSubTask isVisible={openSections["subTask"]} handleOnVisible={() => toggleSection("subTask")} task={task} />
                : ""}
        </Modal>
    )
}