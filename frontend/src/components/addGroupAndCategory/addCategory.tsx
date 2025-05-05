import { theme } from "@/styles/theme";
import { useState } from "react";
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { useTask } from "@/hooks/useTask";
import * as LucideIcons from 'lucide-react-native';
import chroma from 'chroma-js';
import { colors } from "@/Array/colors";
import { iconsList } from "@/Array/icons";

type CategoryProps = {
    title: string
}

export function AddCategory({ title }: CategoryProps) {
    const { modalState, setModalState, handleAddCategory, handleAddSubCategory } = useTask();
    const [selectedName, setSelectedName] = useState("")
    const [selectedIcon, setSelectedIcon] = useState<number>(0);
    const [selectedColor, setSelectedColor] = useState<number>(0);


    function CreateCategory() {
        handleAddCategory(selectedName, selectedIcon.toString(), chroma(colors[selectedColor]).hex())
        setModalState(null)
    }

    function CreateSubCategory() {
        handleAddSubCategory(selectedName, selectedIcon.toString(), chroma(colors[selectedColor]).hex())
        setModalState(null)
    }

    return (
        <Modal visible={modalState == "isCreateCategoryOpen"} transparent animationType="fade" >
            <View style={styles.modal}>
                <View style={styles.container}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.containerInput}>
                        <Text style={styles.text}>Nome:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={`Nome da ${title}`}
                            placeholderTextColor={theme.gray1}
                            value={selectedName}
                            onChangeText={(text) => { setSelectedName(text) }}
                        />
                    </View>

                    <View style={styles.containerInput}>
                        <Text style={styles.text}>Icone:</Text>
                        <FlatList
                            data={iconsList}
                            horizontal
                            contentContainerStyle={styles.containerColor}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(_, icon) => icon.toString()}
                            renderItem={({ item, index }) => {
                                const Icon = LucideIcons[item];

                                return (
                                    <TouchableOpacity
                                        onPress={() => setSelectedIcon(index)}
                                        style={[
                                            styles.circle,
                                            selectedIcon === index && styles.selectedIcon,
                                        ]}
                                    >
                                        <Icon
                                            size={20}
                                            color={selectedIcon === index ? '#fff' : '#333'}
                                        />
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>

                    <View style={styles.containerInput}>
                        <Text style={styles.text}>Cor:</Text>
                        <FlatList
                            data={colors}
                            horizontal
                            contentContainerStyle={styles.containerColor}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(_, color) => color.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => setSelectedColor(index)}
                                    style={[
                                        styles.circle,
                                        { backgroundColor: item },
                                        selectedColor === index && styles.selected,
                                    ]}
                                />
                            )}
                        />
                    </View>
                </View>
                <View style={styles.containerButton}>
                    <TouchableOpacity onPress={() => setModalState(null)} style={styles.button}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => title === "Categoria" ? CreateCategory() : CreateSubCategory()} style={[styles.button, { backgroundColor: theme.blue1 }]}>
                        <Text style={styles.confirmText}>Criar {title}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}