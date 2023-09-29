import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslations} from '../../hooks/useTranslations';
import {useFocusEffect} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {Image, Modal, Platform, Pressable, StatusBar, Text, View} from 'react-native';
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
import { it } from '../../translations/resources';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ItemRoute = ({icon, location, secondaryText, key}) =>{
  return(
    <View key={key} style={{flexDirection:"row", alignItems:"center", marginBottom:20}}>
      <View style={{backgroundColor:colors.primary, height:30, width:45, alignItems:"center", justifyContent:"center", borderRadius:5, flexDirection:"row"}}>
        <Icon name={icon} size={icon=="golf-outline" ? 15 : 20} color={colors.secondary}/>
        {icon=="golf-outline" && <Text style={{fontFamily:"InriaSans-Regular", color:colors.secondary, marginLeft:2}}>1</Text> }
      </View>
      <View style={{marginLeft:8, flex:1}}>
        <Text numberOfLines={1} allowFontScaling={false} style={{fontFamily:"InriaSans-Regular", color:colors.primary, fontSize:16}}>{location}</Text>
        <Text numberOfLines={1} allowFontScaling={false} style={{fontFamily:"InriaSans-Light", color:colors.light, fontSize:14}}>{secondaryText}</Text>
      </View>
    </View>
  )
}

export const SaveTrack = ({route, navigation}) => {
  const {track, routeStack} = route?.params;
  const {tra} = useTranslations();
  const insets = useSafeAreaInsets();
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [fileUri, setFileUri] = useState(null);
  const [durata, setDurata] = useState("");
  const [lunghezza, setLunghezza] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      Platform.OS == 'android' &&
        StatusBar.setBackgroundColor(colors.secondary);
    }, []),
  );

  useEffect(()=>{
    let hours= (Math.floor(track?.features[0].properties.summary.duration / 3600 ) > 0) ? (Math.floor(track?.features[0].properties.summary.duration / 3600 )).toString()+ "H " : ""
    let mins = (Math.floor(((track?.features[0].properties.summary.duration / 3600 ) - Math.floor(track?.features[0].properties.summary.duration / 3600 ))*60)).toString()+ " min"
    setDurata(hours + mins)
    setLunghezza((Math.round((track?.features[0].properties.summary.distance / 1000 + Number.EPSILON) * 100) / 100).toString()+" Km")
  },[])

  const pickImage = () => {
    launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    }).then((res) => {
      if (!res.didCancel) {
        setImage(res.assets[0].uri);
      }
      
    });
  };


  const downloadGeoJson = async () => {
    const uri= RNFS.DocumentDirectoryPath + '/percorsiSalvati/' + fileName + '.geojson';
    try {
      RNFS.mkdir(RNFS.DocumentDirectoryPath + '/percorsiSalvati/').then((res) => {
        RNFS.exists(uri).then((exists) => {
            if(exists){
              setShowModal(true);
            }else{
              setIsLoading(true);
              AsyncStorage.getItem('savedTrackImages').then((savedTrackImages) => {
                if(savedTrackImages == null){
                  savedTrackImages="[]"
                }
                savedTrackImages = JSON.parse(savedTrackImages);
                savedTrackImages.push({
                  name: fileName,
                  image: image,
                  lunghezza: lunghezza,
                  durata: durata
                });
                AsyncStorage.setItem('savedTrackImages', JSON.stringify(savedTrackImages)).then(()=>{
                  RNFS.writeFile(uri, JSON.stringify(track), 'utf8').then((result) => {
                    navigation.navigate('Download');
                  });
                });
              });
            }
        })
      }).catch((err) => {
        RNFS.exists(uri).then((exists) => {
          if(exists){
            setShowModal(true);
          }else{
            AsyncStorage.getItem('savedTrackImages').then((savedTrackImages) => {
              if(savedTrackImages == null){
                savedTrackImages="[]"
              }
              savedTrackImages = JSON.parse(savedTrackImages);
              savedTrackImages.push({
                name: fileName,
                image: image,
                lunghezza: lunghezza,
                durata: durata
              });
              AsyncStorage.setItem('savedTrackImages', JSON.stringify(savedTrackImages)).then(()=>{
                RNFS.writeFile(uri, JSON.stringify(track), 'utf8').then((result) => {
                  navigation.navigate('Download');
                });
              });
            });
          }
        })
      });
    } catch (e) {
      console.log(e);
    }

    // if (!fileName.includes('~')) {
    //   setFileUri(RNFS.DocumentDirectoryPath + '/percorsiSalvati/' + fileName + '.geojson')
    //   let uri= RNFS.DocumentDirectoryPath + '/percorsiSalvati/' + fileName + '.geojson';
    //   try {
    //     RNFS.mkdir(RNFS.DocumentDirectoryPath + '/percorsiSalvati/').then((res) => {
    //       RNFS.exists(uri).then((exists) => {
    //           if(exists){
    //             setShowModal(true);
    //           }else{
    //             RNFS.writeFile(uri, JSON.stringify(track), 'utf8').then((result) => {
    //               navigation.navigate('Download');
    //             });
    //           }
    //       })

    //     }).catch((err) => {
    //       RNFS.exists(uri).then((exists) => {
    //         if(exists){
    //           setShowModal(true);
    //         }else{
    //           RNFS.writeFile(uri, JSON.stringify(track), 'utf8').then((result) => {
    //             navigation.navigate('Download');
    //           });
    //         }
    //       })
    //     });
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
  };

  return (
    <PrincipalWrapper name={'Salva Percorso'}>
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
                  setIsLoading(true);
                  AsyncStorage.getItem('savedTrackImages').then((savedTrackImages) => {
                    if(savedTrackImages == null){
                      savedTrackImages="[]"
                    }
                    savedTrackImages = JSON.parse(savedTrackImages);
                    savedTrackImages.push({
                      name: fileName,
                      image: image,
                      lunghezza: lunghezza,
                      durata: durata
                    });
                    AsyncStorage.setItem('savedTrackImages', JSON.stringify(savedTrackImages));
                  });

                  const uri= RNFS.DocumentDirectoryPath + '/percorsiSalvati/' + fileName + '.geojson';
                  RNFS.writeFile(uri, JSON.stringify(track), 'utf8').then((result) => {
                    setTimeout(()=>{
                      navigation.navigate('Download');
                    },1000)
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
      <ScrollView keyboardShouldPersistTaps={'always'}>
        <View style={styles.wrapper}>
            <View style={{flexDirection:"row"}}>
              <View style={{width:"75%"}}>
                {routeStack.map((item, index) => {
                    if(item.searchName != undefined){
                      if(index == 0){
                        return(
                          <ItemRoute key={index} icon={'location-outline'} location={item.searchName} secondaryText={item.searchAddress}/>
                        )
                      }else{
                        if(index == routeStack.length-1){
                          return(
                            <ItemRoute key={index} icon={'flag'} location={item.searchName} secondaryText={item.searchAddress}/>
                          )
                        }else
                          return(
                            <ItemRoute key={index} icon={'golf-outline'} location={item.searchName} secondaryText={item.searchAddress}/>
                          )
                      }
                    }
                  })
                }
                {/* <ItemRoute icon={'location-outline'} location={"San Giovanni Bianco"} secondaryText={"Bergamo, Lombardia, 24015, Italia"}/>
                <ItemRoute icon={'golf-outline'} location={"San Pellegrino Terme"} secondaryText={"Bergamo, Lombardia, 24015, Italia"}/>
                <ItemRoute icon={'flag'} location={"Monte Resegone"} secondaryText={"23900, Italy"}/> */}
              </View>
            </View>
            <View style={styles.midWrapper}>
                  <View style={styles.fieldWrapper}>
                    <Text allowFontScaling={false} style={styles.nameField}>Distanza</Text>
                    <Text allowFontScaling={false} style={styles.fieldValue}>
                      {lunghezza}
                    </Text>
                  </View>
                  <View style={[styles.fieldWrapper, {borderLeftWidth:1, borderRightWidth:1, borderColor:colors.veryLight}]}>
                    <Text allowFontScaling={false} style={styles.nameField}>Durata</Text>
                    <Text style={styles.fieldValue}>
                      {durata}
                    </Text>
                  </View>
                  <View style={styles.fieldWrapper}>
                    <Text allowFontScaling={false} style={styles.nameField}>Difficoltà</Text>
                    <Text allowFontScaling={false} style={styles.fieldValue}>Golfing</Text>
                  </View>
            </View>
            <View style={{flexDirection:"row", marginBottom:40}}>
              <Pressable
                style={styles.camera}
                onPress={()=>{
                  pickImage()
                }}
              >
                {image==null && <Icon name={'camera-outline'} size={50} color={colors.secondary}/>}
                {image && <Image source={{uri:image}} height={90} width={90} resizeMode='cover' style={{borderRadius:7}}/>}
              </Pressable>
              <View style={{flex:1, marginLeft:10, justifyContent:"center"}}>
                <Text allowFontScaling={false} style={{fontFamily:"InriaSans-Bold", fontSize:16, color:colors.primary}}>Nome del percorso</Text>
                <TextInput
                  autoFocus
                  onSubmitEditing={()=>{}}
                  style={styles.textInput}
                  onChangeText={e => setFileName(e)}
                />
              </View>
            </View>
            <BottoneBase text={'Salva Percorso'} isLoading={isLoading} onPress={downloadGeoJson}/>
          </View>
      </ScrollView>
      {/* <Pressable
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
      </ScrollView> */}
    </PrincipalWrapper>
  );
};
export const styles = StyleSheet.create({
  wrapper:{
    borderWidth:1,
    borderColor:colors.veryLight,
    padding:20,
    borderRadius:10,
  },
  midWrapper:{
    flexDirection:"row",
    borderColor: colors.veryLight,
    borderTopWidth:1,
    borderBottomWidth:1,
    alignItems:"center",
    justifyContent:"space-around",
    paddingVertical:15,
    marginBottom:40,
    marginTop:5
  },
  nameField:{
    fontFamily:"InriaSans-Regular",
    color:colors.light,
    fontSize:16
  },
  fieldValue:{
    fontFamily:"InriaSans-Bold",
    color:colors.primary,
    fontSize:17
  },
  fieldWrapper:{
    alignItems:"center",
    justifyContent:"center",
    flex:1
  },
  camera:{
    backgroundColor:colors.veryLight,
    height:90,
    width:90,
    borderRadius:7,
    alignItems:"center",
    justifyContent:"center"
  },
  textInput:{
    borderWidth:1,
    marginTop:10,
    borderColor:colors.veryLight,
    borderRadius:5,
    padding:10,
    maxWidth:"100%",
    height:40,
    color:colors.primary,
    fontFamily:"InriaSans-Regular",
    fontSize:15
  }
});
