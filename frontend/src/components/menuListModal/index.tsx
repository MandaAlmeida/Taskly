import React, { useEffect } from "react";
import {
    FlatList,
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { ChevronRight, LucidePencilLine } from "lucide-react-native";
import * as LucideIcons from "lucide-react-native";

import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { iconsList } from "@/Array/icons";
import { useTask } from "@/hooks/useTask";
import { CategoryProps } from "@/@types/category";
import { GroupProps } from "@/@types/group";

type Props = {
    visible: boolean;
    title: string;
    items: (CategoryProps | GroupProps)[];
    onClose: () => void;
    onAddNewItem: () => void;
    onSelect: (item: any) => void;
    showDefaultItem?: boolean;
};

export function MenuListModal({
    visible,
    title,
    items,
    onClose,
    onAddNewItem,
    onSelect,
    showDefaultItem = false,
}: Props) {
    const { data, fetchGroup } = useTask();

    function handleSelect(item: any) {
        onSelect(item);
        onClose();
    }

    useEffect(() => {
        fetchGroup()
    }, [])

    const isCategory = (item: any): item is CategoryProps =>
        !!item && typeof item === 'object' && 'category' in item;

    const defaultItem = isCategory(items[0])
        ? (items as CategoryProps[]).find(i => i.category === "Todas")
        : undefined;


    const renderItem = ({ item }: { item: CategoryProps | GroupProps }) => {
        const isSelected = data.selectedFilterCategory?._id === item._id;
        const label = isCategory(item) ? item.category : item.name;
        const IconName = iconsList[item.icon];
        const Icon = LucideIcons[IconName];

        return (
            <TouchableOpacity
                style={[
                    styles.categoryBox,
                    { backgroundColor: isSelected ? item.color : `${item.color}40` },
                ]}
                onPress={() => handleSelect(item)}
            >
                <View style={styles.categoryContainer}>
                    <Icon size={20} color={isSelected ? theme.gray4 : theme.gray3} />
                    <Text style={[
                        styles.categoryText,
                        { color: isSelected ? theme.gray4 : theme.gray3 }
                    ]}>
                        {label}
                    </Text>
                </View>
                <ChevronRight size={20} color={isSelected ? theme.gray4 : theme.gray3} />
            </TouchableOpacity>
        );
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            <View style={styles.container}>
                <View style={styles.containerTitle}>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity onPress={onAddNewItem}>
                        <LucidePencilLine size={24} color={theme.gray4} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={items}
                    keyExtractor={(item) => item._id}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        showDefaultItem && defaultItem ? (() => {
                            const IconName = iconsList[defaultItem.icon];
                            const Icon = LucideIcons[IconName];
                            const isSelected = data.selectedCategory?._id === defaultItem._id;

                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.categoryBox,
                                        { backgroundColor: isSelected ? defaultItem.color : `${defaultItem.color}40` },
                                    ]}
                                    onPress={() => handleSelect(defaultItem)}
                                >
                                    <View style={styles.categoryContainer}>
                                        <Icon size={20} color={isSelected ? theme.gray4 : theme.gray3} />
                                        <Text style={[
                                            styles.categoryText,
                                            { color: isSelected ? theme.gray4 : theme.gray3 }
                                        ]}>
                                            {defaultItem.category}
                                        </Text>
                                    </View>
                                    <ChevronRight size={20} color={isSelected ? theme.gray4 : theme.gray3} />
                                </TouchableOpacity>
                            );
                        })() : null
                    }
                    renderItem={renderItem}
                />
            </View>
        </Modal>
    );
}
