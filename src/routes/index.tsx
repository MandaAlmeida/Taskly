import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppRoutes } from "./app.routes";

export function Routes() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style="light" backgroundColor="#131016" translucent />
            <NavigationContainer >
                <AppRoutes />
            </NavigationContainer >
        </SafeAreaView>
    )
}