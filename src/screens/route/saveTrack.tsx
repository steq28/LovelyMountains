import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslations} from '../../hooks/useTranslations';
import {useFocusEffect} from '@react-navigation/native';
import React, { useState } from 'react';
import {Modal, Platform, Pressable, StatusBar, Text, View} from 'react-native';
import {colors} from '../../utils/colors';
import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import {PrincipalWrapper} from '../../components/PrincipalWrapper';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {BottoneBase} from '../../components/BottoneBase';
import { useEvent } from 'react-native-reanimated';

export const SaveTrack = ({route, navigation}) => {
  const {track} = route?.params;
  const {tra} = useTranslations();
  const insets = useSafeAreaInsets();
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [fileUri, setFileUri] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      console.log(navigation.getState())
      Platform.OS == 'android' &&
        StatusBar.setBackgroundColor(colors.secondary);
    }, []),
  );

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (!result.cancelled) {
      setImage(undefined);
      //setImage(result.assets[0].uri);
      
    }
  };


  const downloadGeoJson = async () => {
    console.log(image);
    if (!fileName.includes('~')) {
      setFileUri(RNFS.DocumentDirectoryPath + '/percorsiSalvati/' + fileName + '~' + image + '.geojson')
      let uri= RNFS.DocumentDirectoryPath + '/percorsiSalvati/' + fileName + '~' + image + '.geojson';
      try {
          RNFS.mkdir(RNFS.DocumentDirectoryPath + '/percorsiSalvati/').then((res) => {
            RNFS.exists(uri).then((exists) => {
                if(exists){
                  setShowModal(true);
                }else{
                  RNFS.writeFile(uri, JSON.stringify(track), 'utf8').then((result) => {
                    navigation.navigate('Download');
                  });
                }
            })

          }).catch((err) => {
            RNFS.exists(uri).then((exists) => {
              if(exists){
                setShowModal(true);
              }else{
                RNFS.writeFile(uri, JSON.stringify(track), 'utf8').then((result) => {
                  navigation.navigate('Download');
                });
              }
            })
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <PrincipalWrapper name={'Save file'}>
      <Modal
        visible={showModal}
        animationType="fade"
        transparent
        statusBarTranslucent>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(30,30,30,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 30,
          }}>
          <View
            style={{
              backgroundColor: colors.secondary,
              width: '100%',
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}>
            <Text allowFontScaling={false} style={styles.titoloModal}>
              {tra("saveTrack.percorsoEsiste")}
            </Text>
            <Text allowFontScaling={false} style={styles.testoModal}>
              {tra("saveTrack.textModal")}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 15,
              }}>
              <BottoneBase
                text={tra("saveTrack.sovrascrivi")}
                onPress={() => {
                  RNFS.writeFile(fileUri, JSON.stringify(track), 'utf8').then((result) => {
                    navigation.navigate('Download');
                  });
                  setShowModal(false);
                }}
              />
              <View style={{width: 10}}></View>
              <BottoneBase
                text={tra('download.annulla')}
                outlined
                onPress={() => setShowModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Pressable
        style={{flex: 0.3}}
        onPress={() => {
          navigation.goBack();
        }}>
        <Icon name="arrow-back-outline" size={30} color={colors.medium} />
      </Pressable>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{maxHeight: Dimensions.get('window').height - 143}}>
        <TextInput
          placeholder="Insert file name"
          onChangeText={e => setFileName(e)}
        />
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => pickImage()}>
          <Icon name={'image-outline'} size={24} />
          <Text style={{marginLeft: 10}}>Pick a new profile image</Text>
        </Pressable>
        <BottoneBase
          text={'salva'}
          outlined
          onPress={() => downloadGeoJson()}
        />
      </ScrollView>
    </PrincipalWrapper>
  );
};
export const styles = StyleSheet.create({
  titoloModal: {
    color: colors.primary,
    fontFamily: 'InriaSans-Bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
  },
  testoModal: {
    color: colors.primary,
    fontFamily: 'InriaSans-Light',
    fontSize: 17,
    textAlign: 'center',
  },
});
