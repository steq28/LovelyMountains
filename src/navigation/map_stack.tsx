import React from "react"
import { createStackNavigator } from '@react-navigation/stack';
import { Mappa } from "../screens/mappa";
import { SearchScreen } from "../screens/search";
import { RootStackParamList } from "../utils/types";

const Stack = createStackNavigator<RootStackParamList>();

export const MapStack = () => {
  return (
    <Stack.Navigator
        screenOptions={{
            headerShown:false,
            animationEnabled:false
        }}
    >
        <Stack.Screen name="Mappa" component={Mappa}/>
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
    </Stack.Navigator>
  );
}