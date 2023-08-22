import React from 'react';
import {Navigation} from './src/navigation';
import { View } from 'react-native';

export default function App(): JSX.Element {
  return (
    <View style={{flex:1}}>
      <Navigation/>
    </View>
  );
}

