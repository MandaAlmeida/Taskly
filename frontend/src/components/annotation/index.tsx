import { attachmentProps } from "@/@types/annotation";
import { useTask } from "@/hooks/useTask";
import { theme } from "@/styles/theme";
import { EllipsisVertical, X } from "lucide-react-native";
import { useEffect } from "react";
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { formatDatePTBR } from "@/utils/formatDate";

export function Annotation() {
    const { annotationById, fetchAttachment, isAnnotationOpen, attachment, setIsAnnotationOpen } = useTask();

    useEffect(() => {
        if (!annotationById?.attachment) return;
        fetchAttachment(annotationById.attachment)

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
                    <View style={styles.containerContent}>
                        <Text style={styles.content}>{annotationById.content}</Text>

                        {attachment?.map((url, index) => (
                            <Image
                                key={index}
                                source={{ uri: url }}
                                style={styles.image}
                            />
                        ))}
                    </View>
                    <View style={styles.footer}>
                        {annotationById.groupId && <Text style={styles.textFooter}>Grupo: {annotationById.groupId}</Text>}
                        <Text style={styles.textFooter}>Criado por: {annotationById.createdUserId}</Text>
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={styles.textFooter}>Categoria: {annotationById.category}</Text>
                            <Text style={styles.textFooter}>Data de criação: {formatDatePTBR(annotationById.createdAt)}</Text>
                        </View>
                    </View>
                </ScrollView>}
        </Modal>
    )
}