import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SignIn } from "../screens/SignIn";
import { SignUp } from "../screens/SignUp";
import { Onboading1 } from "@/screens/Onboading-1";

type AuthRoutes = {
    onboading1: undefined;
    onboading2: undefined;
    onboading3: undefined;
    signIn: undefined;
    signUp: undefined;
}

export type AuthNavidatorRoutesProps = NativeStackNavigationProp<AuthRoutes>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="onboading1" component={Onboading1} />
            <Screen name="signIn" component={SignIn} />
            <Screen name="signUp" component={SignUp} />
        </Navigator>

    )
}