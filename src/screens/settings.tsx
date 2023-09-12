import React from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import {colors} from '../utils/colors';
import {useTranslations} from '../hooks/useTranslations';
import {CardSetting} from '../components/CardSetting';
import {useFocusEffect} from '@react-navigation/native';
import {PrincipalWrapper} from '../components/PrincipalWrapper';

export const Settings = ({navigation}) => {
  const {tra} = useTranslations();

  useFocusEffect(
    React.useCallback(() => {
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(colors.secondary);
    }, []),
  );
  return (
    <PrincipalWrapper name={tra('impostazioni.titolo')}>
      <View style={styles.wrapper}>
        <CardSetting
          name={tra('impostazioni.gestisci')}
          icon={'map'}
          onPress={undefined}
        />
        <CardSetting
          name={tra('impostazioni.lingua')}
          icon={'globe-outline'}
          onPress={() => {
            navigation.navigate('Lingua');
          }}
        />
        <CardSetting
          isEnd
          name={tra('impostazioni.chi')}
          icon={'heart-circle-outline'}
          onPress={undefined}
        />
      </View>
    </PrincipalWrapper>
  );
};

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderWidth: 0.2,
    borderRadius: 5,
    color: colors.medium,
  },
});
