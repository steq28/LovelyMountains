import React from 'react';
import {Dimensions, TextInput, View, Text, Pressable} from 'react-native';
import {styles} from './styles';
import {BoxShadow} from 'react-native-shadow';
import {colors} from '../../utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';

export const ResultCardSearch = ({isEnd, name, icon, callback, address}) => {
  return (
    <Pressable
      onPress={() => callback()}
      style={[styles.wrapper, {borderBottomWidth: isEnd ? 0 : 0.5}]}>
      <View style={{width: '10%'}}>
        <Icon name={icon} size={25} color={colors.primary} />
      </View>
      <View style={{flex:1, marginLeft:5}}>
        <Text style={styles.placeText} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.placeText, {fontFamily:"InriaSans-Light"}]} numberOfLines={1}>
          {address}
        </Text>
      </View>
    </Pressable>
  );
};
