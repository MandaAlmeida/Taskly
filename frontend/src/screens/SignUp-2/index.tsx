import { Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { InputForm } from "@/components/inputForm";
import { useRef, useState } from "react";

import { AccountProps } from "@/@types/account";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/button";

import { styles } from "./styles";
import { theme } from '@/styles/theme';
import { Feather } from '@expo/vector-icons';
import { Progress } from "@/components/progress";
import { EyeIcon, EyeOff } from "lucide-react-native";

export function SignUp2() {
    const { control, formState: { errors }, getValues, watch, handleSubmit } = useFormContext<AccountProps>();
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const passwordConfirmationRef = useRef<TextInput>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { navigate } = useNavigation();

    const email = watch("email");
    const password = watch("password");
    const passwordConfirmation = watch("passwordConfirmation");
    const isDisabled = !email || !password || !passwordConfirmation;

    function handleLogin() {
        navigate("signIn");
    }

    function handleNextPage() {
        navigate("signUp3");
    }

    function handlePreviousPage() {
        navigate("signUp1");
    }

    function handleNextWelcome() {
        navigate("welcome");
    }

    function validationPasswordConfirmation(passwordConfirmation: string) {
        const { password } = getValues();
        return password === passwordConfirmation || "As senhas devem ser iguais";
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.previous} onPress={handleNextWelcome}>
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
                            required: "Senha é obrigatória",
                            minLength: {
                                value: 8,
                                message: "Senha deve ter pelo menos 8 caracteres"
                            },
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
                                message: "A senha deve conter letra maiúscula, minúscula, número e símbolo"
                            }
                        }
                    }}
                    inputProps={{
                        placeholder: "Senha",
                        placeholderTextColor: theme.gray2,
                        onSubmitEditing: () => passwordConfirmationRef.current?.focus(),
                        returnKeyType: "next",
                        secureTextEntry: !showPassword
                    }}
                    rightIcon={
                        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                            {showPassword ? <EyeIcon size={20} color={theme.gray3} /> : <EyeOff size={20} color={theme.gray3} />}
                        </TouchableOpacity>
                    }
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
                            validate: (value) => {
                                const password = getValues("password");
                                return value === password || "As senhas devem ser iguais";
                            }

                        }
                    }}
                    inputProps={{
                        placeholder: "Confirme sua senha",
                        placeholderTextColor: theme.gray2,
                        secureTextEntry: !showPasswordConfirmation
                    }}
                    rightIcon={
                        <TouchableOpacity onPress={() => setShowPasswordConfirmation(prev => !prev)}>
                            <Feather name={showPasswordConfirmation ? "eye" : "eye-off"} size={20} color={theme.gray3} />
                        </TouchableOpacity>
                    }
                    error={errors.passwordConfirmation?.message}
                />

                <View style={styles.containerButton}>
                    <Button text="VOLTAR" onPress={handlePreviousPage} style={[styles.button, { width: 150 }]} />
                    <Button
                        text="CONTINUAR"
                        onPress={handleSubmit(handleNextPage)}
                        style={[styles.button, { opacity: isDisabled ? 0.5 : 1, width: 150 }]}
                        disabled={isDisabled}
                    />
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
    );
}
