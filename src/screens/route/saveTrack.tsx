import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslations} from '../../hooks/useTranslations';
import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {Platform, Pressable, StatusBar} from 'react-native';
import {colors} from '../../utils/colors';
import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import {PrincipalWrapper} from '../../components/PrincipalWrapper';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {Text} from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {BottoneBase} from '../../components/BottoneBase';

export const SaveTrack = ({route, navigation}) => {
  const {track} = route?.params;
  const {tra} = useTranslations();
  const insets = useSafeAreaInsets();
  const [image, setImage] = React.useState(null);
  const [fileName, setFileName] = React.useState('');

  useFocusEffect(
    React.useCallback(() => {
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
      let fileUri =
        RNFS.DocumentDirectoryPath + '/' + fileName + '~' + image + '.geojson';
      try {
        await RNFS.writeFile(fileUri, JSON.stringify(track), 'utf8');
        console.log('File scritto', fileUri);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <PrincipalWrapper name={'Save file'}>
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
