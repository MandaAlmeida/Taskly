import { View, Text, TouchableOpacity, Image } from "react-native";
import { AlignJustify } from 'lucide-react-native';
import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { useTask } from "@/hooks/useTask";
import { MenuListModal } from "../menuListModal";
import { useNavigation } from "@react-navigation/native";
import { CategoryProps } from "@/@types/category";
import { useEffect } from "react";
import { AddCategory } from "../addGroupAndCategory/addCategory";
import { AddGroup } from "../addGroupAndCategory/addGrop";

type Props = {
    text: string;
};

export function Header({ text }: Props) {
    const {
        data,
        setModalState,
        modalState,
    } = useTask();

    const { navigate } = useNavigation();

    // Função que abre ou fecha os modais conforme o texto
    function openModal() {
        if (text !== "Anotações") {
            setModalState("isCategoryOpen");
        } else {
            setModalState("isGroupOpen");
        }
    }

    // Função de navegação para o perfil
    function handleProfile() {
        navigate("profile");
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={openModal}>
                <AlignJustify color={theme.gray4} size={24} />
            </TouchableOpacity>
            <Text style={styles.text}>{text}</Text>
            <TouchableOpacity onPress={handleProfile}>
                <Image
                    source={{ uri: data.user?.imageUser }}
                    style={styles.image}
                />
            </TouchableOpacity>

            {/* Modal para categorias */}
            <MenuListModal
                visible={modalState === "isCategoryOpen"}
                title="Categorias"
                items={data.categories.filter(category => category.category !== "Todas")}
                onClose={() => setModalState(null)}
                onAddNewItem={() => setModalState("isCreateCategoryOpen")}
                showDefaultItem={false} // Mostra o item "Todas" apenas se necessário
            />

            {/* Modal para grupos */}
            <MenuListModal
                visible={modalState === "isGroupOpen"}
                title="Grupo"
                items={data.groups}
                onClose={() => setModalState(null)}
                onAddNewItem={() => setModalState("isCreateGroupOpen")}
                showDefaultItem={false} // Se quiser exibir algo específico para o grupo, passe `true`
            />

            <AddCategory title="Categoria" />
            <AddGroup />
        </View>
    );
}
