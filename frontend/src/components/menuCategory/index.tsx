import React, { useEffect, useState } from "react";
import {
    FlatList,
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { ChevronRight, LucidePencilLine } from "lucide-react-native";
import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { useNavigation } from "@react-navigation/native";
import { CategoryProps } from "@/@types/category";
import * as LucideIcons from 'lucide-react-native';
import { iconsList } from "@/Array/icons";
import { useTask } from "@/hooks/useTask";



type Props = {
    visible: boolean;
    title: string;
    data: CategoryProps[];
    onClose: () => void;
    onSelect: (item: CategoryProps | undefined) => void;
};

export function MenuListModal({
    visible,
    title,
    data,
    onClose,
    onSelect,
}: Props) {
    const { selectedCategory, category } = useTask();
    const { navigate } = useNavigation();

    function handlePress(item: CategoryProps | undefined) {
        onSelect(item);
    }

    function handleBackToAdd() {
        navigate("category")
        onClose()
    }

    const todas = category.find(category => category.category === "Todas")

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            <View style={styles.container}>
                <View style={styles.containerTitle}>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity onPress={handleBackToAdd}>
                        <LucidePencilLine size={24} color={theme.gray4} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={data}
                    keyExtractor={(item) => item._id}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => {
                        const Icone = iconsList[todas?.icon || 7];
                        const Icon = LucideIcons[Icone];

                        return (
                            <View style={{ marginBottom: 20 }}>
                                <TouchableOpacity
                                    style={[
                                        styles.categoryBox,
                                        {
                                            backgroundColor:
                                                selectedCategory === undefined || selectedCategory._id === todas?._id
                                                    ? todas?.color
                                                    : `${todas?.color}40`,
                                        },
                                    ]}
                                    onPress={() => handlePress(todas)}
                                >
                                    <View style={styles.categoryContainer}>
                                        <Icon
                                            size={20}
                                            color={
                                                selectedCategory === undefined || selectedCategory._id === todas?._id ? theme.gray4 : theme.gray3
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                {
                                                    color:
                                                        selectedCategory === undefined || selectedCategory._id === todas?._id ? theme.gray4 : theme.gray3,
                                                },
                                            ]}
                                        >
                                            {todas?.category}
                                        </Text>
                                    </View>
                                    <ChevronRight
                                        size={20}
                                        color={
                                            selectedCategory?._id === 'all' ? theme.gray4 : theme.gray3
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    renderItem={({ item }) => {
                        const Icone = iconsList[item.icon];
                        const Icon = LucideIcons[Icone];

                        return (
                            <TouchableOpacity
                                style={[
                                    styles.categoryBox,
                                    {
                                        backgroundColor:
                                            selectedCategory?._id === item._id
                                                ? item.color
                                                : `${item.color}40`,
                                    },
                                ]}
                                onPress={() => handlePress(item)}
                            >
                                <View style={styles.categoryContainer}>
                                    <Icon
                                        size={20}
                                        color={
                                            selectedCategory?._id === item._id
                                                ? theme.gray4
                                                : theme.gray3
                                        }
                                    />
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            {
                                                color:
                                                    selectedCategory?._id === item._id
                                                        ? theme.gray4
                                                        : theme.gray3,
                                            },
                                        ]}
                                    >
                                        {item.category}
                                    </Text>
                                </View>
                                <ChevronRight
                                    size={20}
                                    color={
                                        selectedCategory?._id === item._id
                                            ? theme.gray4
                                            : theme.gray3
                                    }
                                />
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </Modal>
    );
}
