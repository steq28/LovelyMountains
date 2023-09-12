import React from 'react';
import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {useTranslations} from '../../hooks/useTranslations';
import {SearchBox} from '../../components/SearchBox';
import {useFocusEffect} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {colors} from '../../utils/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const PercorsoSelezionato = () => {
  const {tra} = useTranslations();
  const insets = useSafeAreaInsets();

  const queryPlaces = async query => {
    console.log('sium');
  };

  useFocusEffect(
    React.useCallback(() => {
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(colors.secondary);
    }, []),
  );

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={'always'}
      contentContainerStyle={{
        height: '100%',
        paddingTop:
          Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
      }}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={colors.secondary}
        translucent
      />
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{
          flex: 1,
          backgroundColor: colors.secondary,
          paddingHorizontal: 30,
        }}>
        <SearchBox
          icon={'arrow-back-outline'}
          placeholder={tra('search.cerca')}
          callback={queryPlaces}
        />
        <SearchBox
          icon={'arrow-back-outline'}
          placeholder={tra('search.cerca')}
          callback={queryPlaces}
        />
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({});
