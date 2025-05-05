import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { useTask } from '@/hooks/useTask';
import { theme } from '@/styles/theme';
import { useState } from 'react';
import * as LucideIcons from 'lucide-react-native';
import { iconsList } from "@/Array/icons";
import { styles } from './styles';
import { CategoryProps } from '@/@types/category';
import { ModalProps } from '../modalSubTask';
import { ButtonModal } from '../buttonModal';
import { AddCategory } from '../addGroupAndCategory/addCategory';


export function ModalCategory({ isVisible, handleOnVisible, task }: ModalProps) {
    const { data, setData, setModalState, handleUpdateTask } = useTask();

    const [active, setActive] = useState<{ [key: string]: boolean }>({});

    function UpdateSelectedCategory(key: string, item: CategoryProps) {
        setActive((prev) => ({
            [key]: !prev[key],
        }));
        setData(prevData => ({ ...prevData, selectedCategory: item }));
    }

    function UpdateCategory() {
        if (task) {
            handleUpdateTask({ _id: task._id, category: data.selectedCategory?._id, task: task })
        }
        handleOnVisible()
    }

    function handleAddCategory() {
        setModalState('isCreateCategoryOpen')
    }

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Categorias</Text>
                <FlatList
                    data={[...data.categories.filter(item => item.category !== 'Todas'),
                    { _id: 'add', category: 'Add Subcategoria', icon: 24, color: theme.blue1, userId: data.user?._id }
                    ]}
                    numColumns={3}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => {
                        if (item._id === 'add') {
                            return (
                                <TouchableOpacity
                                    style={[styles.categoryBox, { backgroundColor: 'transparent', borderColor: theme.blue1 }]}
                                    onPress={handleAddCategory}
                                >
                                    <LucideIcons.Plus color={theme.blue1} size={24} />
                                    <Text style={[styles.categoryText, { color: theme.blue1 }]}>Add</Text>
                                </TouchableOpacity>
                            );
                        }

                        const Icone = iconsList[item.icon];
                        const Icon = LucideIcons[Icone];

                        return (
                            <TouchableOpacity
                                style={[
                                    styles.categoryBox,
                                    {
                                        backgroundColor: active[item._id] ? item.color : 'transparent',
                                        borderColor: active[item._id] ? 'transparent' : item.color
                                    }
                                ]}
                                onPress={() => UpdateSelectedCategory(item._id, item)}
                            >
                                <Icon color={active[item._id] ? theme.white : item.color} size={24} />
                                <Text style={[styles.categoryText, { color: active[item._id] ? theme.white : item.color }]}>
                                    {item.category}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                    contentContainerStyle={styles.grid}
                />
                <ButtonModal color={task?.color || theme.blue1} CreateItem={() => UpdateCategory()} handleOnVisible={() => handleOnVisible()} />
            </View>

            <AddCategory title="Categoria" />
        </Modal>
    );
}
