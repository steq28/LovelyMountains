import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslations} from '../../hooks/useTranslations';
import {SafeAreaView} from 'react-native';
import {colors} from '../../utils/colors';
import {Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {ScrollView} from 'react-native-gesture-handler';

export const Packs = ({navigation}) => {
  const {tra} = useTranslations();
  const insets = useSafeAreaInsets();
  const [packs, setPacks] = useState([]);

  useEffect(() => {
    getPacks();
  }, []);

  const getPacks = async () => {
    const offlinePacks = await MapboxGL.offlineManager.getPacks();
    let c = await MapboxGL.offlineManager.getPack('I');
    setPacks(offlinePacks);
  };
  const deletePack = async pack => {
    await MapboxGL.offlineManager.deletePack(pack.name);
    getPacks();
  };
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
            <Text style={styles.titolo}>{'Ste dai un nome'}</Text>
          </View>
          <ScrollView>
            {packs.map((pack, index) => (
              <View key={index}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text key={index}>{pack.name}</Text>
                  <Pressable
                    onPress={() => {
                      deletePack(pack);
                    }}>
                    <Icon
                      key={index}
                      style={{right: 0}}
                      name="remove-circle"
                      size={24}
                      color={'red'}
                    />
                  </Pressable>
                </View>
                {index !== packs.length - 1 && (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: '#DDD',
                      marginVertical: 10,
                      width: '90%',
                      alignSelf: 'flex-end',
                    }}
                  />
                )}
              </View>
            ))}
          </ScrollView>
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
