import React from "react"
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { Settings } from "../screens/settings";
import { Lingua } from "../screens/settings/lingua";

const Stack = createStackNavigator();


export const SettingsStack = () => {
  return (
    <Stack.Navigator
        screenOptions={{
            headerShown:false,
            ...TransitionPresets.SlideFromRightIOS,
        }}
    >
        <Stack.Screen name="Settings" component={Settings}/>
        <Stack.Screen name="Lingua" component={Lingua} />
    </Stack.Navigator>
  );
}