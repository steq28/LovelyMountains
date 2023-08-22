import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import React from "react";
import { Download } from "../screens/download";
import { Route } from "../screens/route";
import { BottomTabsNavigation } from "./bottom_tabs";

const Tab = createBottomTabNavigator();

export const Navigation = ()=>{
    return (
        <NavigationContainer>
            <BottomTabsNavigation/>
        </NavigationContainer>
    )
}