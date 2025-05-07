import { theme } from "@/styles/theme";
import { useEffect, useState } from "react";
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTask } from "@/hooks/useTask";
import * as LucideIcons from 'lucide-react-native';
import chroma from 'chroma-js';
import { colors } from "@/Array/colors";
import { iconsList } from "@/Array/icons";
import { styles } from "./styles";

export function AddGroup() {
    const { modalState, setModalState, handleAddGroup, handleUpdateGroup } = useTask();
    const [selectedName, setSelectedName] = useState("");
    const [selectedDescription, setSelectedDescription] = useState("");
    const [selectedIcon, setSelectedIcon] = useState<number>(0);
    const [selectedColor, setSelectedColor] = useState(0);


    useEffect(() => {
        if (modalState.name === "isCreateGroupOpen") {
            if (modalState.data) {
                setSelectedName(modalState.data.name || "");
                setSelectedDescription(modalState.data.description || "");
                setSelectedIcon(Number(modalState.data.icon) ?? 0);

                const colorRaw = modalState.data.color;
                const colorIndex = colors.findIndex(color => chroma(color).hex() === colorRaw);

                setSelectedColor(colorIndex >= 0 ? colorIndex : 0);

            } else {
                // Limpa os campos se não houver dados
                setSelectedName("");
                setSelectedDescription("");
                setSelectedIcon(0);
                setSelectedColor(0);
            }
        }
    }, [modalState]);


    function CreateGroup() {
        if (modalState.data) {
            handleUpdateGroup(modalState.data._id, selectedName, selectedDescription, selectedIcon, chroma(colors[selectedColor]).hex())
            setModalState({ name: "isGroupOpen" })
        } else {
            handleAddGroup(selectedName, selectedDescription, selectedIcon, chroma(colors[selectedColor]).hex())
            setModalState({ name: "isGroupOpen" })
            setSelectedColor(0)
            setSelectedDescription("")
            setSelectedName("")
            setSelectedIcon(0)
        }

    }

    return (
        <Modal visible={modalState.name === "isCreateGroupOpen"} transparent animationType="fade" >
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
                    <TouchableOpacity onPress={() => setModalState({ name: null })} style={styles.button}>
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