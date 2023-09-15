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

export const Download = () => {
  const {tra} = useTranslations();
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [deleteFile, setDeleteFile] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getFileContent = async path => {
    let reader = await RNFS.readDir(path);
    reader = reader.map(item => {
      let c = item.name.replace('.geojson', '');
      c = c.split('~');
      item.name = c[0];
      item.image = c[1];
      return item;
    });
    setFiles(reader);
  };
  useEffect(() => {
    getFileContent(RNFS.DocumentDirectoryPath);
  }, []);

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{maxHeight: Dimensions.get('window').height - 143}}>
        {files.map((file, index) => (
          <CardPercorso
            key={index}
            name={file.name}
            img={undefined}
            onPress={undefined}
            onDelete={() => {
              console.log(file);
              setDeleteFile(file.path);
              setShowModal(true);
            }}
          />
        ))}
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
