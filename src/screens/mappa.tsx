import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, PermissionsAndroid, Pressable, Platform, StatusBar} from 'react-native';
import GetLocation from 'react-native-get-location';
import Mapbox, {Camera} from '@rnmapbox/maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchBox } from '../components/SearchBox';

Mapbox.setAccessToken(
  'pk.eyJ1IjoibGlub2RldiIsImEiOiJja3Rpc291amEwdTVtMndvNmw0OHhldHRkIn0.CxsTqIuyhCtGGgLNmVuEAg',
);

export const Mappa = ({navigation}) => {
  const [location, setLocation] = useState([0, 0]);
  const [hasLocationPermissions, sethasLocationPermissions] = useState(false);
  const camera = useRef<Camera>(null);
  const map = useRef<Mapbox.MapView>(null);

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

  useEffect(() => {
    requestLocationPermission();
    camera.current?.setCamera({
      centerCoordinate: [9.365615, 45.602012],
    });
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        setLocation([location.longitude, location.latitude]);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  }, []);
  
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.page}>
      <View style={{position:"absolute", top:0, width:"100%",alignItems:"center", zIndex:100, paddingTop: Platform.OS==="android" ? StatusBar.currentHeight : insets.top}}>
        <SearchBox icon={"prism-outline"} placeholder={"Cerca luoghi"} onPress={()=>navigation.navigate("SearchScreen")}/>
      </View>
      <View style={styles.container}>
        <Mapbox.MapView
          ref={map}
          style={styles.map}
          styleURL="mapbox://styles/linodev/ckw951ybo54sb15ocs835d13d">
          <Mapbox.UserLocation />
          <Camera ref={camera} />
        </Mapbox.MapView>
        <Pressable
          style={styles.button}
          onPress={() => {
            camera.current?.setCamera({
              centerCoordinate: location,
              zoomLevel: 14,
            });
          }}>
          <Icon name={'navigate-circle-outline'} color={'#333333'} size={30} />
        </Pressable>
        <Pressable
          style={[styles.button, {bottom: 30}]}
          onPress={() => {
            console.log('feauture still in preogress');
          }}>
          <Icon name={'cloud-download-outline'} color={'#333333'} size={30} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
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
    padding: 7,
  },
});
