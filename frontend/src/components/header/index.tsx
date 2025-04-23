import { View, Text, TouchableOpacity, Image } from "react-native";
import { AlignJustify } from 'lucide-react-native';
import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { useTask } from "@/hooks/useTask";
import { MenuListModal } from "../menuCategory";

type Props = {
    text: string
}

export function Header({ text }: Props) {
    const { setSelectedCategory, isCategoryOpen, setIsCategoryOpen, setIsGroupOpen, isGroupOpen, category, user } = useTask();

    function openModal() {
        if (text !== "Anotações") {
            setIsCategoryOpen(!isCategoryOpen)
        } else {
            setIsGroupOpen(!isGroupOpen)
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => openModal()}>
                <AlignJustify color={theme.gray4} size={24} />
            </TouchableOpacity>
            <Text style={styles.text}>{text}</Text>
            <TouchableOpacity>
                <Image
                    source={{ uri: user?.imageUser }}
                    style={styles.image}
                />

            </TouchableOpacity>

            <MenuListModal
                visible={isCategoryOpen}
                title="Categorias"
                data={category.filter(category => category.category !== "Todas")}
                onClose={() => setIsCategoryOpen(false)}
                onSelect={setSelectedCategory}
            />
            <MenuListModal
                visible={isGroupOpen}
                title="Grupo"
                data={category}
                onClose={() => setIsGroupOpen(false)}
                onSelect={setSelectedCategory}
            />
        </View>
    )
}