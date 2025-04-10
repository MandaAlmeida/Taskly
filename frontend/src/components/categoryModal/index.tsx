import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles';
import { useTask } from '@/hooks/useTask';
import { LucideIcon, icons } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { useState } from 'react';

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
    { id: '1', name: 'Grocery', icon: icons.UtensilsCrossed, color: '#009459' },
    { id: '2', name: 'Work', icon: icons.Briefcase, color: '#ff3300' },
    { id: '3', name: 'Sport', icon: icons.Dumbbell, color: '#00e1ff' },
    { id: '4', name: 'Design', icon: icons.Gamepad2, color: '#00ffe1' },
    { id: '5', name: 'University', icon: icons.GraduationCap, color: '#0800ff' },
    { id: '6', name: 'Social', icon: icons.Users, color: '#ff009d' },
    { id: '7', name: 'Music', icon: icons.Music2, color: '#ff00c8' },
    { id: '8', name: 'Health', icon: icons.Heart, color: '#00ff99' },
    { id: '9', name: 'Movie', icon: icons.Clapperboard, color: '#0077ff' },
    { id: '10', name: 'Home', icon: icons.House, color: '#ff7700' },
    { id: '11', name: 'Create New', icon: icons.Plus, color: '#00ffbf' },
];

export function CategoryModal({ isVisible, handleOnVisible }: Props) {
    const { setSelectedCategory, selectedCategory } = useTask();
    const [active, setActive] = useState<{ [key: string]: boolean }>({});

    function handleSelect(category: string) {
        setSelectedCategory(category);
        console.log(selectedCategory)
    }

    function toggleSection(key: string) {
        setActive((prev) => ({
            [key]: !prev[key],
        }));
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
                            style={[styles.categoryBox, { backgroundColor: active[item.id] ? item.color : 'transparent', borderColor: active[item.id] ? 'transparent' : item.color }]}
                            onPress={() => (handleSelect(item.name), toggleSection(item.id))}
                        >
                            <item.icon color={active[item.id] ? theme.white : item.color} size={24} />
                            <Text style={[styles.categoryText, { color: active[item.id] ? theme.white : item.color }]}>{item.name}</Text>
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
