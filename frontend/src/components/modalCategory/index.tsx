import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { useTask } from '@/hooks/useTask';
import { theme } from '@/styles/theme';
import { useState } from 'react';
import * as LucideIcons from 'lucide-react-native';
import { iconsList } from "@/Array/icons";
import { styles } from './styles';
import { CategoryProps } from '@/@types/category';
import { TaskProps } from '@/@types/task';

type Props = {
    isVisible: boolean;
    handleOnVisible: () => void;
    task?: TaskProps
};

export function ModalCategory({ isVisible, handleOnVisible, task }: Props) {
    const { setSelectedCategory, selectedCategory, category, handleUpdateTask } = useTask();
    const [active, setActive] = useState<{ [key: string]: boolean }>({});

    function UpdateSelectedCategory(key: string, item: CategoryProps) {
        setActive((prev) => ({
            [key]: !prev[key],
        }));
        setSelectedCategory(item);
    }

    function UpdateCategory() {
        if (task) {
            handleUpdateTask({ _id: task._id, category: selectedCategory?._id, task: task })
        }
        handleOnVisible()
    }

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Categorias</Text>
                <FlatList
                    data={category}
                    numColumns={3}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => {
                        const Icone = iconsList[item.icon]
                        const Icon = LucideIcons[Icone];

                        return (
                            <TouchableOpacity
                                style={[styles.categoryBox, { backgroundColor: active[item._id] ? item.color : 'transparent', borderColor: active[item._id] ? 'transparent' : item.color }]}
                                onPress={() => (UpdateSelectedCategory(item._id, item))}
                            >
                                <Icon color={active[item._id] ? theme.white : item.color} size={24} />
                                <Text style={[styles.categoryText, { color: active[item._id] ? theme.white : item.color }]}>{item.category}</Text>
                            </TouchableOpacity>
                        )
                    }}
                    contentContainerStyle={styles.grid}
                />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => handleOnVisible()}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => UpdateCategory()} style={styles.confirmButton}>
                        <Text style={styles.confirmText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
