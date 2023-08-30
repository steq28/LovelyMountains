import React, { useEffect } from 'react';
import {Navigation} from './src/navigation';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

export default function App(): JSX.Element {
  
  useEffect(() => {
    changeNavigationBarColor("#eeeeee", true);
    SplashScreen.hide();
  }, []);

  return (
    <View style={{flex:1}}>
      <Navigation/>
    </View>
  );
}

