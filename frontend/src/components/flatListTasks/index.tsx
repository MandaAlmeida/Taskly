import { FlatList, Image, Text, View } from "react-native"
import { Task } from "../task";
import { useTask } from "@/hooks/useTask";
import { useNavigation } from "@react-navigation/native";
import { TaskProps } from "@/@types/task";

type Props = {
    data: TaskProps[]
}

export function FlatListTaks({ data }: Props) {
    const { handleTaskRemove, handleUpdateTask } = useTask();
    const { navigate } = useNavigation();

    function formatDate(dateString: string): string {
        const [year, month, day] = dateString.split("T")[0].split("-");
        return `${day}/${month}/${year}`;
    }

    function handleAddTask() {
        navigate("addTask");
    }

    return (
        <FlatList
            data={data}
            keyExtractor={item => String(item._id!)}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => (
                <Task
                    name={item.name}
                    onRemove={() => handleTaskRemove(item._id!, item.name)}
                    handleTaskConclue={() => handleUpdateTask({ ...item, active: !item.active })}
                    handleUpdate={() => handleAddTask()}
                    active={item.active}
                    priority={item.priority}
                    category={item.category}
                    date={formatDate(item.date)}

                />
            )}
            showsVerticalScrollIndicator={false}
        />
    )
}