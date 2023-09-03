import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Mappa} from '../screens/mappa';
import {SearchScreen} from '../screens/search';
import {RootStackParamList} from '../utils/types';

const Stack = createStackNavigator<RootStackParamList>();

const forFade = ({current}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

export const MapStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        //animationEnabled:false,
        cardStyleInterpolator: forFade,
      }}>
      <Stack.Screen
        name="Mappa"
        component={Mappa}
        initialParams={{
          searchResult: false,
          searchCoordinates: [0, 0],
        }}
      />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
    </Stack.Navigator>
  );
};
