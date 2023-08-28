import React, { useEffect } from 'react';
import {Navigation} from './src/navigation';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

export default function App(): JSX.Element {
  
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <View style={{flex:1}}>
      <Navigation/>
    </View>
  );
}

