import { Pressable, Text, View } from "react-native"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons';
import React, { FC } from "react"
import { Download } from "../screens/download"
import { Mappa } from "../screens/mappa"
import { Route } from "../screens/route"

interface INavItem {
    props: any
    name: string
    icon: string
}

const NavItem: FC<INavItem> = ({props, name, icon}) => {
    return (
        <Pressable {...props}>
            <View style={{width:"70%", backgroundColor:"red"}}>
                <Icon name={icon} color="black" size={25}/>
                <Text>{name}</Text>
            </View>
        </Pressable>
    )
}


export const BottomTabsNavigation = () => {
    const Tab = createBottomTabNavigator()

    return (
        <Tab.Navigator
            screenOptions={{
                //headerShown: false,
                headerShown: true,
            }}
        >
            <Tab.Screen
                options={{
                    tabBarButton: (props) => <NavItem props={props} name={"Mappa"} icon={"map"}/>,
                    tabBarInactiveTintColor: 'tomato',
                    tabBarActiveTintColor: 'gray',
                }}
                name="Mappa"
                component={Mappa}
            />
            <Tab.Screen
                options={{
                    tabBarButton: (props) => <NavItem props={props} name={"Route"} icon={"location-outline"}/>,
                    tabBarInactiveTintColor: 'tomato',
                    tabBarActiveTintColor: 'gray',
                }}
                name="Route"
                component={Route}
            />
            <Tab.Screen
                options={{
                    tabBarButton: (props) => <NavItem props={props} name={"Download"} icon={"cloud-download-outline"} />,
                    tabBarInactiveTintColor: 'tomato',
                    tabBarActiveTintColor: 'gray',
                }}
                name="Download"
                component={Download}
            />
        </Tab.Navigator>
    )
}