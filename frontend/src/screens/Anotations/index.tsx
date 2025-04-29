import React, { useEffect } from "react";
import { FlatList, View, Text, ListRenderItemInfo, TouchableOpacity } from "react-native";
import { styles } from "./styles";

import { useTask } from "@/hooks/useTask";

import { Header } from "@/components/header";
import { Search } from "@/components/search";
import { EmptyState } from "@/components/emptyState";
import { formatLayout, LayoutBlock } from "@/utils/formatLayout";
import { formatDatePTBR } from "@/utils/formatDate";
import { Annotation } from "@/components/annotation";
import { theme } from "@/styles/theme";

export function Anotations() {
    const { annotation, fetchAnnotation, fetchAnnotationById, category } = useTask();

    useEffect(() => {
        fetchAnnotation();
    }, []);

    function handleAnnotation(id: string) {
        fetchAnnotationById(id)
    }

    const layout = formatLayout(annotation);

    const renderItem = ({ item }: ListRenderItemInfo<LayoutBlock>) => {
        if (item.type === "row") {
            return (
                <View style={styles.row}>

                    {item.items.map((annotation) => {
                        const color = category.find((category) => category._id === annotation.category)?.color || theme.blue1

                        return (
                            <TouchableOpacity
                                key={annotation._id}
                                style={[styles.card, styles.cardSmall, {
                                    backgroundColor: `${color}20`,
                                    borderColor: color,
                                }]}
                                onPress={() => handleAnnotation(annotation._id)}
                            >
                                <Text style={styles.title}>{annotation.title}</Text>
                                {/* Verificar se annotation.content existe e é um array */}
                                {annotation.content.map((ann, index) => {
                                    if (ann.type === "text") {
                                        return <Text key={index} style={styles.description}>{ann.value.toString()}</Text>;
                                    }
                                    return null;
                                })}
                                <View style={styles.footer}>
                                    <Text style={styles.date}>{formatDatePTBR(annotation.createdAt)}</Text>
                                    <Text style={[styles.tag, { backgroundColor: color }]}>{category.find((category) => category._id === annotation.category)?.category || "Sem categoria"}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            );
        } else {
            const annotation = item.items[0];
            const color = category.find((category) => category._id === annotation.category)?.color || theme.blue1
            return (
                <TouchableOpacity
                    key={annotation._id}
                    style={[styles.card, styles.cardLarge, {
                        backgroundColor: `${color}20`,
                        borderColor: color,
                    }]}
                    onPress={() => handleAnnotation(annotation._id)}
                >
                    <Text style={styles.title}>{annotation.title}</Text>
                    {annotation.content.map((ann, index) => {
                        if (ann.type === "text") {
                            return <Text key={index} style={styles.description}>{ann.value.toString()}</Text>;
                        }
                        return null;
                    })}
                    <View style={styles.footer}>
                        <Text style={styles.date}>{formatDatePTBR(annotation.createdAt)}</Text>
                        <Text style={[styles.tag, { backgroundColor: color }]}>{category.find((category) => category._id === annotation.category)?.category || "Sem categoria"}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    return (
        <View style={styles.container}>
            <Header text="Anotações" />
            {annotation && annotation.length > 0 ? (
                <>
                    <Search />
                    <FlatList
                        data={layout}
                        renderItem={renderItem}
                        keyExtractor={(_, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            ) : (
                <EmptyState text="Anotações" title="Sobre o que você quer escrever agora?" />
            )}
            <Annotation />
        </View>
    );
}
