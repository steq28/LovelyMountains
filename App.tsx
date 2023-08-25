import React from 'react';
import {Navigation} from './src/navigation';
import { StatusBar, View } from 'react-native';
import { colors } from './src/utils/colors';

export default function App(): JSX.Element {
  return (
    <View style={{flex:1}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={"transparent"} translucent/>
      <Navigation/>
    </View>
  );
}

