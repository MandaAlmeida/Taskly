import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SignIn } from "../screens/SignIn";
import { SignUp } from "../screens/SignUp";
import { Onboading1 } from "@/screens/Onboading-1";
import { Onboading2 } from "@/screens/Onboading-2";
import { Onboading3 } from "@/screens/Onboading-3";
import { Welcome } from "@/screens/Welcome";


type AuthRoutes = {
    onboading1: undefined;
    onboading2: undefined;
    onboading3: undefined;
    welcome: undefined;
    signIn: undefined;
    signUp: undefined;
}

export type AuthNavidatorRoutesProps = NativeStackNavigationProp<AuthRoutes>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="onboading1" component={Onboading1} />
            <Screen name="onboading2" component={Onboading2} />
            <Screen name="onboading3" component={Onboading3} />
            <Screen name="welcome" component={Welcome} />
            <Screen name="signIn" component={SignIn} />
            <Screen name="signUp" component={SignUp} />
        </Navigator>

    )
}