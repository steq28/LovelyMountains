import React from 'react';
import {View, Pressable} from 'react-native';

export const Route = ({navigation}) => {
  return (
    <View>
      <Pressable
        style={{height: 100, width: 100, backgroundColor: 'red'}}
        onPress={() => navigation.navigate('PercorsoSelezionato')}
      />
    </View>
  );
};