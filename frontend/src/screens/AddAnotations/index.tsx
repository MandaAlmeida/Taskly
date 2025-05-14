import { View, TextInput, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import { ImagePlus, Paperclip, Tag, UserPlus, Users, X } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { styles } from './styles';
import { Button } from '@/components/button';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '@/routes/app.routes';
import { ModalCategory } from '@/components/modalCategory';
import { useTask } from '@/hooks/useTask';
import { contentProps } from '@/@types/annotation';
import { ModalCreateMember } from '@/components/modalCreateMember';

type NavigationProps = StackNavigationProp<StackParamList>;
type AddAnnotationsRouteProp = RouteProp<StackParamList, 'addAnnotations'>;

export function AddAnnotations() {
    const route = useRoute<AddAnnotationsRouteProp>();
    const annotation = route.params?.annotation;
    const [title, setTitle] = useState(annotation?.title ?? '');
    const navigation = useNavigation<NavigationProps>();
    const { data, handleAddAnnotation, fetchAttachment, handleUpdateAnnotation, setData, handleAddMemberAnnotation, setModalState } = useTask();

    const [content, setContent] = useState<contentProps[]>(annotation?.content ?? [{ type: 'text', value: '' }]);

    useEffect(() => {
        async function fetchImageContent() {
            if (!annotation) return;

            const updatedContent = await Promise.all(
                annotation.content.map(async (item) => {
                    if (item.type === "image" && typeof item.value === 'string' && !item.value.startsWith("http")) {
                        const uri = await fetchAttachment(item.value); // <- await estava faltando aqui
                        return { ...item, value: uri };
                    }
                    return item;
                })
            );

            setContent(updatedContent);
        }

        fetchImageContent();
    }, [annotation]); // Este efeito só cuida das imagens

    const image = content.filter(cont => cont.type === "image").length;
    const [otherFiles, setOtherFiles] = useState<DocumentPicker.DocumentPickerAsset[]>(
        annotation?.attachments
            ? annotation.attachments.map((file) => ({
                uri: file.url,
                name: file.title,
                mimeType: file.type,
                file: undefined,
            }))
            : []
    );

    const isDisabled = !data.selectedCategory || title === "";

    async function addImageBlock() {
        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
            const updatedContent = [...content];
            updatedContent.push({ type: 'image', value: result.assets[0].uri }, { type: 'text', value: '' });
            setContent(updatedContent);
        }
    }

    async function replaceImage(index: number) {
        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
            const updatedContent = [...content];
            updatedContent[index] = { type: 'image', value: result.assets[0].uri };
            setContent(updatedContent);
        }
    }

    async function pickDocument() {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                multiple: false,
            });

            if (!result.canceled) {
                setOtherFiles(prev => [...prev, ...result.assets]);
            }
        } catch (err) {
            console.log('Error picking document:', err);
        }
    }

    function updateTextBlock(index: number, newText: string) {
        const updatedContent = [...content];
        updatedContent[index] = { ...updatedContent[index], value: newText };
        setContent(updatedContent);
    }

    function saveNote() {
        const formData = new FormData();

        formData.append("title", title);
        if (data.selectedCategory) formData.append("category", data.selectedCategory._id);

        const contentData = content.filter((item) => item.value !== "");
        formData.append("content", JSON.stringify(contentData));

        // Adiciona imagens, verificando se são novas
        content.forEach((block, index) => {
            if (block.type === 'image' && typeof block.value === 'string' && block.value.startsWith("file://")) {
                const uri = block.value;
                const fileName = uri.split('/').pop() || `photo_${index}.jpg`;
                const match = /\.(\w+)$/.exec(fileName);
                const ext = match?.[1];
                const mimeType = ext ? `image/${ext}` : `image/jpeg`;

                formData.append('files', {
                    uri,
                    name: fileName,
                    type: mimeType,
                } as any);
            }
        });

        // Adicionar documentos (attachments), verificando se são novos
        otherFiles.forEach((block, index) => {
            const uri = block.uri;
            const fileName = uri.split('/').pop() || `document_${index}.jpg`;;
            const mimeType = block.mimeType;

            // Verificar se o arquivo já está na anotação
            const alreadyAttached = annotation?.attachments?.some(att => att.url === fileName);

            // Só adiciona se não estiver na anotação
            if (!alreadyAttached) {
                formData.append('attachments', {
                    uri,
                    name: fileName,
                    type: mimeType,
                } as any);
            }
        });

        setContent([{ type: 'text', value: '' }]);

        if (annotation) {
            handleUpdateAnnotation(annotation._id, formData, handleBackToAnnotation);

            if (data.member) {
                handleAddMemberAnnotation(annotation._id, data.member, handleBackToAnnotation)
            }
        } else {
            handleAddAnnotation(formData);
        }


    }

    function handleBackToAnnotation() {
        navigation.navigate('tabs', { screen: 'anotation' });
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{annotation ? "Editar Anotação" : "Adicionar Anotação"}</Text>
                <TouchableOpacity onPress={handleBackToAnnotation}>
                    <X size={30} color={theme.gray4} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <TextInput
                    placeholder="Título"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                />

                {content.map((block, index) => {
                    if (!block || !block.type) {
                        console.warn(`Invalid block at index ${index}:`, block);
                        return null;
                    }

                    if (block.type === 'text') {
                        return (
                            <View key={index} style={{ marginBottom: 20 }}>
                                <TextInput
                                    placeholder="Digite aqui..."
                                    value={typeof block.value === 'string' ? block.value : ''}
                                    onChangeText={text => updateTextBlock(index, text)}
                                    multiline
                                    style={styles.inputContent}
                                />
                            </View>
                        );
                    }

                    if (block.type === 'image') {
                        // Verifica se é uma imagem que já existe no servidor (via attachment)
                        const foundImage = data.attachment.find(image => {
                            if (typeof block.value !== 'string') {
                                return image.title === block.value.title;
                            }
                            return false;
                        });

                        const imageUri = foundImage?.url ?? (typeof block.value === 'string' ? block.value : null);

                        if (imageUri) {
                            return (
                                <TouchableOpacity key={index} onPress={() => replaceImage(index)}>
                                    <Image
                                        source={{ uri: imageUri }}
                                        style={{
                                            width: '100%',
                                            height: 200,
                                            borderRadius: 8,
                                            marginBottom: 16,
                                        }}
                                        resizeMode="cover"
                                    />
                                    <Text style={{ textAlign: 'center', color: 'gray' }}>Toque para substituir</Text>
                                </TouchableOpacity>
                            );
                        }
                    }

                    return null;
                })}
            </ScrollView>
            <View style={styles.containerButton}>
                <TouchableOpacity style={styles.buttonSelect} onPress={addImageBlock}>
                    <ImagePlus size={24} color={theme.gray4} />
                    {content.length > 0 && <Text>{image}</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonSelect} onPress={pickDocument}>
                    <Paperclip size={24} color={theme.gray4} />
                    {otherFiles.length > 0 && <Text>{otherFiles.length}</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonSelect} onPress={() => setModalState({ name: 'isSelectCategoryOpen' })}>
                    <Tag size={24} color={theme.gray4} />
                    {data.selectedCategory && <Text>{data.selectedCategory.category}</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonSelect} onPress={() => setModalState({ name: 'isSelectGroupOpen' })}>
                    <UserPlus size={24} color={theme.gray4} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonSelect} onPress={() => setModalState({ name: 'isCreateMemberOpen' })}>
                    <Users size={24} color={theme.gray4} />
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
                <Button text={annotation ? "Editar Anotação" : "Criar Anotação"} onPress={saveNote} disabled={isDisabled} style={{ opacity: isDisabled ? 0.5 : 1 }} />
            </View>


            <ModalCategory />
            <ModalCreateMember />


        </View>


    );
}
