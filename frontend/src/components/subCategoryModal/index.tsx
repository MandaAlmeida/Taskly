import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles';
import { useTask } from '@/hooks/useTask';
import { LucideIcon, icons } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react-native';
import { iconsList } from "@/Array/icons";
import { SubCategoryProps } from '@/@types/subCategory';

type Props = {
    isVisible: boolean;
    handleOnVisible: () => void;
};

export type CategoryProps = {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
};

export function SubCategoryModal({ isVisible, handleOnVisible }: Props) {
    const { setSelectedSubCategory, subCategory } = useTask();
    const [active, setActive] = useState<{ [key: string]: boolean }>({});

    function toggleSection(key: string, item: SubCategoryProps) {
        setActive((prev) => ({
            [key]: !prev[key],
        }));
        setSelectedSubCategory(item);
    }

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Sub-categorias</Text>
                <FlatList
                    data={subCategory}
                    numColumns={3}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => {
                        const Icone = iconsList[item.icon]
                        const Icon = LucideIcons[Icone];

                        return (
                            <TouchableOpacity
                                style={[styles.categoryBox, { backgroundColor: active[item._id] ? item.color : 'transparent', borderColor: active[item._id] ? 'transparent' : item.color }]}
                                onPress={() => (toggleSection(item._id, item))}
                            >
                                <Icon color={active[item._id] ? theme.white : item.color} size={24} />
                                <Text style={[styles.categoryText, { color: active[item._id] ? theme.white : item.color }]}>{item.subCategory}</Text>
                            </TouchableOpacity>
                        )
                    }}
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
