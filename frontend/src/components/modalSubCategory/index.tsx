import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles';
import { useTask } from '@/hooks/useTask';
import { theme } from '@/styles/theme';
import { useState } from 'react';
import * as LucideIcons from 'lucide-react-native';
import { iconsList } from "@/Array/icons";
import { SubCategoryProps } from '@/@types/subCategory';
import { ButtonModal } from '../buttonModal';
import { ModalProps } from '../modalSubTask';
import { AddCategory } from '../addCategory';


export function ModalSubCategory({ isVisible, handleOnVisible, task }: ModalProps) {
    const { setSelectedSubCategory, selectedSubCategory, subCategory, handleUpdateTask, selectedCategory, user, setIsCreateCategoryOpen } = useTask();
    const [active, setActive] = useState<{ [key: string]: boolean }>({});

    function UpdateSetSubCategory(key: string, item: SubCategoryProps) {
        setActive((prev) => ({
            [key]: !prev[key],
        }));
        setSelectedSubCategory(item);
    }

    function UpdateSubCategory() {
        if (task) {
            handleUpdateTask({ _id: task._id, subCategory: selectedSubCategory?._id, task: task })
        }
        handleOnVisible()
    }

    function handleAddSubCategory() {
        setIsCreateCategoryOpen(true)
    }

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Sub-categorias</Text>
                <FlatList
                    data={[
                        ...subCategory.filter(item => item.categoryId === selectedCategory?._id),
                        { _id: 'add', subCategory: 'Add Subcategoria', icon: 24, color: theme.blue1, categoryId: "680c5694af5684c6b85511b5", categoryName: "Estudo", userId: user?._id }
                    ]}
                    numColumns={3}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => {
                        if (item._id === 'add') {
                            return (
                                <TouchableOpacity
                                    style={[styles.categoryBox, { backgroundColor: 'transparent', borderColor: theme.blue1 }]}
                                    onPress={handleAddSubCategory} // <-- função diferente aqui
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
                                onPress={() => UpdateSetSubCategory(item._id, item)}
                            >
                                <Icon color={active[item._id] ? theme.white : item.color} size={24} />
                                <Text style={[styles.categoryText, { color: active[item._id] ? theme.white : item.color }]}>
                                    {item.subCategory}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                    contentContainerStyle={styles.grid}
                />

                <ButtonModal color={task?.color || theme.blue1} CreateItem={() => UpdateSubCategory()} handleOnVisible={() => handleOnVisible()} />
            </View>
            <AddCategory title="Sub Categoria" />
        </Modal>
    );
}
