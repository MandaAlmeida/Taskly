import { TextInput, TextInputProps, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles";
import { Controller, UseControllerProps } from "react-hook-form"
import { forwardRef } from "react";
import clsx from "clsx";
import { theme } from '@/styles/theme';
import { AccountProps } from "@/@types/account";

type InputProps = {
    icon: keyof typeof Feather.glyphMap;
    formProps: UseControllerProps<AccountProps>;
    inputProps: TextInputProps;
    error?: string
}

const InputForm = forwardRef<TextInput, InputProps>(({ icon, formProps, inputProps, error = "" }, ref) => {
    return (
        <Controller render={({ field }) => (
            <View style={styles.container}>
                <View style={[styles.group, {
                    borderColor: error.length > 0 ? theme.red : error.length === 0 && field.value ?
                        theme.blue1 :
                        theme.gray2
                }]}>
                    <View style={[styles.icon, {
                        borderRightColor: error.length > 0 ? theme.red : error.length === 0 && field.value ?
                            theme.blue1 :
                            theme.gray2
                    }]}>
                        <Feather
                            name={icon}
                            size={20}
                            color={clsx({
                                [theme.red]: error.length > 0,
                                [theme.blue1]: (error.length === 0 && field.value),
                                [theme.gray2]: (!field.value && error.length === 0)
                            })} />
                    </View>
                    <TextInput
                        ref={ref}
                        value={field.value}
                        onChangeText={field.onChange}
                        style={styles.control}
                        {...inputProps}
                    />
                </View>
                {error.length > 0 ? <Text style={styles.error}>{error}</Text> : ""}

            </View>
        )}
            {...formProps}
        />
    )
})

export { InputForm };