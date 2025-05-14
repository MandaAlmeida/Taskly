import React, { useEffect, useState } from "react";
import { FlatList, View, Text, ListRenderItemInfo, TouchableOpacity, Image, TouchableWithoutFeedback } from "react-native";
import { styles } from "./styles";

import { useTask } from "@/hooks/useTask";

import { Header } from "@/components/header";
import { Search } from "@/components/search";
import { EmptyState } from "@/components/emptyState";
import { formatLayout, LayoutBlock } from "@/utils/formatLayout";
import { formatDatePTBR } from "@/utils/formatDate";
import { Annotation } from "@/components/annotation";
import { theme } from "@/styles/theme";
import { EllipsisVertical, PencilLine, Trash2, UserRoundPlus, UsersRound, X } from "lucide-react-native";
import { ModalCreateMember } from "@/components/modalCreateMember";

export function Anotations() {
    const { fetchAnnotation, fetchAnnotationById, data, fetchAnnotationBySearch, fetchByGroup, setData, removeGroup, setModalState } = useTask();

    const [search, setSearch] = useState("");
    const [isVisible, setIsVisible] = useState(false)


    useEffect(() => {
        fetchAnnotation();
        fetchByGroup();
    }, []);

    function handleAnnotation(id: string) {
        fetchAnnotationById(id)
    }

    function handleEdit() {
        setModalState({ name: "isGroupOpen" })
        setIsVisible(false)
    }

    const layout = formatLayout(data.annotationSearch.length > 0 ? data.annotationSearch : data.annotation);

    const renderItem = ({ item }: ListRenderItemInfo<LayoutBlock>) => {
        if (item.type === "row") {
            return (
                <View style={styles.row}>

                    {item.items.map((annotation) => {
                        const color = data.categories.find((category) => category._id === annotation.category)?.color || theme.blue1

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
                                {
                                    annotation.content.length > 0 && annotation.content[0].type === "text" ? (
                                        <Text style={styles.description}>{annotation.content[0].value.toString()}</Text>
                                    ) : annotation.content.length > 0 && annotation.content[0].type === "image" ? (
                                        <Image source={{ uri: annotation.content[0].value.url }} />
                                    ) : null
                                }

                                <View style={styles.footer}>
                                    <Text style={styles.date}>{formatDatePTBR(annotation.createdAt)}</Text>
                                    <Text style={[styles.tag, { backgroundColor: color }]}>{data.categories.find((category) => category._id === annotation.category)?.category || "Sem categoria"}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            );
        } else {
            const annotation = item.items[0];
            const color = data.categories.find((category) => category._id === annotation.category)?.color || theme.blue1
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
                        <Text style={[styles.tag, { backgroundColor: color }]}>{data.categories.find((category) => category._id === annotation.category)?.category || "Sem categoria"}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    return (
        <View style={styles.container}>
            {data.selectedGroup ? <>
                {isVisible && <TouchableWithoutFeedback onPress={() => setIsVisible(!isVisible)}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                        <EllipsisVertical size={24} color={theme.gray4} />
                    </TouchableOpacity>
                    {isVisible && <View style={styles.menuEdit}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => setModalState({ name: "isCreateMemberOpen", data: data.selectedGroup?.members })}>
                            <PencilLine size={20} color={theme.gray4} />
                            <Text style={styles.menuText}>Editar membros</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menuItem, { borderTopWidth: 1, borderColor: `${theme.blue1}40` }]} onPress={handleEdit}>
                            <UsersRound size={20} color={theme.gray4} />
                            <Text style={styles.menuText}>Editar grupo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.menuItem, { borderTopWidth: 1, borderColor: `${theme.blue1}40` }]}
                            onPress={() => removeGroup(data.selectedGroup!.name, data.selectedGroup!._id)}
                        >
                            <Trash2 size={20} color={theme.red} />
                            <Text style={[styles.menuText, { color: theme.red }]}>Excluir grupo</Text>
                        </TouchableOpacity>
                    </View>
                    }
                    <Text style={styles.textHeader}>Grupo {data.selectedGroup.name}</Text>
                    <TouchableOpacity onPress={() => setData(prevData => ({ ...prevData, selectedGroup: undefined }))}>
                        <X size={24} color={theme.gray4} />
                    </TouchableOpacity>
                </View>
            </> : <Header text="Anotações" />}
            {data.annotation && data.annotation.length > 0 ? (
                <>
                    <Search fetchSearch={fetchAnnotationBySearch} placeholder="Pesquisar por anotação ou categoria" setName={setSearch} name={search} />
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
            <ModalCreateMember />
        </View>
    );
}
