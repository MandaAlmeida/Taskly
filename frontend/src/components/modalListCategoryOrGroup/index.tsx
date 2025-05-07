import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { Feather } from '@expo/vector-icons';
import { Button } from "@/components/button";

import { theme } from '@/styles/theme';
import { Trash2 } from "lucide-react-native";
import { styles } from "./styles";
import { AddCategory } from "../addGroupAndCategory/addCategory";
import { AddGroup } from "../addGroupAndCategory/addGrop";
import { useTask } from "@/hooks/useTask";

type ModalListProps = {
    title: "categoria" | "grupo";
    data: any[];
    onAdd: () => void;
    onClose: () => void;
    visible: boolean;
};

export function ModalList({ title, data, visible, onAdd, onClose }: ModalListProps) {
    const { removeGroup, removeCategory, setModalState, modalState } = useTask()

    function onRemove(item: string, id: string) {
        if (title === "grupo") {
            removeGroup(item, id)
        } else {
            removeCategory(item, id)
        }
    }

    return (
        <Modal visible={visible} transparent>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Adicionar ou remover {title}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Feather name="x" size={24} color={theme.gray2} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={data}
                    keyExtractor={(item) => item._id!}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setModalState(modalState.name === "isGroupOpen" ? { name: "isCreateGroupOpen", data: item } : { name: "isCreateCategoryOpen", data: item })} style={[styles.category, {
                            paddingHorizontal: 10,
                            backgroundColor: `${item.color}50`,
                            borderWidth: 1,
                            borderColor: item.color
                        }]}>
                            <Text style={styles.text}>{title === "categoria" ? item.category : item.name}</Text>
                            <TouchableOpacity onPress={() => onRemove(title === "categoria" ? item.category : item.name, item._id)}>
                                <Trash2 size={16} color={theme.red} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        <View style={[styles.category, { paddingLeft: 10, alignSelf: "center" }]}>
                            <Button text={`Adicionar ${title}`} style={{ paddingHorizontal: 15 }} onPress={onAdd} />
                        </View>
                    }
                />

            </View>
        </Modal>
    );
}

