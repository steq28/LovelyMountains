import {Pressable, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {FC} from 'react';
import {Download} from '../screens/download';
import {Route} from '../screens/route/route';
import {RouteStack} from './route_stack';
import {colors} from '../utils/colors';
import {Settings} from '../screens/settings';
import {MapStack} from './map_stack';
import {SettingsStack} from './settings_stack';
import { TransitionPresets } from '@react-navigation/stack';

interface INavItem {
  props: any;
  name: string;
  icon: string;
}

const NavItem: FC<INavItem> = ({props, icon}) => {
  return (
    <Pressable {...props}>
      <View
        style={{
          width: '70%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon
          name={icon}
          color={
            props?.accessibilityState?.selected ? colors.primary : colors.light
          }
          size={30}
        />
      </View>
    </Pressable>
  );
};

export const BottomTabsNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {height: 70, borderTopWidth: 0},
      }}
      sceneContainerStyle={{backgroundColor: colors.secondary}}>
      <Tab.Screen
        options={{
          tabBarButton: props => (
            <NavItem
              props={props}
              name={'Mappa'}
              icon={props?.accessibilityState?.selected ? 'map' : 'map-outline'}
            />
          ),
          tabBarInactiveTintColor: colors.light,
          tabBarActiveTintColor: colors.primary,
        }}
        name="MapStack"
        component={MapStack}
      />
      <Tab.Screen
        options={{
          tabBarButton: props => (
            <NavItem
              props={props}
              name={'RouteStack'}
              icon={
                props?.accessibilityState?.selected
                  ? 'trail-sign'
                  : 'trail-sign-outline'
              }
            />
          ),
          tabBarInactiveTintColor: colors.light,
          tabBarActiveTintColor: colors.primary,
        }}
        name="RouteStack"
        component={RouteStack}
      />
      <Tab.Screen
        options={{
          tabBarButton: props => (
            <NavItem
              props={props}
              name={'Download'}
              icon={
                props?.accessibilityState?.selected
                  ? 'arrow-down-circle'
                  : 'arrow-down-circle-outline'
              }
            />
          ),
          tabBarInactiveTintColor: colors.light,
          tabBarActiveTintColor: colors.primary,
        }}
        name="Download"
        component={Download}
      />
      <Tab.Screen
        options={{
          tabBarButton: props => (
            <NavItem
              props={props}
              name={'Settings'}
              icon={props?.accessibilityState?.selected ? 'cog' : 'cog-outline'}
            />
          ),
          tabBarInactiveTintColor: colors.light,
          tabBarActiveTintColor: colors.primary,
        }}
        name="SettingsStack"
        component={SettingsStack}
      />
    </Tab.Navigator>
  );
};
