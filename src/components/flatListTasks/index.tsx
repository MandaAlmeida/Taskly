import { FlatList, Image, Text, View } from "react-native"
import { Task } from "../task";
import { useTask } from "@/hooks/useTask";
import Clipboard from "@/assets/Clipboard.png";
import { styles } from "./styles";


export function FlatListTaks() {
    const { tasksCategory, handleTaskRemove, handleTaskToggle } = useTask();

    return (

        <FlatList
            data={tasksCategory}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
                <Task
                    name={item.name}
                    onRemove={() => handleTaskRemove(item.id, item.name)}
                    handleTaskConclue={() => handleTaskToggle(item.id)}
                    active={item.active}
                    priority={item.priority}
                    category={item.category}
                    date={item.date}
                />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
                <View style={styles.containerListEmpty}>
                    <Image source={Clipboard} />
                    <Text style={styles.textBoldListEmpty}>Você ainda não tem tarefas cadastradas</Text>
                    <Text style={styles.textListEmpty}>Crie tarefas e organize seus itens a fazer</Text>
                </View>
            )}
        />

    )
}