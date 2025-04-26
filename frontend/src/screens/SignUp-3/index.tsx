import React, { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Image, Alert, ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';

import { useFormContext } from "react-hook-form";
import * as ImagePicker from 'expo-image-picker';

import { AccountProps } from "@/@types/account";
import { useTask } from "@/hooks/useTask";
import { Button } from "@/components/button";

import { styles } from "./styles";
import { theme } from '@/styles/theme';
import { Progress } from "@/components/progress";

export function SignUp3() {
    const { createUser } = useTask();
    const { handleSubmit } = useFormContext<AccountProps>();
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const { navigate } = useNavigation();

    const isDisabled = !image;

    async function pickerImage() {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!granted) {
            Alert.alert('Permissão necessária', 'Permita que sua aplicação acesse as imagens');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: false,
            aspect: [4, 4],
            quality: 1,
        });

        if (result.canceled) {
            ToastAndroid.show('Operação cancelada', ToastAndroid.SHORT);
        } else {
            setImage(result.assets[0]);
        }
    }

    function handleLogin() {
        navigate("signIn");
    }

    function handleNextWelcome() {
        navigate("welcome");
    }

    function handlePreviousPage() {
        navigate("signUp2");
    }

    async function handleNextPage(user: AccountProps) {
        if (!image) return; // Verifica se a imagem foi selecionada.

        const formData = new FormData();
        formData.append("nameUser", user.userName); // ou "nameUser" se for assim no DTO
        formData.append("name", user.name);
        formData.append("birth", user.birth);
        formData.append("email", user.email);
        formData.append("password", user.password);
        formData.append("passwordConfirmation", user.passwordConfirmation);

        // A imagem deve ser um objeto no formato correto
        formData.append("file", {
            uri: image.uri,
            name: image.fileName ?? "image.jpg",
            type: image.type ?? "image/jpeg",
        } as any);


        try {
            createUser(formData, handleLogin); // Passando formData para o backend
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
        }
    }


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.previous} onPress={handleNextWelcome}>
                <Feather name="chevron-left" size={30} color={theme.gray4} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.title}>Registro</Text>

                <View style={styles.containerImage}>
                    <Text style={styles.textImage}>Imagem de Perfil</Text>
                    <TouchableOpacity style={styles.inputImage} onPress={pickerImage}>
                        {image ? (
                            <Image
                                source={{ uri: image.uri }}
                                style={{ width: "100%", height: "100%", borderRadius: 100 }}
                            />
                        ) : (
                            <Text style={styles.textImage}>
                                Escolher uma imagem
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.containerButton}>
                    <Button text="VOLTAR" onPress={handlePreviousPage} style={[styles.button, { width: 150 }]} />
                    <Button text="CONTINUAR" onPress={handleSubmit(handleNextPage)} style={[styles.button, { opacity: isDisabled ? 0.5 : 1, width: 150 }]} disabled={isDisabled} />
                </View>
                <Progress count={3} />
            </ScrollView>

            <View style={styles.register}>
                <Text style={styles.text}>Já tem uma conta?</Text>
                <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.link}>Faça login.</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
