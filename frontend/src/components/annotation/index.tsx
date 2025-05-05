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
import { Attachments } from "../attachments";

type NavigationProps = StackNavigationProp<StackParamList>;



export function Annotation() {
    const { data, fetchAttachment, modalState, setModalState, getNameUser, handleAnnotationRemove } = useTask();
    const navigation = useNavigation<NavigationProps>();


    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (data.annotationById) {
            data.annotationById.content.map(item => {
                if (item.type !== "image") return;
                if (item.type === "image" && typeof item.value !== "string") {
                    fetchAttachment(item.value)
                }

            })

            getNameUser(data.annotationById.createdUserId)
        }
    }, [data.annotationById]);

    function handleEdit() {
        navigation.navigate("addAnnotations", {
            annotation: data.annotationById
        })
        setModalState(null)
        setIsVisible(false)
    }

    function handleViewAttachments() {
        setModalState("isAttachmentOpen")
        setIsVisible(false)
    }

    return (
        <Modal visible={modalState === "isAnnotationOpen"} transparent>
            {data.annotationById &&
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                            <EllipsisVertical size={24} color={theme.gray4} />
                        </TouchableOpacity>
                        {isVisible && <View style={styles.menuEdit}>
                            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
                                <PencilLine size={20} color={theme.gray4} />
                                <Text style={styles.menuText}>Editar anotatação</Text>
                            </TouchableOpacity>

                            {data.annotationById.attachments && data.annotationById.attachments?.length > 0 && <TouchableOpacity
                                style={[styles.menuItem, { borderTopWidth: 1, borderColor: `${theme.blue1}40` }]}
                                onPress={handleViewAttachments}
                            >
                                <Paperclip size={20} color={theme.gray4} />
                                <Text style={styles.menuText}>Ver anexos</Text>
                            </TouchableOpacity>}

                            <TouchableOpacity
                                style={[styles.menuItem, { borderTopWidth: 1, borderColor: `${theme.blue1}40` }]}
                                onPress={() => handleAnnotationRemove(data.annotationById!._id, data.annotationById!.title)}
                            >
                                <Trash2 size={20} color={theme.red} />
                                <Text style={[styles.menuText, { color: theme.red }]}>Excluir anotatação</Text>
                            </TouchableOpacity>
                        </View>
                        }
                        <Text style={styles.textHeader}>Anotação</Text>
                        <TouchableOpacity onPress={() => setModalState(null)}>
                            <X size={24} color={theme.gray4} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <Text style={styles.title}>{data.annotationById.title}</Text>
                        {data.annotationById.content.map((item, index) => {
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
                                const foundImage = data.attachment.find(image => {
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
                    </ScrollView>
                    <View style={styles.footer}>
                        {data.annotationById.groupId && <Text style={styles.textFooter}>Grupo: {data.annotationById.groupId}</Text>}
                        <Text style={styles.textFooter}>Criado por: {data.createUserAnnotation?.userName}</Text>
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={styles.textFooter}>Categoria: {data.categories.find((categories) => categories._id === data.annotationById?.category)?.category || "Sem categoria"}</Text>
                            <Text style={styles.textFooter}>Data de criação: {formatDatePTBR(data.annotationById.createdAt)}</Text>
                        </View>
                    </View>
                    <Attachments id={data.annotationById._id} color={data.categories.find((categories) => categories._id === data.annotationById?.category)?.color || theme.blue1} />
                </View>
            }
        </Modal>
    )
}