import React from 'react';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import {Route} from '../screens/route/route';
import {PercorsoSelezionato} from '../screens/route/percorsoSelezionato';

const Stack = createStackNavigator();

export const RouteStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen
        name="Route"
        component={Route}
        initialParams={{
          searchStatus: [
            {searchName: '', searchCoordinates: []},
            {searchName: '', searchCoordinates: []},
          ],
          searchInput: -1,
        }}
      />
      <Stack.Screen
        name="PercorsoSelezionato"
        component={PercorsoSelezionato}
      />
    </Stack.Navigator>
  );
};
