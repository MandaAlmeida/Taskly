import { attachmentProps } from "@/@types/annotation";
import { useTask } from "@/hooks/useTask";
import { theme } from "@/styles/theme";
import { EllipsisVertical, X } from "lucide-react-native";
import { useEffect } from "react";
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { formatDatePTBR } from "@/utils/formatDate";

export function Annotation() {
    const { annotationById, fetchAttachment, isAnnotationOpen, attachment, setIsAnnotationOpen, category, getNameUser, createUserAnnotation } = useTask();

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

    return (
        <Modal visible={isAnnotationOpen} transparent>
            {annotationById &&
                <ScrollView style={styles.container}>
                    <View style={styles.header}>
                        {/* <TouchableOpacity>
                        <EllipsisVertical size={24} color={theme.gray4} />
                    </TouchableOpacity> */}
                        {/* <Text style={styles.textHeader}>Anotação</Text> */}
                        <Text style={styles.title}>{annotationById.title}</Text>
                        <TouchableOpacity onPress={() => setIsAnnotationOpen(false)}>
                            <X size={24} color={theme.gray4} />
                        </TouchableOpacity>
                    </View>

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
                        } else if (item.type === "image" && typeof item.value !== "string") {

                            const foundImage = attachment.find(image => image.title === item.value.title);

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