import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { useTask } from '@/hooks/useTask';
import { styles } from './styles';
import { CreateSubTaskProps, TaskProps } from '@/@types/task';
import { useState } from 'react';
import { Plus } from 'lucide-react-native';
import { theme } from '@/styles/theme';

type Props = {
    isVisible: boolean;
    handleOnVisible: () => void;
    subTasks?: CreateSubTaskProps[];
    task?: TaskProps
};

export function ModalSubTask({ isVisible, handleOnVisible, subTasks = [], task }: Props) {
    const [localSubTasks, setLocalSubTasks] = useState(subTasks);
    const { handleUpdateTask } = useTask()

    function handleSubTaskChange(text: string, index: number) {
        const updatedSubTasks = [...localSubTasks];
        updatedSubTasks[index] = {
            ...updatedSubTasks[index],
            task: text,
            status: "PENDING",
        };
        setLocalSubTasks(updatedSubTasks);
    };

    const hasEmptyTask = localSubTasks.some(sub => sub.task.trim() === '');

    function addNewSubTask() {
        setLocalSubTasks([...localSubTasks, { task: '', status: 'PENDING' }]);
    };

    function CreateEditSubTask() {
        if (task) {
            handleUpdateTask({ _id: task._id, subTask: localSubTasks, task: task })
        }
        handleOnVisible();
    }

    console.log(localSubTasks)
    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Editar e adicionar sub tarefas</Text>

                <FlatList
                    data={localSubTasks}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.containerItem}>
                            <View style={styles.circle} />
                            <TextInput
                                style={styles.input}
                                multiline
                                numberOfLines={3}
                                placeholder="Digite a subtarefa..."
                                value={item.task}
                                onChangeText={(text) => handleSubTaskChange(text, index)}
                            />
                        </View>
                    )}
                />

                {!hasEmptyTask && (
                    <TouchableOpacity onPress={addNewSubTask} style={styles.addButton}>
                        <Plus color={theme.blue1} size={20} />
                        <Text style={styles.addButtonText}>Nova sub-tarefa</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={handleOnVisible}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        CreateEditSubTask()
                    }} style={styles.confirmButton}>
                        <Text style={styles.confirmText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
