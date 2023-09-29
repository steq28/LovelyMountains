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
  Text,
  Modal,
  Dimensions,
  TextInput,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import MapboxGL, {Camera, PointAnnotation} from '@rnmapbox/maps';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SearchBox} from '../components/SearchBox';
import {colors} from '../utils/colors';
import {useTranslations} from '../hooks/useTranslations';
import {useFocusEffect} from '@react-navigation/native';
import SystemSetting from 'react-native-system-setting';
import React = require('react');
import {PrincipalWrapper} from '../components/PrincipalWrapper';
import {useDispatch} from 'react-redux';
import i18n from '../translations';
import {setLanguage} from '../redux/settingsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottoneBase} from '../components/BottoneBase';
import * as Progress from 'react-native-progress';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoibGlub2RldiIsImEiOiJja3Rpc291amEwdTVtMndvNmw0OHhldHRkIn0.CxsTqIuyhCtGGgLNmVuEAg',
);

export const Mappa = ({route, navigation}) => {
  const {searchResult, searchCoordinates} = route?.params;
  const [currentLocation, setcurrentLocation] = useState([0, 0]);
  const [hasLocationPermissions, sethasLocationPermissions] = useState(false);
  const [showCurrentRadar, setshowCurrentRadar] = useState(false);
  const [downloadMap, setdownloadMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(0);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const camera = useRef<Camera>(null);
  const map = useRef<MapboxGL.MapView>(null);
  const insets = useSafeAreaInsets();
  const {tra} = useTranslations();
  const dispatch = useDispatch();

  const requestLocationPermission = async () => {
    if (Platform.OS == 'android') {
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
    }
  };

  const rasterSourceProps = {
    id: 'weather',
    tileUrlTemplates: [
      `https://tilecache.rainviewer.com/v2/radar/${timestamp}/256/{z}/{x}/{y}/1/1_0.png`,
    ],
    tileSize: 256,
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('lingua');
      if (value !== null) {
        i18n.changeLanguage(value);
        dispatch(setLanguage(value));
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
  const getPosition = (zoomCamera = false) => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        setcurrentLocation([location.longitude, location.latitude]);
        if (zoomCamera) {
          camera.current?.setCamera({
            centerCoordinate: [location.longitude, location.latitude],
            zoomLevel: 14,
          });
          setLoading(false);
        }
      })
      .catch(error => {
        const {code, message} = error;
        console.info(code, message);
        setLoading(false);
      });
  };

  const getTimestamp = () => {
    fetch('https://api.rainviewer.com/public/maps.json', {method: 'GET'}).then(
      resp => {
        let a = resp.json();
        a.then(data => {
          setTimestamp(data[data.length - 1]);
        });
      },
    );
  };

  const progressListener = (offlineRegion, status) => {
    if (status.percentage === 100) {
      setDownloadProgress(0);
      //this.setState({downloadStatus: 0, modalVisibility: false});
    }
    setDownloadProgress(status.percentage);
    //this.setState({downloadStatus: status.percentage});
  };
  const errorListener = (offlineRegion, err) => console.log(offlineRegion, err);

  useEffect(() => {
    if (searchResult) {
      camera.current?.setCamera({
        centerCoordinate: searchCoordinates,
        zoomLevel: 14,
      });
    }
  }, [searchCoordinates]);

  useEffect(() => {
    getData();
    requestLocationPermission();
    getPosition();
    getTimestamp();
    if (JSON.stringify(currentLocation) == JSON.stringify([0, 0]))
      camera.current?.setCamera({
        centerCoordinate: [9.365615, 45.602012],
      });
    Platform.OS === 'android' && StatusBar.setTranslucent(true);
    Platform.OS === 'android' && StatusBar.setBackgroundColor('transparent');
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      Platform.OS === 'android' && StatusBar.setBackgroundColor('transparent');
    }, []),
  );

  return (
    <PrincipalWrapper fullscreen>
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
            }}>
            <Text>Scarica mappa</Text>
            {downloadProgress == 0 && (
              <View>
                <Text>
                  Per poter procedere con il salvataggio inserire il capitano
                  per il download
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
                      console.log('work in progress');
                      // const visibleBounds =
                      //   await map.current.getVisibleBounds();
                      // await MapboxGL.offlineManager.createPack(
                      //   {
                      //     name: fileName,
                      //     styleURL:
                      //       'mapbox://styles/linodev/ckw951ybo54sb15ocs835d13d',
                      //     minZoom: 14,
                      //     maxZoom: 20,
                      //     bounds: visibleBounds,
                      //   },
                      //   progressListener,
                      //   errorListener,
                      // );
                    }}
                  />
                </View>
              </View>
            )}
            {downloadProgress > 0 && (
              <Progress.Bar progress={0.3} width={200} />
            )}
          </View>
        </View>
      </Modal>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        translucent
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          alignItems: 'center',
          zIndex: 100,
          paddingTop:
            Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
        }}>
        {downloadMap && (
          <SearchBox
            hiker={true}
            icon={'prism-outline'}
            placeholder={tra('search.cerca')}
            onPress={() => navigation.navigate('Search')}
          />
        )}
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
          <MapboxGL.UserLocation
            showsUserHeadingIndicator={true}
            animated
            androidRenderMode={'compass'}
          />
          {searchResult && (
            <MapboxGL.PointAnnotation
              id="searchResult"
              title="searchResult"
              coordinate={searchCoordinates}>
              <View
                style={{
                  height: 30,
                  width: 30,
                  backgroundColor: 'red',
                  borderRadius: 50,
                  borderColor: '#fff',
                  borderWidth: 3,
                }}
              />
            </MapboxGL.PointAnnotation>
          )}
          <Camera ref={camera} />
          {showCurrentRadar && (
            <MapboxGL.RasterSource {...rasterSourceProps}>
              <MapboxGL.RasterLayer
                id="weathers"
                sourceID="weathersource"
                style={{rasterOpacity: 0.9}}
              />
            </MapboxGL.RasterSource>
          )}
        </MapboxGL.MapView>
        {downloadMap && (
          <Pressable
            style={styles.button}
            disabled={loading}
            onPress={() => {
              setLoading(true);

              SystemSetting.isLocationEnabled().then(enable => {
                if (enable) {
                  if (
                    JSON.stringify(currentLocation) != JSON.stringify([0, 0])
                  ) {
                    camera.current?.setCamera({
                      centerCoordinate: currentLocation,
                      zoomLevel: 14,
                      animationMode: 'flyTo',
                    });
                    setLoading(false);
                    Platform.OS === 'android' && StatusBar.setTranslucent(true);
                    Platform.OS === 'android' &&
                      StatusBar.setBackgroundColor('transparent');
                  } else getPosition(true);
                } else {
                  ToastAndroid.show(
                    tra('mappa.abilitaGeo'),
                    ToastAndroid.SHORT,
                  );
                  setLoading(false);
                }
              });
            }}>
            {loading ? (
              <ActivityIndicator size={35} color={colors.primary} />
            ) : (
              <Icon
                name={'navigate-circle-outline'}
                color={'#333333'}
                size={35}
              />
            )}
          </Pressable>
        )}
        <Pressable
          style={[styles.button, {bottom: 30}]}
          onPress={() => {
            setdownloadMap(!downloadMap);
          }}>
          <Icon
            name={'cloud-download-outline'}
            color={!downloadMap ? 'rgb(0,122,255)' : '#333333'}
            size={35}
          />
        </Pressable>
        {downloadMap && (
          <Pressable
            style={[styles.button, {bottom: 170}]}
            onPress={() => {
              setshowCurrentRadar(!showCurrentRadar);
            }}>
            <Icon
              name={'partly-sunny-outline'}
              color={showCurrentRadar ? 'rgb(0,122,255)' : '#333'}
              size={35}
            />
          </Pressable>
        )}
        {!downloadMap && (
          <View
            style={{
              position: 'absolute',
              zIndex: 999,
              top: 100,
              backgroundColor: '#FFF',
              borderRadius: 10,
              alignSelf: 'center',
              width: '70%',
              padding: 10,
            }}>
            <Text style={{textAlign: 'center'}}>
              Center the screen on the area you want to download and press the
              button below
            </Text>
          </View>
        )}
        {!downloadMap && (
          <View
            style={{
              position: 'absolute',
              zIndex: 999,
              bottom: 30,
              alignSelf: 'center',
              width: '50%',
            }}>
            <BottoneBase
              text={'Download'}
              icon="arrow-down-circle-outline"
              onPress={async () => {
                setModalIsVisible(true);
                // await MapboxGL.offlineManager.createPack(
                //   {
                //     name: '',
                //     styleURL: '',
                //     minZoom: 14,
                //     maxZoom: 20,
                //     bounds: visibleBounds,
                //   },
                //   this.progressListener,
                //   this.errorListener,
                // );
              }}
            />
          </View>
        )}
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
    elevation: 4,
  },
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
