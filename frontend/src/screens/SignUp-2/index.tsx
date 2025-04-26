import { Text, View, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { InputForm } from "@/components/inputForm";
import { useRef } from "react";

import { AccountProps } from "@/@types/account";
import { useForm, useFormContext } from "react-hook-form";
import { Button } from "@/components/button";

import { styles } from "./styles";
import { theme } from '@/styles/theme';
import { Feather } from '@expo/vector-icons';
import { useTask } from "@/hooks/useTask";
import { Progress } from "@/components/progress";

export function SignUp2() {
    const { error } = useTask();
    const { control, formState: { errors }, getValues, watch, handleSubmit } = useFormContext<AccountProps>();
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const passwordConfirmationRef = useRef<TextInput>(null);

    const { navigate } = useNavigation();

    const email = watch("email");
    const password = watch("password");
    const passwordConfirmation = watch("passwordConfirmation");
    const isDisabled = !email || !password || !passwordConfirmation

    function handleLogin() {
        navigate("signIn");
    }

    function handleNextPage() {
        navigate("signUp3");
    }

    function handlePreviousPage() {
        navigate("signUp1");
    }



    function validationPasswordConfirmation(passwordConfirmation: string) {
        const { password } = getValues();

        return password === passwordConfirmation || "As senhas devem ser iguais"
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
                        secureTextEntry: true
                    }}
                    error={errors.passwordConfirmation?.message}
                />
                {error && <Text style={styles.error}>Usuario ja cadastrado</Text>}
                <View style={styles.containerButton}>
                    <Button text="VOLTAR" onPress={() => handlePreviousPage()} style={[styles.button, { width: 150 }]} />
                    <Button text="CONTINUAR" onPress={handleSubmit(handleNextPage)} style={[styles.button, { opacity: isDisabled ? 0.5 : 1, width: 150 }]} disabled={isDisabled} />
                </View>
                <Progress count={2} />

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
