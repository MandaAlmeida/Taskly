import { View, Text, TouchableOpacity, Image } from "react-native";
import { AlignJustify } from 'lucide-react-native';
import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { useTask } from "@/hooks/useTask";
import { MenuListModal } from "../menuListModal";
import { useNavigation } from "@react-navigation/native";
import { AddCategory } from "../addGroupAndCategory/addCategory";
import { AddGroup } from "../addGroupAndCategory/addGrop";
import { ModalList } from "../modalListCategoryOrGroup";

type Props = {
    text: string;
};

export function Header({ text }: Props) {
    const {
        data,
        setModalState,
        modalState,
        setData
    } = useTask();

    const { navigate } = useNavigation();

    // Função que abre ou fecha os modais conforme o texto
    function openModal() {
        if (text !== "Anotações") {
            setModalState({ name: "isMenuCategoryOpen" });
        } else {
            setModalState({ name: "isMenuGroupOpen" });
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
                visible={modalState.name === "isMenuCategoryOpen"}
                title="Categorias"
                items={data.categories.filter(category => category.category !== "Todas")}
                onClose={() => setModalState({ name: null })}
                onAddNewItem={() => setModalState({ name: "isCategoryOpen" })}
                onSelect={item => setData(prevData => ({ ...prevData, selectedFilterCategory: item }))}
                showDefaultItem={false} // Mostra o item "Todas" apenas se necessário
            />

            <ModalList
                data={data.categories.filter(category => category.category !== "Todas")}
                onAdd={() => setModalState({ name: "isCreateCategoryOpen" })}
                onClose={() => setModalState({ name: "isMenuCategoryOpen" })}
                title="categoria"
                visible={modalState.name === "isCategoryOpen"}
            />

            <AddCategory title="Categoria" />

            {/* Modal para grupos */}
            <MenuListModal
                visible={modalState.name === "isMenuGroupOpen"}
                title="Grupo"
                items={data.groups}
                onClose={() => setModalState({ name: null })}
                onAddNewItem={() => setModalState({ name: "isGroupOpen" })}
                onSelect={item => setData(prevData => ({ ...prevData, selectedGroup: item }))}
                showDefaultItem={false} // Se quiser exibir algo específico para o grupo, passe `true`
            />

            <ModalList
                data={data.groups}
                onAdd={() => setModalState({ name: "isCreateGroupOpen" })}
                onClose={() => setModalState({ name: "isMenuGroupOpen" })}
                title="grupo"
                visible={modalState.name === "isGroupOpen"}
            />

            <AddGroup />
        </View>
    );
}
