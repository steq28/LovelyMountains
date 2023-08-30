import React, { useEffect } from 'react';
import {Navigation} from './src/navigation';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { Provider } from 'react-redux'
import store from './src/redux/store';

export default function App(): JSX.Element {
  
  useEffect(() => {
    changeNavigationBarColor("#eeeeee", true);
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <View style={{flex:1}}>
        <Navigation/>
      </View>
    </Provider>
  );
}

