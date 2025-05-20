import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { useTask } from '@/hooks/useTask';
import { styles } from './styles';


export function ModalTaskName() {
    const { data, setData, modalState, setModalState, handleUpdateTask } = useTask();

    function handleUpdateName() {
        handleUpdateTask({ _id: modalState.data._id, name: data.taskName, task: modalState.data })
        setModalState({ name: null })
    }

    return (
        <Modal isVisible={modalState.name === 'isSelectTaskNameOpen'}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Editar titulo da tarefa</Text>
                <TextInput
                    style={styles.input}
                    multiline={true}
                    numberOfLines={3}
                    placeholder={modalState.data?.name || 'Título da tarefa'}
                    value={data.taskName}
                    onChangeText={text => setData(prevData => ({ ...prevData, taskName: text }))}
                />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => setModalState({ name: null })}>
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
