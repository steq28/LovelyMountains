import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import {colors} from '../utils/colors';
import {useTranslations} from '../hooks/useTranslations';
import {useFocusEffect} from '@react-navigation/native';
import {CardPercorso} from '../components/CardPercorso';
import {BottoneBase} from '../components/BottoneBase';
import {PrincipalWrapper} from '../components/PrincipalWrapper';
import RNFS from 'react-native-fs';
import { useDispatch, useSelector } from 'react-redux';
import { setPercorsiOffline } from '../redux/settingsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Download = () => {
  const {tra} = useTranslations();
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [deleteFile, setDeleteFile] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [deleteName, setDeleteName] = useState('');
  
  const {percorsiOffline} = useSelector(state => state.settings)
  const dispatch = useDispatch()

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getFileContent(`${RNFS.DocumentDirectoryPath}/percorsiSalvati/`).then(
      () => {
        setRefreshing(false);
      },
    );
  }, []);

  const getFileContent = async path => {
    AsyncStorage.getItem('savedTrackImages').then((imagesObject)=>{
      imagesObject = JSON.parse(imagesObject);
      RNFS.readDir(path).then((reader)=>{
        reader = reader.map(item => {
          let name = item.name.replace('.geojson', '');
          item.name = name;

          imagesObject.forEach(image => {
            if(image.name == name){
              item.image = image.image;
              item.lunghezza = image.lunghezza;
              item.durata = image.durata;
            }
          })

          return item;
        });
        dispatch(setPercorsiOffline(reader));
      }).catch(err => console.log(err));
    });

    

  };

  useEffect(() => {
    getFileContent(`${RNFS.DocumentDirectoryPath}/percorsiSalvati/`);
  }, []);

  // useEffect(()=>{
  //   console.log(percorsiOffline)
  // },[percorsiOffline])

  useFocusEffect(
    React.useCallback(() => {
      Platform.OS == 'android' &&
        StatusBar.setBackgroundColor(colors.secondary);
    }, []),
  );

  return (
    <PrincipalWrapper name={tra('download.titolo')}>
      <Modal
        visible={showModal}
        animationType="fade"
        transparent
        statusBarTranslucent>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrapper}>
            <Text allowFontScaling={false} style={styles.titoloModal}>
              {tra('download.titoloModal')}
            </Text>
            <Text allowFontScaling={false} style={styles.testoModal}>
              {tra('download.seiSicuro')}
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
                text={tra('download.conferma')}
                onPress={() => {
                  RNFS.unlink(deleteFile);
                  AsyncStorage.getItem('savedTrackImages').then((imagesObject)=>{
                    imagesObject = JSON.parse(imagesObject);
                    imagesObject = imagesObject.filter(image => image.name != deleteName);
                    AsyncStorage.setItem('savedTrackImages', JSON.stringify(imagesObject)).then(() => {
                      getFileContent(`${RNFS.DocumentDirectoryPath}/percorsiSalvati/`);
                      setShowModal(false);
                    });
                  })
                  
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{maxHeight: Dimensions.get('window').height - 143}}>
        {percorsiOffline.length != 0 ? (
          percorsiOffline.map((file, index) => (
            <CardPercorso
              key={index}
              name={file.name}
              img={file.image}
              durata={file.durata}
              lunghezza={file.lunghezza}
              onPress={undefined}
              onDelete={() => {
                setDeleteFile(file.path);
                setDeleteName(file.name);
                setShowModal(true);
              }}
            />
          ))
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              height: Dimensions.get('window').height / 1.4,
            }}>
            <Text style={styles.noPercorsi}>{tra('download.nonPresenti')}</Text>
          </View>
        )}
      </ScrollView>
    </PrincipalWrapper>
  );
};

export const styles = StyleSheet.create({
  modalBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(30,30,30,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  modalWrapper: {
    backgroundColor: colors.secondary,
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
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
  noPercorsi: {
    alignSelf: 'center',
    textAlignVertical: 'center',
    //height: Dimensions.get('window').height / 1.3,
    fontFamily: 'InriaSans-Light',
    color: colors.medium,
  },
});
