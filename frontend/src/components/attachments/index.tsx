import { useTask } from "@/hooks/useTask";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { ArrowDownToLineIcon, Trash2, X } from "lucide-react-native";
import { theme } from "@/styles/theme";
import * as FileSystem from 'expo-file-system';

type AttachmentsProps = {
    id: string
    color?: string
};




export function Attachments({ id, color }: AttachmentsProps) {
    const { setModalState, modalState, handleAttachmentRemove, handleDownloadAttachment, data } = useTask();

    async function downloadFile(backendUrl: string, fileName: string) {
        try {
            handleDownloadAttachment(backendUrl);
            const fileUri = FileSystem.documentDirectory + fileName;

            // Agora baixa o arquivo usando a URL retornada
            //   const { uri } = await FileSystem.downloadAsync(finalUrl, fileUri);
            //   console.log('Arquivo salvo em:', uri);
        } catch (error) {
            console.error('Erro no download:', error);
        }
    }


    return (
        <Modal visible={modalState === "isAttachmentOpen"} transparent>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Anexos</Text>
                    <TouchableOpacity onPress={() => setModalState(null)}>
                        <X size={20} color={theme.gray4} />
                    </TouchableOpacity>

                </View>
                <FlatList
                    data={data.annotationById?.attachments}
                    keyExtractor={(_, index) => index.toString()}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                    renderItem={({ item }) => (
                        <View style={[styles.attachment, { borderColor: color, backgroundColor: `${color}20` }]}>
                            <Text style={styles.text}>{item.title}</Text>
                            <TouchableOpacity onPress={() => downloadFile(item.url, item.title)}>
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
