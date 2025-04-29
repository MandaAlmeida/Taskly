import { attachmentProps } from "@/@types/annotation";
import { useTask } from "@/hooks/useTask";
import { theme } from "@/styles/theme";
import { EllipsisVertical, Paperclip, PencilLine, Trash2, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { formatDatePTBR } from "@/utils/formatDate";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '@/routes/app.routes';

type NavigationProps = StackNavigationProp<StackParamList>;



export function Annotation() {
    const { annotationById, fetchAttachment, isAnnotationOpen, attachment, setIsAnnotationOpen, category, getNameUser, createUserAnnotation, handleAnnotationRemove } = useTask();
    const navigation = useNavigation<NavigationProps>();


    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (annotationById) {
            annotationById.content.map(item => {
                if (item.type !== "image") return;
                if (item.type === "image" && typeof item.value !== "string") {
                    fetchAttachment(item.value)
                }

            })

            getNameUser(annotationById.createdUserId)
        }
    }, [annotationById]);

    function handleEdit() {
        navigation.navigate("addAnnotations", {
            annotation: annotationById
        })
        setIsAnnotationOpen(false)
        setIsVisible(false)
    }

    function handleViewAttachments() {

    }

    return (
        <Modal visible={isAnnotationOpen} transparent>
            {annotationById &&
                <ScrollView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                            <EllipsisVertical size={24} color={theme.gray4} />
                        </TouchableOpacity>
                        {isVisible && <View style={styles.menuEdit}>
                            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
                                <PencilLine size={20} color={theme.gray4} />
                                <Text style={styles.menuText}>Editar anotatação</Text>
                            </TouchableOpacity>

                            {annotationById.attachments && annotationById.attachments?.length > 0 && <TouchableOpacity
                                style={[styles.menuItem, { borderTopWidth: 1, borderColor: `${theme.blue1}40` }]}
                                onPress={handleViewAttachments}
                            >
                                <Paperclip size={20} color={theme.gray4} />
                                <Text style={styles.menuText}>Ver anexos</Text>
                            </TouchableOpacity>}

                            <TouchableOpacity
                                style={[styles.menuItem, { borderTopWidth: 1, borderColor: `${theme.blue1}40` }]}
                                onPress={() => handleAnnotationRemove(annotationById._id, annotationById.title)}
                            >
                                <Trash2 size={20} color={theme.red} />
                                <Text style={[styles.menuText, { color: theme.red }]}>Excluir anotatação</Text>
                            </TouchableOpacity>
                        </View>
                        }
                        <Text style={styles.textHeader}>Anotação</Text>
                        <TouchableOpacity onPress={() => setIsAnnotationOpen(false)}>
                            <X size={24} color={theme.gray4} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>{annotationById.title}</Text>
                    {annotationById.content.map((item, index) => {
                        if (item.type === "text" && typeof item.value === "string") {
                            return (
                                <Text
                                    key={index}
                                    style={{ fontSize: 16, color: '#333', marginBottom: 16 }}
                                >
                                    {item.value}
                                </Text>
                            );
                        } else {
                            const foundImage = attachment.find(image => {
                                if (typeof item.value !== 'string') {
                                    return image.title === item.value.title;
                                }
                                return false;
                            });

                            if (foundImage) {
                                return (
                                    <Image
                                        key={index}
                                        source={{ uri: foundImage.url }}
                                        style={{
                                            width: '100%',
                                            height: 200,
                                            borderRadius: 8,
                                            marginBottom: 16,
                                        }}
                                        resizeMode="cover"
                                    />
                                );
                            } else {
                                return null; // Se não achou imagem, não renderiza nada
                            }
                        }
                    })}

                    <View style={styles.footer}>
                        {annotationById.groupId && <Text style={styles.textFooter}>Grupo: {annotationById.groupId}</Text>}
                        <Text style={styles.textFooter}>Criado por: {createUserAnnotation?.userName}</Text>
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={styles.textFooter}>Categoria: {category.find((category) => category._id === annotationById.category)?.category || "Sem categoria"}</Text>
                            <Text style={styles.textFooter}>Data de criação: {formatDatePTBR(annotationById.createdAt)}</Text>
                        </View>
                    </View>
                </ScrollView>}
        </Modal>
    )
}