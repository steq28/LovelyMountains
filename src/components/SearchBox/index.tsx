import React, {FC} from 'react';
import {Dimensions, Keyboard, Pressable, TextInput, View} from 'react-native';
import {styles} from './styles';
import {BoxShadow} from 'react-native-shadow';
import {colors} from '../../utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {LocalSvg} from 'react-native-svg';

interface ISearchBox {
  icon?: string;
  placeholder: string;
  callback?: () => string | null;
  onPress: () => void | null;
  small?: boolean
}

export const SearchBox: FC<ISearchBox> = ({
  icon,
  placeholder,
  onPress = null,
  callback = null,
  small = false,
}) => {
  const width = Dimensions.get('window').width - 60;
  const navigation = useNavigation<any>();

  const shadowOpt = {
    width: small ? Dimensions.get('window').width * 0.7 - 54 : width,
    height: 55,
    color: '#000',
    border: 5,
    radius: 25,
    opacity: 0.06,
    x: 0,
    y: 3,
    style: {marginVertical: 5},
  };

  return (
    <>
      {!small ? <BoxShadow setting={shadowOpt}>
          <View style={styles.wrapper}>
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                navigation.goBack();
              }}
              style={{width: '10%'}}>
              {!onPress && icon && <Icon name={icon} color={colors.medium} size={25} />}
              {onPress && icon && (
                <LocalSvg
                  asset={require('../../assets/images/svg/logo-mountains-medium.svg')}
                  height={'100%'}
                  width={'100%'}
                />
              )}
            </Pressable>
            <TextInput
              onChangeText={e => callback(e)}
              autoFocus={onPress ? false : true}
              focusable={onPress ? false : true}
              placeholder={placeholder}
              placeholderTextColor={colors.light}
              style={styles.textInput}
            />
          </View>
          {onPress && (
            <Pressable
              style={{width: '100%', height: '100%', position: 'absolute'}}
              onPress={onPress}
            />
          )}
        </BoxShadow>
        :
        <>
          <View style={[styles.wrapper, {borderRadius:8, height:45, elevation:2}]}>
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  navigation.goBack();
                }}
                style={{width: '10%'}}>
                {!onPress && icon && <Icon name={icon} color={colors.medium} size={25} />}
                {onPress && icon && (
                  <LocalSvg
                    asset={require('../../assets/images/svg/logo-mountains-medium.svg')}
                    height={'100%'}
                    width={'100%'}
                  />
                )}
              </Pressable>
              <TextInput
                onChangeText={e => callback(e)}
                autoFocus={onPress ? false : true}
                focusable={onPress ? false : true}
                placeholder={placeholder}
                placeholderTextColor={colors.light}
                style={styles.textInput}
              />
            </View>
            {onPress && (
              <Pressable
                style={{width: '100%', height: '100%', position: 'absolute'}}
                onPress={onPress}
              />
          )}
        </>
      }
    </>
  );
};
