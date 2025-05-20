import { Calendar, Check, Clock, Flag, GitBranch, PencilLine, Tag, Trash2, X } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { useTask } from "@/hooks/useTask";
import { formatDate } from "@/utils/formatDate";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackParamList } from "@/routes/app.routes";
import { ModalCalendar } from "@/components/modalCalendar";
import { ModalHours } from "@/components/modalHours";
import { ModalCategory } from "@/components/modalCategory";
import { ModalSubCategory } from "@/components/modalSubCategory";
import { ModalPriority } from "@/components/modalPriority";
import { ModalSubTask } from "@/components/modalSubTask";
import { ModalTaskName } from "@/components/modalTaskName";

export function Task() {
    const {
        setModalState,
        handleTaskRemove,
        handleUpdateTask,
        handleSubTaskRemove,
        data
    } = useTask();

    const task = data.taskById;
    const navigation = useNavigation();

    function handleTask() {
        navigation.goBack();
    }
    if (!task) return null;

    const color = data.categories.find((category) => category._id === task.category)?.color || theme.blue1

    return (
        <View style={styles.container}>
            <X size={20} color={theme.gray4} onPress={() => handleTask()} />
            <View style={styles.header}>
                {task.status === "COMPLETED" ? (
                    <Check size={24} color={color} />
                ) : (
                    <Tag size={24} color={color} />
                )}
                <Text style={styles.textHeader}>{task.name}</Text>
                <TouchableOpacity onPress={() => setModalState({ name: "isSelectTaskNameOpen", data: task })}>
                    <PencilLine size={24} color={color} />
                </TouchableOpacity>
            </View>

            <View style={styles.containerContent}>
                <View style={styles.containerItem}>
                    <Calendar size={20} color={color} />
                    <Text style={styles.title}>Data:</Text>
                    <TouchableOpacity onPress={() => setModalState({ name: "isSelectDateOpen", data: task })}>
                        <Text style={styles.content}>{formatDate(task.date)}</Text>
                    </TouchableOpacity>
                </View>

                {task.hours && (
                    <View style={styles.containerItem}>
                        <Clock size={20} color={color} />
                        <Text style={styles.title}>Hora:</Text>
                        <TouchableOpacity onPress={() => setModalState({ name: "isSelectHoursOpen", data: task })}>
                            <Text style={styles.content}>{task.hours}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.containerItem}>
                    <Tag size={20} color={color} />
                    <Text style={styles.title}>Categoria:</Text>
                    <TouchableOpacity onPress={() => setModalState({ name: "isSelectCategoryOpen", data: task })}>
                        <Text style={styles.content}>
                            {data.categories.find((category) => category._id === task.category)?.category || "Sem categoria"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.containerItem}>
                    <Tag size={20} color={color} />
                    <Text style={styles.title}>Sub-categoria:</Text>
                    <TouchableOpacity onPress={() => setModalState({ name: "isSelectSubCategoryOpen", data: task })}>
                        <Text style={styles.content}>
                            {data.subCategory.find((subCategory) => subCategory._id === task.subCategory)?.subCategory || "Sem sub categoria"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.containerItem}>
                    <Flag size={20} color={color} />
                    <Text style={styles.title}>Prioridade:</Text>
                    <TouchableOpacity onPress={() => setModalState({ name: "isSelectPriorityOpen", data: task })}>
                        <Text style={styles.content}>{task.priority}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.subTasks}>
                    <View style={styles.containerItem}>
                        <GitBranch size={20} color={color} />
                        <Text style={styles.title}>Sub-tarefas:</Text>
                        <TouchableOpacity onPress={() => setModalState({ name: "isSelectSubTaskOpen", data: task })}>
                            <Text style={styles.content}>Add Sub Tarefa</Text>
                        </TouchableOpacity>
                    </View>

                    {task.subTask && task.subTask?.length > 0 && (
                        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
                            {task.subTask.map((subTask, index) => (
                                <View key={index} style={[styles.containerCheck, { borderColor: `${color}40` }]}>
                                    {subTask.status === "COMPLETED" ? (
                                        <>
                                            <TouchableOpacity
                                                style={[styles.conclude, { backgroundColor: color }]}
                                                onPress={() => {
                                                    const updatedSubTasks = task.subTask?.map((item) =>
                                                        item.task === subTask.task ? { ...item, status: 'PENDING' } : item
                                                    );
                                                    handleUpdateTask({ _id: task._id, subTask: updatedSubTasks, task });
                                                }}
                                            >
                                                <Check size={12} color="#F2F2F2" />
                                            </TouchableOpacity>
                                            <Text style={styles.nameCheck}>{subTask.task}</Text>
                                        </>
                                    ) : (
                                        <>
                                            <TouchableOpacity
                                                style={[styles.circle, { borderColor: color }]}
                                                onPress={() => {
                                                    const updatedSubTasks = task.subTask?.map((item) =>
                                                        item.task === subTask.task ? { ...item, status: 'COMPLETED' } : item
                                                    );
                                                    handleUpdateTask({ _id: task._id, subTask: updatedSubTasks, task });
                                                }}
                                            />
                                            <Text style={styles.name}>{subTask.task}</Text>
                                        </>
                                    )}
                                    <TouchableOpacity onPress={() => handleSubTaskRemove(task._id, subTask.task, subTask._id)}>
                                        <Trash2 color={theme.red} size={20} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        onPress={() => handleTaskRemove(task._id, task.name, handleTask)}
                        style={[styles.containerItem, styles.completTask, { borderColor: theme.red, borderWidth: 1 }]}
                    >
                        <Trash2 size={20} color={theme.red} />
                        <Text style={styles.delete}>Deletar Tarefa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleUpdateTask({ _id: task._id, status: task.status, task })}
                        style={[styles.completTask, { backgroundColor: color }]}
                    >
                        <Text style={styles.text}>Tarefa concluída</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modais */}
            <ModalTaskName />
            <ModalCalendar />
            <ModalHours />
            <ModalCategory />
            <ModalSubCategory />
            <ModalPriority />
            <ModalSubTask />
        </View>
    );
}
