import { TextInput, TextInputProps, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles";
import { Controller, UseControllerProps } from "react-hook-form"
import { forwardRef } from "react";
import clsx from "clsx";

type InputProps = {
    icon: keyof typeof Feather.glyphMap;
    formProps: UseControllerProps;
    inputProps: TextInputProps;
    error?: string
}

const InputForm = forwardRef<TextInput, InputProps>(({ icon, formProps, inputProps, error = "" }, ref) => {
    return (
        <Controller render={({ field }) => (
            <View style={styles.container}>
                <View style={[styles.group, {
                    borderColor: error.length > 0 ? "#DC1637" : error.length === 0 && field.value ?
                        "#4EA8DE" :
                        "#7C7C8A"
                }]}>
                    <View style={[styles.icon, {
                        borderRightColor: error.length > 0 ? "#DC1637" : error.length === 0 && field.value ?
                            "#4EA8DE" :
                            "#7C7C8A"
                    }]}>
                        <Feather
                            name={icon}
                            size={20}
                            color={clsx({
                                ["#DC1637"]: error.length > 0,
                                ["#4EA8DE"]: (error.length === 0 && field.value),
                                ["#7C7C8A"]: (!field.value && error.length === 0)
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