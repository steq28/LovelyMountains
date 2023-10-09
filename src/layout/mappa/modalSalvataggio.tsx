import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {BottoneBase} from '../../components/BottoneBase';
import * as Progress from 'react-native-progress';
import MapboxGL from '@rnmapbox/maps';

interface IModalSalvataggio {
  modalIsVisible: boolean;
  setModalIsVisible: (e: boolean) => void;
  setFileName: (e: string) => void;
  fileName: string;
  downloadProgress: number;
  mapRef: React.RefObject<any>;
  progressListener: (e: any, a:any) => void;
  errorListener: (e: any,  a:any) => void;
}

export const ModalSalvataggio = ({
  modalIsVisible,
  setFileName,
  setModalIsVisible,
  fileName,
  downloadProgress,
  mapRef,
  progressListener,
  errorListener,
}: IModalSalvataggio) => {
  return (
    <Modal
      statusBarTranslucent
      visible={modalIsVisible}
      animationType="fade"
      transparent>
      <View
        style={{
          height: Dimensions.get('screen').height,
          width: Dimensions.get('screen').width,
          backgroundColor: 'rgba(51,51,51,0.5)',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: Dimensions.get('screen').height,
          width: Dimensions.get('screen').width,
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            backgroundColor: colors.secondary,
            padding: 20,
            borderRadius: 10,
            width:"100%",
            alignItems:"center"
          }}>
          <Text>Scarica mappa</Text>
          {downloadProgress == 0 && (
            <View>
              <Text>
                Per poter procedere con il salvataggio inserire il capitano per
                il download
              </Text>
              <TextInput
                style={styles.textInput}
                onChangeText={e => setFileName(e)}
                placeholder="Francesco Totti"
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 20,
                  justifyContent: 'space-around',
                }}>
                <BottoneBase
                  text="Annulla"
                  outlined
                  onPress={() => setModalIsVisible(false)}
                />
                <BottoneBase
                  text="Conferma"
                  disabled={fileName == ''}
                  onPress={async () => {
                    //setModalIsVisible(false)
                    const visibleBounds = await mapRef.current.getVisibleBounds();
                    
                    await MapboxGL.offlineManager.createPack(
                      {
                        name: fileName,
                        styleURL:
                          'mapbox://styles/linodev/ckw951ybo54sb15ocs835d13d',
                        minZoom: 14,
                        maxZoom: 20,
                        bounds: visibleBounds,
                      },
                      progressListener,
                      errorListener,
                    );
                  }}
                />
              </View>
            </View>
          )}
          {downloadProgress > 0 &&
            <View style={{width:"80%", borderColor:colors.primary, borderWidth:1, height:10, borderRadius:200, overflow:"hidden"}}>
                <View style={{backgroundColor:colors.primary, height:"100%", width:`${downloadProgress}%`}}/>
            </View>
          }
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    marginTop: 10,
    borderColor: colors.veryLight,
    borderRadius: 5,
    padding: 10,
    maxWidth: '100%',
    height: 40,
    color: colors.primary,
    fontFamily: 'InriaSans-Regular',
    fontSize: 15,
  },
});
