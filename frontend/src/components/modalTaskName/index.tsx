import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { useTask } from '@/hooks/useTask';
import { styles } from './styles';
import { Task } from '../task';
import { TaskProps } from '@/@types/task';

type Props = {
    isVisible: boolean;
    handleOnVisible: () => void;
    task: TaskProps
};

export function ModalTaskName({ isVisible, handleOnVisible, task }: Props) {
    const { data, setData, handleUpdateTask } = useTask();

    function handleUpdateName() {
        handleUpdateTask({ _id: task._id, name: data.taskName, task: task })
        handleOnVisible()
    }

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Editar titulo da tarefa</Text>
                <TextInput
                    style={styles.input}
                    multiline={true}
                    numberOfLines={3}
                    placeholder={task.name}
                    value={data.taskName}
                    onChangeText={text => setData(prevData => ({ ...prevData, taskName: text }))}
                />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => handleOnVisible()}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleUpdateName()} style={styles.confirmButton}>
                        <Text style={styles.confirmText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
