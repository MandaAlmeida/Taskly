import { Text, View, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";

import { InputForm } from "@/components/inputForm";
import { useRef } from "react";

import { AccountProps } from "@/@types/account";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button";
import { styles } from "./styles";

export function SignUp() {
    const { control, handleSubmit, formState: { errors }, getValues } = useForm<AccountProps>();
    const emailRef = useRef<TextInput>(null);
    const passwordConfirmationRef = useRef<TextInput>(null);

    function handleNextStep(data: AccountProps) {
        console.log(data)
    }

    function validationPasswordConfirmation(passwordConfirmation: string) {
        const { password } = getValues();

        return password === passwordConfirmation || "As senhas devem ser iguais"
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo.png')} />
            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.title}>Acesse sua conta</Text>

                <InputForm
                    icon="user"
                    formProps={{
                        name: "name",
                        control,
                        rules: {
                            required: "Nome é obrigatório"
                        }
                    }}
                    inputProps={{
                        placeholder: "Nome",
                        placeholderTextColor: "#7C7C8A",
                        onSubmitEditing: () => emailRef.current?.focus(),
                        returnKeyType: "next",
                    }}
                    error={errors.name?.message}
                />
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
                        placeholderTextColor: "#7C7C8A",
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
                            minLength: {
                                value: 6,
                                message: "Senha deve ter pelo menos 6 digitos"
                            }
                        }
                    }}
                    inputProps={{
                        placeholder: "Senha",
                        placeholderTextColor: "#7C7C8A",
                        onSubmitEditing: () => passwordConfirmationRef.current?.focus(),
                        returnKeyType: "next",
                        secureTextEntry: true
                    }}
                    error={errors.password?.message}
                />
                <InputForm
                    ref={passwordConfirmationRef}
                    icon="lock"
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
                        placeholderTextColor: "#7C7C8A",
                        onSubmitEditing: handleSubmit(handleNextStep),
                        secureTextEntry: true
                    }}
                    error={errors.passwordConfirmation?.message}
                />

                <Button text="Criar conta" onPress={handleSubmit(handleNextStep)} style={{ width: "100%", backgroundColor: "#4EA8DE" }} />
                <View style={styles.register}>
                    <Text style={styles.text}>Você ja possui uma conta?</Text>
                    <TouchableOpacity>
                        <Text style={styles.link}>Entrar na conta</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}
