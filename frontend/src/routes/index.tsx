import { NavigationContainer } from "@react-navigation/native";

import { useTask } from "@/hooks/useTask";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

import { Loading } from "@/components/loading";

export function Routes() {
    const { uiState, data } = useTask();

    return (
        <NavigationContainer>
            {uiState.loading ? <Loading /> : data.logado ? <AppRoutes /> : <AuthRoutes />}
        </NavigationContainer>
    );
}
