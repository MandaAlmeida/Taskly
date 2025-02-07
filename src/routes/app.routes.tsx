import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from '@expo/vector-icons';
import { Tasks } from "@/screens/Tasks";
import { AddTask } from "@/screens/AddTask";
import { AddCategory } from "@/screens/AddCategory";

type AppRoutes = {
    tasks: undefined;
    addTask: undefined;
    addCategory: undefined;
};


const Tab = createBottomTabNavigator<AppRoutes>();
const Stack = createNativeStackNavigator<AppRoutes>();

function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="tasks" component={Tasks} />
            <Stack.Screen name="addTask" component={AddTask} />
            <Stack.Screen name="addCategory" component={AddCategory} />
        </Stack.Navigator>
    );
}

export function AppRoutes() {
    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarHideOnKeyboard: true,
                    animation: "fade",
                    tabBarStyle: {
                        backgroundColor: "#4EA8DE",
                        borderTopWidth: 0,
                        paddingBottom: 10,
                        paddingTop: 5,
                        height: 60,
                        flexDirection: "row",
                        justifyContent: "space-around",
                    },
                }}
            >
                <Tab.Screen
                    name="tasks"
                    component={StackNavigator}
                    options={{
                        tabBarIcon: () => <Feather name="list" size={26} color="#fdfcfe" />,
                    }}
                />
            </Tab.Navigator>
        </>
    );
}
