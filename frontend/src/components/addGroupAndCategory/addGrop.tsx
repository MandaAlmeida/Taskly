import { theme } from "@/styles/theme";
import { useState } from "react";
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTask } from "@/hooks/useTask";
import * as LucideIcons from 'lucide-react-native';
import chroma from 'chroma-js';
import { colors } from "@/Array/colors";
import { iconsList } from "@/Array/icons";
import { styles } from "./styles";

export function AddGroup() {
    const { modalState, setModalState, handleAddGroup } = useTask();
    const [selectedName, setSelectedName] = useState("");
    const [selectedDescription, setSelectedDescription] = useState("");
    const [selectedIcon, setSelectedIcon] = useState<number>(0);
    const [selectedColor, setSelectedColor] = useState<number>(0);


    function CreateGroup() {
        handleAddGroup(selectedName, selectedDescription, selectedIcon, chroma(colors[selectedColor]).hex())
        setModalState(null)
    }

    return (
        <Modal visible={modalState === "isCreateGroupOpen"} transparent animationType="fade" >
            <View style={styles.modal}>
                <View style={styles.container}>
                    <Text style={styles.title}>Criar novo grupo</Text>
                    <View style={styles.containerInput}>
                        <Text style={styles.text}>Nome:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome do grupo"
                            placeholderTextColor={theme.gray1}
                            value={selectedName}
                            onChangeText={(text) => { setSelectedName(text) }}
                        />
                    </View>
                    <View style={styles.containerInput}>
                        <Text style={styles.text}>Descrição:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Descrição do grupo"
                            placeholderTextColor={theme.gray1}
                            value={selectedDescription}
                            onChangeText={(text) => { setSelectedDescription(text) }}
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

                    <TouchableOpacity onPress={() => CreateGroup()} style={[styles.button, { backgroundColor: theme.blue1 }]}>
                        <Text style={styles.confirmText}>Criar Grupo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}