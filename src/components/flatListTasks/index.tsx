import { FlatList, Text, View } from "react-native"
import { Task } from "../task";
import { useTask } from "@/hooks/useTask";
import { Feather } from '@expo/vector-icons';
import { styles } from "./styles";

export function FlatListTaks() {
    const { tasksCategory, handleTaskRemove, handleTaskToggle } = useTask();

    return (
        <FlatList
            data={tasksCategory}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <Task
                    id={item.id}
                    key={item.id}
                    name={item.name}
                    onRemove={() => handleTaskRemove(item.name, item.category)}
                    handleTaskConclue={() => handleTaskToggle(item.id)}
                    active={item.active}
                    priority={item.priority}
                    category={item.category} />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
                <View style={styles.containerListEmpty}>
                    <View style={styles.afterElement} />
                    <Feather name="clipboard" size={56} color="#333333" />
                    <Text style={styles.textBoldListEmpty}>Você ainda não tem tarefas cadastradas</Text>
                    <Text style={styles.textListEmpty}>Crie tarefas e organize seus itens a fazer</Text>
                </View>
            )}
        />
    )
}