import { View, Image } from "react-native";

export function Header() {
    return (
        <View style={{ width: "100%", alignItems: "center" }}>
            <Image source={require('../../assets/logo.png')} />
        </View>
    )
}