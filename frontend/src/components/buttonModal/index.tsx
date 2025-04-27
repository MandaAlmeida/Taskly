import { TouchableOpacity, View, Text } from "react-native"
import { styles } from "./styles"

type Props = {
    color: string;
    CreateItem: () => void;
    handleOnVisible?: () => void
}

export function ButtonModal({ color, CreateItem, handleOnVisible }: Props) {
    return (
        <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleOnVisible}>
                <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                CreateItem()
            }} style={[styles.confirmButton, { backgroundColor: color }]}>
                <Text style={styles.confirmText}>Salvar</Text>
            </TouchableOpacity>
        </View>
    )
}