import { AnnotationProps, attachmentProps } from "@/@types/annotation";
import { useTask } from "@/hooks/useTask";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { ArrowDownToLineIcon, Trash2, X } from "lucide-react-native";
import { theme } from "@/styles/theme";

type AttachmentsProps = {
    id: string
    color?: string
};

export function Attachments({ id, color }: AttachmentsProps) {
    const { isAttachmentOpen, setIsAttachmentOpen, handleAttachmentRemove, annotationById } = useTask();

    return (
        <Modal visible={isAttachmentOpen} transparent>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Anexos</Text>
                    <TouchableOpacity onPress={() => setIsAttachmentOpen(false)}>
                        <X size={20} color={theme.gray4} />
                    </TouchableOpacity>

                </View>
                <FlatList
                    data={annotationById?.attachments}
                    keyExtractor={(_, index) => index.toString()}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                    renderItem={({ item }) => (
                        <View style={[styles.attachment, { borderColor: color, backgroundColor: `${color}20` }]}>
                            <Text style={styles.text}>{item.title}</Text>
                            <TouchableOpacity>
                                <ArrowDownToLineIcon size={20} color={theme.gray4} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleAttachmentRemove(id, item.title, item.url)}>
                                <Trash2 size={20} color={theme.red} />
                            </TouchableOpacity>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </Modal>
    );
}
