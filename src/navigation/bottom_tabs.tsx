import { Pressable, Text, View } from "react-native"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons';
import React, { FC } from "react"
import { Download } from "../screens/download"
import { Mappa } from "../screens/mappa"
import { Route } from "../screens/route"
import { colors } from "../utils/colors";
import { Settings } from "../screens/settings";

interface INavItem {
    props: any
    name: string
    icon: string
}

const NavItem: FC<INavItem> = ({props, name, icon}) => {
    return (
        <Pressable {...props}>
            <View style={{width:"70%", height:"100%", alignItems:"center", justifyContent:"center"}}>
                <Icon name={icon} color={props?.accessibilityState?.selected ? colors.primary : colors.light} size={30}/>
            </View>
        </Pressable>
    )
}


export const BottomTabsNavigation = () => {
    const Tab = createBottomTabNavigator()

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: { height: 70},
            }}
            sceneContainerStyle={{backgroundColor:colors.secondary}}
        >
            <Tab.Screen
                options={{
                    tabBarButton: (props) => <NavItem props={props} name={"Mappa"} icon={props?.accessibilityState?.selected ? "map" : "map-outline"}/>,
                    tabBarInactiveTintColor: colors.light,
                    tabBarActiveTintColor: colors.primary,
                }}
                name="Mappa"
                component={Mappa}
            />
            <Tab.Screen
                options={{
                    tabBarButton: (props) => <NavItem props={props} name={"Route"} icon={props?.accessibilityState?.selected ? "trail-sign" : "trail-sign-outline"}/>,
                    tabBarInactiveTintColor: colors.light,
                    tabBarActiveTintColor: colors.primary,
                }}
                name="Route"
                component={Route}
            />
            <Tab.Screen
                options={{
                    tabBarButton: (props) => <NavItem props={props} name={"Download"} icon={props?.accessibilityState?.selected ? "download" : "download-outline"} />,
                    tabBarInactiveTintColor: colors.light,
                    tabBarActiveTintColor: colors.primary,
                }}
                name="Download"
                component={Download}
            />
            <Tab.Screen
                options={{
                    tabBarButton: (props) => <NavItem props={props} name={"Settings"} icon={props?.accessibilityState?.selected ? "cog" : "cog-outline"} />,
                    tabBarInactiveTintColor: colors.light,
                    tabBarActiveTintColor: colors.primary,
                }}
                name="Settings"
                component={Settings}
            />
        </Tab.Navigator>
    )
}