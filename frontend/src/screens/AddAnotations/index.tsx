import { View, TextInput, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Paperclip, Tag, User, UserPlus, Users, X } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { styles } from './styles';
import { Button } from '@/components/button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '@/routes/app.routes';
import { ModalCategory } from '@/components/modalCategory';
import { useTask } from '@/hooks/useTask';

type NavigationProps = StackNavigationProp<StackParamList>;


export function AddAnnotations() {
    const [title, setTitle] = useState('');
    const navigation = useNavigation<NavigationProps>();
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

    const { selectedCategory, handleAddAnnotation } = useTask();

    const [content, setContent] = useState<{ type: 'text' | 'image'; value: string }[]>([
        { type: 'text', value: '' }
    ]);

    const isDisabled = !selectedCategory || title === ""

    async function addImageBlock() {
        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
            const updatedContent = [...content];
            updatedContent.push(
                { type: 'image', value: result.assets[0].uri },
                { type: 'text', value: '' }
            );
            setContent(updatedContent);
        }
    }

    function toggleSection(key: string) {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }


    function updateTextBlock(index: number, newText: string) {
        const updatedContent = [...content];
        updatedContent[index].value = newText;
        setContent(updatedContent);
    }

    function saveNote() {
        const formData = new FormData();

        formData.append("title", title);
        if (selectedCategory) formData.append("category", selectedCategory?._id);

        const contentData = content.filter((item) => item.value !== "")

        formData.append("content", JSON.stringify(contentData));

        content.forEach((block, index) => {
            if (block.type === 'image') {
                const uri = block.value as string;
                const fileName = uri.split('/').pop() || `photo_${index}.jpg`;
                const match = /\.(\w+)$/.exec(fileName);
                const ext = match?.[1];
                const mimeType = ext ? `image/${ext}` : `image`;

                formData.append('image', {
                    uri,
                    name: fileName,
                    type: mimeType,
                } as any);
            }
        });

        handleAddAnnotation(formData)
        handleBackToAnnotation()

    }

    function handleBackToAnnotation() {
        navigation.navigate('tabs', { screen: 'anotation' });
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Adicionar Anotação</Text>
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
                    if (block.type === 'text') {
                        return (
                            <View key={index} style={{ marginBottom: 20 }}>
                                <TextInput
                                    placeholder="Digite aqui..."
                                    value={block.value}
                                    onChangeText={(text) => updateTextBlock(index, text)}
                                    multiline
                                    style={styles.inputContent}
                                />
                            </View>
                        );
                    } else if (block.type === 'image') {
                        return (
                            <Image
                                key={index}
                                source={{ uri: block.value }}
                                style={{
                                    width: '100%',
                                    height: 200,
                                    marginBottom: 20,
                                    borderRadius: 10,
                                }}
                            />
                        );
                    }
                })}

                <View style={styles.containerButton}>
                    <TouchableOpacity onPress={addImageBlock}><Paperclip size={24} color={theme.gray4} /></TouchableOpacity>

                    <TouchableOpacity style={styles.buttonSelect} onPress={() => toggleSection("category")}>
                        <Tag size={24} color={theme.gray4} />
                        {selectedCategory !== undefined ? <Text>{selectedCategory?.category}</Text> : ""}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonSelect} onPress={() => toggleSection("member")}>
                        <UserPlus size={24} color={theme.gray4} />

                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonSelect} onPress={() => toggleSection("group")}>
                        <Users size={24} color={theme.gray4} />
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 20 }}>
                    <Button text="Criar Anotação" onPress={saveNote} disabled={isDisabled} style={{ opacity: isDisabled ? 0.5 : 1 }} />
                </View>
            </ScrollView>

            {openSections["category"] ?
                <ModalCategory isVisible={openSections["category"]} handleOnVisible={() => toggleSection("category")} />
                : ""}
        </View>
    );
}
