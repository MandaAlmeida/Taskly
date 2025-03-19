import { FlatList, Image, Text, View } from "react-native"
import { Task } from "../task";
import { useTask } from "@/hooks/useTask";
import { useNavigation } from "@react-navigation/native";
import { TaskProps } from "@/@types/task";


export function FlatListTaks() {
    const { tasksCategory, handleTaskRemove, handleUpdateTask } = useTask();
    const { navigate } = useNavigation();

    function convertDateFormat(dateString: string): string {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0'); // Pega o dia e garante que tenha 2 dígitos
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Pega o mês e garante que tenha 2 dígitos (Lembre-se que o mês é 0-indexed)
        const year = date.getFullYear(); // Pega o ano

        return `${day}/${month}/${year}`;
    }

    function handleAddTask(item: TaskProps) {
        navigate("addTask", { dataTask: item });
    }

    return (
        <FlatList
            data={tasksCategory}
            keyExtractor={item => String(item._id!)} // Usando o operador de afirmação de não-null
            renderItem={({ item }) => (
                <Task
                    name={item.name}
                    onRemove={() => handleTaskRemove(item._id!, item.name)}
                    handleTaskConclue={() => handleUpdateTask({ ...item, active: !item.active })}
                    handleUpdate={() => handleAddTask(item)}
                    active={item.active}
                    priority={item.priority}
                    category={item.category}
                    date={convertDateFormat(item.date)}

                />
            )}
            showsVerticalScrollIndicator={false}
        />
    )
}