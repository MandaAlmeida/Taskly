import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { FontAwesome, Octicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { theme } from '@/styles/theme';
import { Home } from "@/screens/Home";
import { PageTasks } from "@/screens/PageTasks";
import { AddTask } from "@/screens/AddTask";
import { AddCategory } from "@/screens/AddCategory";
import { Calendars } from "@/screens/Calendars";
import { Profile } from "@/screens/Profile";
import { styles } from "./styles";
import { NavigatorScreenParams, useNavigation } from "@react-navigation/native";
import { Anotation } from "@/screens/Anotation";

import { CalendarDays, House, ListChecks, NotepadText, Plus } from "lucide-react-native"

export type StackParamList = {
    tabs: NavigatorScreenParams<TabParamList>;
    addTask: undefined;
    addCategory: undefined;
    profile: undefined;
};

export type TabParamList = {
    home: undefined;
    tasks: undefined;
    calendar: undefined;
    anotation: undefined;
    addTask: undefined;
};



const Stack = createNativeStackNavigator<StackParamList>()
const Tab = createBottomTabNavigator<TabParamList>()

function BottomTabs() {
    const navigation = useNavigation();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: styles.tabBar,
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
                name="addTask"
                component={AddTask}
                options={{
                    tabBarButton: () => (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => navigation.navigate("addTask")}
                        >
                            <Plus size={24} color="white" />
                        </TouchableOpacity>
                    ),
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
                component={Anotation}
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
    )
}

export function AppRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="tabs" component={BottomTabs} />
            <Stack.Screen name="addTask" component={AddTask} />
            <Stack.Screen name="addCategory" component={AddCategory} />
            <Stack.Screen name="profile" component={Profile} />
        </Stack.Navigator>
    )
}
