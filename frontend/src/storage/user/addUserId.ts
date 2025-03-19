import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER } from "../storageConfig";

export async function addUserID(user: string) {
    try {
        await AsyncStorage.setItem(USER, JSON.stringify(user));
    } catch (error) {
        console.error("Erro ao recuperar o user:", error);
        throw error;
    }
}
