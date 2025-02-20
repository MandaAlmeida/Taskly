import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { InputForm } from "@/components/inputForm";
import { useRef } from "react";

import { AccountProps } from "@/@types/account";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button";

import { theme } from '@/styles/theme';
import { useNavigation } from "@react-navigation/native";
import { Header } from "@/components/header";


export function SignIn() {
    const { control, handleSubmit, formState: { errors } } = useForm<AccountProps>();
    const emailRef = useRef<TextInput>(null);
    const { navigate } = useNavigation();

    function handleRegister() {
        navigate("signUp");
    }

    function handleNextStep(data: AccountProps) {
        console.log(data)
    }

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.form}>
                <Text style={styles.title}>Acesse sua conta</Text>
                <InputForm
                    ref={emailRef}
                    icon="mail"
                    formProps={{
                        name: "email",
                        control,
                        rules: {
                            required: "Email é obrigatório",
                            pattern: {
                                value: /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+$/i,
                                message: "E-mail inválido."
                            }
                        }
                    }}
                    inputProps={{
                        placeholder: "E-mail",
                        placeholderTextColor: theme.gray2,
                    }}
                    error={errors.email?.message}
                />
                <InputForm
                    icon="lock"
                    formProps={{
                        name: "password",
                        control,
                        rules: {
                            required: "Senha é obrigatório",
                        }
                    }}
                    inputProps={{
                        placeholder: "Senha",
                        placeholderTextColor: theme.gray2,
                        secureTextEntry: true
                    }}
                    error={errors.password?.message}
                />
                <Button text="Fazer login" onPress={handleSubmit(handleNextStep)} style={{ width: "100%", backgroundColor: theme.blue1 }} />
                <View style={styles.register}>
                    <Text style={styles.text}>Você não possui uma conta?</Text>
                    <TouchableOpacity onPress={handleRegister}>
                        <Text style={styles.link}>Criar conta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
