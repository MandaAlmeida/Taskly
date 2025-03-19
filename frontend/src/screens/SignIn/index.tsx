import { Text, View, TextInput, TouchableOpacity, ToastAndroid, Platform } from "react-native";
import { styles } from "./styles";
import { InputForm } from "@/components/inputForm";
import { useRef } from "react";

import { AccountProps } from "@/@types/account";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button";

import { theme } from '@/styles/theme';
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';
import { useTask } from "@/hooks/useTask";


export function SignIn() {
    const { control, handleSubmit, formState: { errors }, watch } = useForm<AccountProps>();
    const { login } = useTask();
    const emailRef = useRef<TextInput>(null);
    const { navigate } = useNavigation();

    const email = watch("email");
    const password = watch("password");
    const isDisabled = !email || !password;

    console.log(isDisabled)

    function handleRegister() {
        navigate("signUp");
    }


    function handleNextWelcome() {
        navigate("welcome");
    }


    function handleNextStep(data: AccountProps) {
        login(data.email, data.password)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.previous} onPress={handleNextWelcome} >
                <Feather name="chevron-left" size={30} color={theme.gray4} />
            </TouchableOpacity>
            <View style={styles.form}>
                <Text style={styles.title}>Login</Text>
                <InputForm
                    ref={emailRef}
                    text="Email"
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
                    text="Senha"
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
                <Button text="Fazer login" onPress={handleSubmit(handleNextStep)} style={[styles.button, { opacity: isDisabled ? 0.5 : 1 }]} disabled={isDisabled} />

            </View>
            <View style={styles.register}>
                <Text style={styles.text}>Não tem uma conta?</Text>
                <TouchableOpacity onPress={handleRegister}>
                    <Text style={styles.link}>Crie uma agora!</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
