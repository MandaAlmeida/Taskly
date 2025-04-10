import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles';
import { useTask } from '@/hooks/useTask';
import { Flag } from 'lucide-react-native';
import { theme } from '@/styles/theme';

type Props = {
    isVisible: boolean;
    handleOnVisible: () => void;
};

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


export function PriorityModal({ isVisible, handleOnVisible }: Props) {
    const { setPriority } = useTask();

    function handleSelect(priority: string) {
        setPriority(priority);
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
                            style={[styles.categoryBox, { backgroundColor: "#D7D7D7" }]}
                            onPress={() => handleSelect(item.name)}
                        >
                            <Flag color={theme.gray4} size={24} />
                            <Text style={styles.categoryText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.grid}
                />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => handleOnVisible()}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleOnVisible()} style={styles.confirmButton}>
                        <Text style={styles.confirmText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
