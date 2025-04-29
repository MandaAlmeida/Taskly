import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN } from "../storageConfig";

export async function addToken(token: string) {
    try {
        await AsyncStorage.setItem(TOKEN, JSON.stringify(token));
    } catch (error) {
        console.log("Erro ao recuperar o token:", error);
        throw error;
    }
}
