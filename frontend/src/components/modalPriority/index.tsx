import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles';
import { useTask } from '@/hooks/useTask';
import { Flag } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { useState } from 'react';
import { ButtonModal } from '../buttonModal';
import { ModalProps } from '../modalSubTask';

type Priority = {
    id: string;
    name: string;
};

const priorities: Priority[] = [
    { id: '1', name: '1' },
    { id: '2', name: '2' },
    { id: '3', name: '3' },
    { id: '4', name: '4' },
    { id: '5', name: '5' },
    { id: '6', name: '6' },
    { id: '7', name: '7' },
    { id: '8', name: '8' },
    { id: '9', name: '9' },
    { id: '10', name: '10' },
];


export function ModalPriority({ isVisible, handleOnVisible, task }: ModalProps) {
    const [active, setActive] = useState<{ [key: string]: boolean }>({})
    const { handleUpdateTask, data, setData } = useTask();

    function UpdateSetPriority(key: string, priority: string) {
        setActive((prev) => ({
            [key]: !prev[key],
        }));
        setData(prevData => ({ ...prevData, priority: priority }));

    }


    function UpdatePriority() {
        if (task) {
            handleUpdateTask({ _id: task._id, priority: data.priority, task: task })
        }
        handleOnVisible();
    }

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Nivel de prioridade</Text>
                <FlatList
                    data={priorities}
                    numColumns={4}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.categoryBox, { backgroundColor: active[item.id] ? theme.blue1 : "#D7D7D7" }]}
                            onPress={() => (UpdateSetPriority(item.id, item.name))}
                        >
                            <Flag color={active[item.id] ? "#D7D7D7" : theme.gray3} size={24} />
                            <Text style={[styles.categoryText, { color: active[item.id] ? "#D7D7D7" : theme.gray3 }]}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.grid}
                />
                <ButtonModal color={task?.color || theme.blue1} CreateItem={() => UpdatePriority()} handleOnVisible={() => handleOnVisible()} />
            </View>
        </Modal>
    );
}
