import {Pressable, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {FC} from 'react';
import {Download} from '../screens/download';
import {RouteStack} from './route_stack';
import {colors} from '../utils/colors';
import {SettingsStack} from './settings_stack';
import {Platform} from 'react-native';
import { useDispatch } from 'react-redux';
import { resetState } from '../redux/settingsSlice';
import { Search } from '../screens/search';
import { Mappa } from '../screens/mappa';

interface INavItem {
  props: any;
  name: string;
  icon: string;
}

const NavItem: FC<INavItem> = ({props, icon}) => {
  const dispatch = useDispatch()

  return (
    <Pressable {...props} onPress={() => {props.onPress(); dispatch(resetState())}} >
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
        tabBarStyle: {
          height: Platform.OS == 'android' ? 70 : 90,
          borderTopWidth: 0,
        },
        unmountOnBlur: true
      }}
      backBehavior="history"
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
          unmountOnBlur: false
        }}
        initialParams={{
          searchResult: false,
          searchCoordinates: [0, 0],
        }}
        name="Map"
        component={Mappa}
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
      <Tab.Screen
        options={{
          tabBarButton: props => (
            <></>
          ),
          tabBarInactiveTintColor: colors.light,
          tabBarActiveTintColor: colors.primary,
          tabBarStyle: {
            display: 'none'
          }
        }}
        initialParams={{
          fromRoute: false,
          pickEnabled: false,
        }}
        name="Search"
        component={Search}
      />
    </Tab.Navigator>
  );
};
