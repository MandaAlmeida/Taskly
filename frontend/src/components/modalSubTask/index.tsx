import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { useTask } from '@/hooks/useTask';
import { styles } from './styles';
import { CreateSubTaskProps, TaskProps } from '@/@types/task';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { ButtonModal } from '../buttonModal';

export function ModalSubTask() {
    const { handleUpdateTask, modalState, setModalState } = useTask();

    const [localSubTasks, setLocalSubTasks] = useState<CreateSubTaskProps[]>([]);

    useEffect(() => {
        if (modalState.name === 'isSelectSubTaskOpen' && modalState.data?.subTask) {
            setLocalSubTasks(modalState.data.subTask);
        }
    }, [modalState]);

    function handleSubTaskChange(text: string, index: number) {
        const updatedSubTasks = [...localSubTasks];
        updatedSubTasks[index] = {
            ...updatedSubTasks[index],
            task: text,
            status: "PENDING",
        };
        setLocalSubTasks(updatedSubTasks);
    }

    const hasEmptyTask = localSubTasks.some(sub => sub.task.trim() === '');

    function addNewSubTask() {
        setLocalSubTasks([...localSubTasks, { task: '', status: 'PENDING' }]);
    }

    function CreateEditSubTask() {
        if (modalState.data) {
            handleUpdateTask({
                _id: modalState.data._id,
                subTask: localSubTasks,
                task: modalState.data
            });
        }
        setModalState({ name: null });
    }

    return (
        <Modal isVisible={modalState.name === 'isSelectSubTaskOpen'}>
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

                <ButtonModal
                    color={modalState.data?.color || theme.blue1}
                    CreateItem={CreateEditSubTask}
                    handleOnVisible={() => setModalState({ name: null })}
                />
            </View>
        </Modal>
    );
}