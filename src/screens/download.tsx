import React, {useState} from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors} from '../utils/colors';
import {useTranslations} from '../hooks/useTranslations';
import {useFocusEffect} from '@react-navigation/native';
import {CardPercorso} from '../components/CardPercorso';
import {BottonBase} from '../components/BottoneBase';
import {PrincipalWrapper} from '../components/PrincipalWrapper';
import {Platform} from 'react-native';

export const Download = () => {
  const {tra} = useTranslations();
  const [showModal, setShowModal] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      Platform.OS === 'android' &&
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
              <BottonBase
                text={tra('download.conferma')}
                onPress={() => setShowModal(false)}
              />
              <View style={{width: 10}}></View>
              <BottonBase
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
        style={{maxHeight: Dimensions.get('window').height - 143}}>
        <CardPercorso
          name={undefined}
          img={undefined}
          onPress={undefined}
          onDelete={() => setShowModal(true)}
        />
        <CardPercorso
          name={undefined}
          img={undefined}
          onPress={undefined}
          onDelete={() => setShowModal(true)}
        />
        <CardPercorso
          name={undefined}
          img={undefined}
          onPress={undefined}
          onDelete={() => setShowModal(true)}
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
