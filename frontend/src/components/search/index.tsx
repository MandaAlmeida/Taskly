import { theme } from "@/styles/theme";
import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { useTask } from "@/hooks/useTask";
import { Search as SearchIcon } from 'lucide-react-native';

type SearchProps = {
    fetchSearch: (item: string) => void;
    placeholder: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    name: string
}

export function Search({ fetchSearch, placeholder, name, setName }: SearchProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.form}>
            <TouchableOpacity>
                <SearchIcon color={theme.gray2} size={24} />
            </TouchableOpacity>
            <TextInput
                style={[styles.input, isFocused && styles.inputFocused]}
                placeholder={placeholder}
                placeholderTextColor={theme.gray2}
                value={name}
                onChangeText={(text) => {
                    const onlyLetters = text.replace(/[^a-zA-Z\s]/g, '');
                    setName(onlyLetters);
                    fetchSearch(onlyLetters);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </View>
    )
}