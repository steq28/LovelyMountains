import React, {useMemo, useState} from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {colors} from '../../utils/colors';
import {useTranslations} from '../../hooks/useTranslations';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import i18n from '../../translations';
import {useDispatch, useSelector} from 'react-redux';

export const AboutUs = ({navigation}) => {
  const {tra} = useTranslations();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={'always'}
      contentContainerStyle={{
        height: '100%',
        paddingTop:
          Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
      }}>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{
          flex: 1,
          backgroundColor: colors.secondary,
          paddingHorizontal: 30,
        }}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon
                name={'arrow-back-outline'}
                size={27}
                color={colors.primary}
              />
            </Pressable>
            <Text style={styles.titolo}>{tra('impostazioni.chi')}</Text>
          </View>
          <Text>{tra('impostazioni.aboutus')}</Text>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export const styles = StyleSheet.create({
  titolo: {
    color: colors.primary,
    fontFamily: 'InriaSans-Bold',
    fontSize: 30,
    marginTop: 15,
    marginBottom: 20,
    marginLeft: 15,
  },
  wrapper: {
    width: '100%',
    borderWidth: 0.2,
    borderRadius: 5,
    color: colors.medium,
    paddingTop: 5,
    paddingHorizontal: 10,
  },
});
