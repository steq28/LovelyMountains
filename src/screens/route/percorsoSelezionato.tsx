
import React, { useCallback, useRef } from 'react';
import {Dimensions, Platform, Pressable, SafeAreaView, StyleSheet, View} from 'react-native';

import {useTranslations} from '../../hooks/useTranslations';
import {SearchBox} from '../../components/SearchBox';
import {useFocusEffect} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {colors} from '../../utils/colors';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { PrincipalWrapper } from '../../components/PrincipalWrapper';
import Icon from 'react-native-vector-icons/Ionicons';
import MapboxGL, { Camera } from '@rnmapbox/maps';
import { BottoneBase } from '../../components/BottoneBase';

export const PercorsoSelezionato = ({navigation}) => {
  const {tra} = useTranslations();
  const insets = useSafeAreaInsets();
  const map = useRef<MapboxGL.MapView>(null);
  
  const queryPlaces = async query => {
    console.log('sium');
  };

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor(colors.secondary);
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.secondary);
      navigation.getParent().setOptions({
        tabBarStyle: { display: "none" }
      })
      return () => {
        navigation.getParent().setOptions({
          tabBarStyle: {
            display: "flex",
            height: 70, borderTopWidth: 0
          }
        })
      };
    },[]),
  );
  return (
      <PrincipalWrapper>
        
          <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
            <Pressable style={{flex:0.3}} onPress={()=>{navigation.goBack()}}>
              <Icon name='arrow-back-outline' size={30} color={colors.medium}/>
            </Pressable>
            <View style={{flex:0.3, alignItems:"center", justifyContent:"space-between"}}>
              <Icon name='flag-outline' size={30} color={colors.medium}/>
              <Icon name='ellipsis-vertical-outline' size={30} color={colors.light}/>
              <Icon name='location-outline' size={30} color={colors.medium}/>
            </View>
            <View style={{flex:1.7, marginHorizontal:10}}>
              <SearchBox small placeholder={''} onPress={()=>{}}/>
              <View style={{height:20}}/>
              <SearchBox small placeholder={''} onPress={()=>{}}/>
            </View>
            <Pressable style={{flex:0.3, alignItems:"center", justifyContent:"center"}}>
              <Icon name='repeat-outline' size={30} color={colors.medium} />
            </Pressable>
          </View>
          <View style={{height:250, marginTop:20}}>
            <MapboxGL.MapView
              ref={map}
              style={{flex:1, marginHorizontal:-30}}
              compassEnabled={false}
              pitchEnabled={false}
              scrollEnabled={true}
              rotateEnabled={false}
              scaleBarEnabled={false}
              logoEnabled={false}
              compassFadeWhenNorth
              attributionEnabled={false}
              compassPosition={{
                top: 15,
                right: 10,
              }}
              styleURL="mapbox://styles/linodev/ckw951ybo54sb15ocs835d13d">
              <MapboxGL.UserLocation showsUserHeadingIndicator={true} animated androidRenderMode={'compass'} />
              {/* <Camera ref={camera} /> */}
            </MapboxGL.MapView>
          </View>
          <View style={{flexDirection:"row", alignItems:"flex-start", marginTop:20, justifyContent:"center"}}>
              <BottoneBase text={'Avvia'} fixedWidth={{marginRight:10}} onPress={()=>{} } />
              <BottoneBase text={'Salva tracciato offline'} outlined onPress={()=>{} }/>
          </View>
      </PrincipalWrapper>
  );
};
const styles = StyleSheet.create({});
