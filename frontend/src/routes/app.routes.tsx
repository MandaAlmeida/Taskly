import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute, NavigatorScreenParams } from "@react-navigation/native";
import { theme } from '@/styles/theme';
import { Home } from "@/screens/Home";
import { PageTasks } from "@/screens/PageTasks";
import { AddTask } from "@/screens/AddTask";
import { Calendars } from "@/screens/Calendars";
import { Profile } from "@/screens/Profile";
import { Anotations } from "@/screens/Anotations";
import { AddAnnotations } from "@/screens/AddAnotations";
import { FloatingActionButton } from "@/components/FloatingActionButton"; // ajuste o caminho se necessário
import { CalendarDays, House, ListChecks, NotepadText } from "lucide-react-native";
import { styles } from "./styles";
import { AnnotationProps } from "@/@types/annotation";

export type StackParamList = {
    tabs: NavigatorScreenParams<TabParamList>;
    addTask: undefined;
    addAnnotations: { annotation?: AnnotationProps };
    profile: undefined;
};

export type TabParamList = {
    home: undefined;
    tasks: undefined;
    calendar: undefined;
    anotation: undefined;
    addTask: undefined;
    addAnnotations: { annotation?: AnnotationProps };
};

const Stack = createNativeStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function BottomTabs({ route }: { route: any }) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'home';

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: [styles.tabBar],
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.button, { backgroundColor: focused ? "rgba(244, 244, 244, 0.2)" : "transparent" }]}>
                            <House size={22} color={theme.white} />
                            <Text style={styles.text}>Início</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="tasks"
                component={PageTasks}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.button, { backgroundColor: focused ? "rgba(244, 244, 244, 0.2)" : "transparent" }]}>
                            <ListChecks size={24} color={theme.white} />
                            <Text style={styles.text}>Tarefa</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name={routeName === "anotation" ? "addTask" : "addAnnotations"}
                component={routeName === "anotation" ? AddTask : AddAnnotations}
                options={{
                    tabBarButton: () => <FloatingActionButton />,
                }}
            />
            <Tab.Screen
                name="calendar"
                component={Calendars}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.button, { backgroundColor: focused ? "rgba(244, 244, 244, 0.2)" : "transparent" }]}>
                            <CalendarDays size={24} color={theme.white} />
                            <Text style={styles.text}>Calendário</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="anotation"
                component={Anotations}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.button, { backgroundColor: focused ? "rgba(244, 244, 244, 0.2)" : "transparent" }]}>
                            <NotepadText size={24} color={theme.white} />
                            <Text style={styles.text}>Anotações</Text>
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export function AppRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="tabs" component={BottomTabs} />
            <Stack.Screen name="addTask" component={AddTask} />
            <Stack.Screen name="addAnnotations" component={AddAnnotations} />
            <Stack.Screen name="profile" component={Profile} />
        </Stack.Navigator>
    );
}
