import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SignIn } from "../screens/SignIn";
import { SignUp1 } from "../screens/SignUp-1";
import { Onboading1 } from "@/screens/Onboading-1";
import { Onboading2 } from "@/screens/Onboading-2";
import { Onboading3 } from "@/screens/Onboading-3";
import { Welcome } from "@/screens/Welcome";
import { SignUp3 } from "@/screens/SignUp-3";
import { SignUp2 } from "@/screens/SignUp-2";


type AuthRoutes = {
    onboading1: undefined;
    onboading2: undefined;
    onboading3: undefined;
    welcome: undefined;
    signIn: undefined;
    signUp1: undefined;
    signUp2: undefined;
    signUp3: undefined;
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
            <Screen name="signUp1" component={SignUp1} />
            <Screen name="signUp2" component={SignUp2} />
            <Screen name="signUp3" component={SignUp3} />
        </Navigator>

    )
}