import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles';
import { useTask } from '@/hooks/useTask';
import { LucideIcon, icons } from 'lucide-react-native';

type Props = {
    isVisible: boolean;
    handleOnVisible: () => void;
};

type Category = {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
};

const categories: Category[] = [
    { id: '1', name: 'Grocery', icon: icons.UtensilsCrossed, color: '#00FF99' },
    { id: '2', name: 'Work', icon: icons.Briefcase, color: '#FF7754' },
    { id: '3', name: 'Sport', icon: icons.Dumbbell, color: '#00E0FF' },
    { id: '4', name: 'Design', icon: icons.Gamepad2, color: '#00EACF' },
    { id: '5', name: 'University', icon: icons.GraduationCap, color: '#A09DFF' },
    { id: '6', name: 'Social', icon: icons.Users, color: '#FF55BF' },
    { id: '7', name: 'Music', icon: icons.Music2, color: '#FF70E1' },
    { id: '8', name: 'Health', icon: icons.Heart, color: '#2EE59D' },
    { id: '9', name: 'Movie', icon: icons.Clapperboard, color: '#73B4FF' },
    { id: '10', name: 'Home', icon: icons.House, color: '#FFB573' },
    { id: '11', name: 'Create New', icon: icons.Plus, color: '#96FFE4' },
];

export function CategoryModal({ isVisible, handleOnVisible }: Props) {
    const { setSelectedCategory, selectedCategory } = useTask();

    function handleSelect(category: string) {
        setSelectedCategory(category);
        console.log(selectedCategory)
    }

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Sub-categorias</Text>
                <FlatList
                    data={categories}
                    numColumns={3}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.categoryBox, { backgroundColor: item.color }]}
                            onPress={() => handleSelect(item.name)}
                        >
                            <item.icon color="#FFF" size={24} />
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
