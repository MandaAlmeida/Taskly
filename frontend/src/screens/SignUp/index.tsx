import { Text, View, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { InputForm } from "@/components/inputForm";
import { useRef } from "react";

import { AccountProps } from "@/@types/account";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button";

import { styles } from "./styles";
import { theme } from '@/styles/theme';
import { Feather } from '@expo/vector-icons';
import { useTask } from "@/hooks/useTask";

export function SignUp() {
    const { createUser } = useTask();
    const { control, handleSubmit, formState: { errors }, getValues, watch } = useForm<AccountProps>();
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const passwordConfirmationRef = useRef<TextInput>(null);

    const { navigate } = useNavigation();

    const name = watch("name");
    const email = watch("email");
    const password = watch("password");
    const passwordConfirmation = watch("passwordConfirmation");
    const isDisabled = !email || !password || !name || !passwordConfirmation

    console.log(isDisabled)

    function handleLogin() {
        navigate("signIn");
    }

    async function handleNextStep(data: AccountProps) {
        await createUser(data.name, data.email, data.password, data.passwordConfirmation);
    }


    function validationPasswordConfirmation(passwordConfirmation: string) {
        const { password } = getValues();

        return password === passwordConfirmation || "As senhas devem ser iguais"
    }


    function handleRegister() {
        navigate("signUp");
    }


    function handleNextWelcome() {
        navigate("welcome");
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.previous} onPress={handleNextWelcome} >
                <Feather name="chevron-left" size={30} color={theme.gray4} />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.title}>Registro</Text>

                <InputForm
                    text="Nome"
                    formProps={{
                        name: "name",
                        control,
                        rules: {
                            required: "Nome é obrigatório"
                        }
                    }}
                    inputProps={{
                        placeholder: "Nome",
                        placeholderTextColor: theme.gray2,
                        onSubmitEditing: () => emailRef.current?.focus(),
                        returnKeyType: "next",
                    }}
                    error={errors.name?.message}
                />
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
                        onSubmitEditing: () => passwordRef.current?.focus(),
                    }}
                    error={errors.email?.message}
                />
                <InputForm
                    ref={passwordRef}
                    text="Senha"
                    formProps={{
                        name: "password",
                        control,
                        rules: {
                            required: "Senha é obrigatório",
                            minLength: {
                                value: 6,
                                message: "Senha deve ter pelo menos 6 digitos"
                            }
                        }
                    }}
                    inputProps={{
                        placeholder: "Senha",
                        placeholderTextColor: theme.gray2,
                        onSubmitEditing: () => passwordConfirmationRef.current?.focus(),
                        returnKeyType: "next",
                        secureTextEntry: true
                    }}
                    error={errors.password?.message}
                />
                <InputForm
                    ref={passwordConfirmationRef}
                    text="Confirmar senha"
                    formProps={{
                        name: "passwordConfirmation",
                        control,
                        rules: {
                            required: "Confirme a senha",
                            validate: validationPasswordConfirmation
                        }
                    }}
                    inputProps={{
                        placeholder: "Confirme sua senha",
                        placeholderTextColor: theme.gray2,
                        onSubmitEditing: handleSubmit(handleNextStep),
                        secureTextEntry: true
                    }}
                    error={errors.passwordConfirmation?.message}
                />

                <Button text="Criar conta" onPress={handleSubmit(handleNextStep)} style={[styles.button, { opacity: isDisabled ? 0.5 : 1 }]} disabled={isDisabled} />
            </ScrollView>
            <View style={styles.register}>
                <Text style={styles.text}>Já tem uma conta?</Text>
                <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.link}>Faça login.</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
