import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER } from "../storageConfig";

export async function getUserID() {
    try {
        const id = await AsyncStorage.getItem(USER);
        return id;
    } catch (error) {
        console.log("Erro ao recuperar o id:", error);
        throw error;
    }
}
