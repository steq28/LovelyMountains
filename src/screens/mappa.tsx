import {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Pressable,
  Platform,
  StatusBar,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import MapboxGL, {Camera} from '@rnmapbox/maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchBox } from '../components/SearchBox';
import { colors } from '../utils/colors';
import { useTranslations } from '../hooks/useTranslations';
import { useFocusEffect } from '@react-navigation/native';
import SystemSetting from 'react-native-system-setting';
import React = require('react');
import { PrincipalWrapper } from '../components/PrincipalWrapper';
import { useDispatch } from 'react-redux';
import i18n from '../translations';
import { setLanguage } from '../redux/settingsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoibGlub2RldiIsImEiOiJja3Rpc291amEwdTVtMndvNmw0OHhldHRkIn0.CxsTqIuyhCtGGgLNmVuEAg',
);

export const Mappa = ({navigation}) => {
  const [location, setLocation] = useState([0, 0]);
  const [hasLocationPermissions, sethasLocationPermissions] = useState(false);
  const [loading, setLoading] = useState(false)
  const camera = useRef<Camera>(null);
  const map = useRef<MapboxGL.MapView>(null);
  const insets = useSafeAreaInsets();
  const {tra} = useTranslations();
  const dispatch= useDispatch()

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        sethasLocationPermissions(true);
        console.log('You can use the location');
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  
  
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('lingua');
      if (value !== null) {
        i18n.changeLanguage(value)
        dispatch(setLanguage(value))
      }
    } catch (e) {
      // error reading value
    }
  };

  // const queryFeature = async () => {
  //   let bounds = await map.current?.getVisibleBounds();
  //   const features = await map.current?.queryRenderedFeaturesInRect(
  //     [],
  //     ['==', 'type', 'Point'],
  //     ['hospital'],
  //   );
  //   console.log(features);
  // };
  const getPosition = (zoomCamera=false) =>{
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        setLocation([location.longitude, location.latitude]);
        if(zoomCamera){
          camera.current?.setCamera({
            centerCoordinate: [location.longitude, location.latitude],
            zoomLevel: 14,
          });
          setLoading(false)
        }
      })
      .catch(error => {
        const {code, message} = error;
        console.info(code, message);
        setLoading(false)
      });
  }

  useEffect(() => {
    getData();
    requestLocationPermission();
    getPosition()
    if(JSON.stringify(location) == JSON.stringify([0,0]))
      camera.current?.setCamera({
        centerCoordinate: [9.365615, 45.602012],
      });
    StatusBar.setTranslucent(true)
    StatusBar.setBackgroundColor("transparent")
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor('transparent')
    }, [])
  );

  return (
    <PrincipalWrapper fullscreen>
      <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent/>
      <View style={{position:'absolute', top:0, width:'100%',alignItems:'center', zIndex:100, paddingTop: Platform.OS==='android' ? StatusBar.currentHeight : insets.top}}>
        <SearchBox icon={'prism-outline'} placeholder={tra('search.cerca')} onPress={()=>navigation.navigate('SearchScreen')}/>
      </View>
      <View style={styles.container}>
        <MapboxGL.MapView
          ref={map}
          style={styles.map}
          compassEnabled={true}
          scaleBarEnabled={false}
          logoEnabled={false}
          compassFadeWhenNorth
          attributionEnabled={false}
          compassPosition={{
            top:
              Platform.OS === 'android'
                ? StatusBar.currentHeight + 75
                : insets.top + 75,
            right: 10,
          }}
          styleURL="mapbox://styles/linodev/ckw951ybo54sb15ocs835d13d">
          <MapboxGL.UserLocation showsUserHeadingIndicator={true} animated androidRenderMode={'compass'} />
          <Camera ref={camera} />
        </MapboxGL.MapView>
        <Pressable
          style={styles.button}
          disabled={loading}
          onPress={() => {
            setLoading(true)
            
            SystemSetting.isLocationEnabled().then((enable)=>{
              if(enable){
                if(JSON.stringify(location)!= JSON.stringify([0,0])){
                  camera.current?.setCamera({
                    centerCoordinate: location,
                    zoomLevel: 14,
                    animationMode:'flyTo',
                  });
                  setLoading(false)
                  StatusBar.setTranslucent(true)
                  StatusBar.setBackgroundColor("transparent")
                }else
                  getPosition(true)
              }else{
                ToastAndroid.show(tra("mappa.abilitaGeo"), ToastAndroid.SHORT);
                setLoading(false)
              }
            })

          }}>
          {loading ? <ActivityIndicator size={35} color={colors.primary}/> : <Icon name={'navigate-circle-outline'} color={'#333333'} size={35} />}
        </Pressable>
        <Pressable
          style={[styles.button, {bottom: 30}]}
          onPress={() => {
            console.log('feauture still in preogress');
          }}>
          <Icon name={'cloud-download-outline'} color={'#333333'} size={35} />
        </Pressable>
        {/* <Pressable
          style={[styles.button, {bottom: 200}]}
          onPress={() => {
            queryFeature();
          }}>
          <Icon name={'prism-outline'} color={'#333333'} size={30} />
        </Pressable> */}
      </View>
      </PrincipalWrapper>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: 999,
    bottom: 100,
    right: 10,
    borderRadius: 30,
    padding: 9,
    elevation: 4
  },
});
