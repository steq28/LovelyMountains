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
  Dimensions,
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
import {useDispatch, useSelector} from 'react-redux';
import i18n from '../translations';
import {setLanguage, setRisultatoSingoloMappa} from '../redux/settingsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottoneBase} from '../components/BottoneBase';
import {ModalSalvataggio} from '../layout/mappa/modalSalvataggio';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoibGlub2RldiIsImEiOiJja3Rpc291amEwdTVtMndvNmw0OHhldHRkIn0.CxsTqIuyhCtGGgLNmVuEAg',
);

export const Mappa = ({route, navigation}) => {
  const [currentLocation, setcurrentLocation] = useState([0, 0]);
  const [hasLocationPermissions, sethasLocationPermissions] = useState(false);
  const [pickEnabled, setpickEnabled] = useState(true);
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
  const {risultatoSingoloMappa} = useSelector(state => state.settings);

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
            animationMode: 'flyTo',
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
      setModalIsVisible(false);
      setdownloadMap(false);
    } else {
      setDownloadProgress(status.percentage);
    }
  };
  const errorListener = (offlineRegion, err) => {
    console.log('Errore:', offlineRegion, err);
  };

  useEffect(() => {
    if (risultatoSingoloMappa) {
      camera.current?.setCamera({
        centerCoordinate: [
          parseFloat(risultatoSingoloMappa.coordinates[0]),
          parseFloat(risultatoSingoloMappa.coordinates[1]),
        ],
        zoomLevel: 14,
        animationMode: 'flyTo',
      });
    }
  }, [risultatoSingoloMappa]);

  useEffect(() => {
    getData();
    requestLocationPermission();
    getPosition();
    getTimestamp();
    if (JSON.stringify(currentLocation) == JSON.stringify([0, 0]))
      camera.current?.setCamera({
        centerCoordinate: [9.365615, 45.602012],
        animationMode: 'flyTo',
      });

    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      Platform.OS === 'android' && StatusBar.setBackgroundColor('transparent');
    }, []),
  );

  return (
    <PrincipalWrapper fullscreen>
      <ModalSalvataggio
        modalIsVisible={modalIsVisible}
        setFileName={e => setFileName(e)}
        setModalIsVisible={e => setModalIsVisible(e)}
        fileName={fileName}
        downloadProgress={downloadProgress}
        progressListener={progressListener}
        errorListener={errorListener}
        mapRef={map}
      />
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
        {!downloadMap && !pickEnabled && (
          <SearchBox
            hiker={risultatoSingoloMappa ? false : true}
            icon={'prism-outline'}
            nonHikerIcon="arrow-back-outline"
            placeholder={tra('search.cerca')}
            onPress={() => navigation.navigate('Search')}
            value={risultatoSingoloMappa ? risultatoSingoloMappa.name : ''}
            onPressIcon={
              risultatoSingoloMappa
                ? () => dispatch(setRisultatoSingoloMappa(null))
                : null
            }
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
                ? StatusBar?.currentHeight + 75
                : insets.top + 75,
            right: 10,
          }}
          styleURL="mapbox://styles/linodev/ckw951ybo54sb15ocs835d13d">
          <MapboxGL.UserLocation
            showsUserHeadingIndicator={true}
            animated
            androidRenderMode={'compass'}
          />
          {risultatoSingoloMappa && (
            <MapboxGL.PointAnnotation
              id="searchResult"
              title="searchResult"
              coordinate={[
                parseFloat(risultatoSingoloMappa.coordinates[0]),
                parseFloat(risultatoSingoloMappa.coordinates[1]),
              ]}>
              <Icon name={'pin'} size={35} color={'#D83F31'} />
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
        {!downloadMap && !pickEnabled && (
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
                color={colors.primary}
                size={35}
              />
            )}
          </Pressable>
        )}
        {!pickEnabled && (
          <Pressable
            style={[
              styles.button,
              {
                bottom: 30,
                padding: 10,
                backgroundColor: downloadMap ? colors.blue : colors.secondary,
              },
            ]}
            onPress={() => {
              setdownloadMap(!downloadMap);
            }}>
            <Icon
              name={'cloud-download-outline'}
              color={downloadMap ? colors.secondary : colors.primary}
              size={33}
            />
          </Pressable>
        )}
        {!downloadMap && !pickEnabled && (
          <Pressable
            style={[
              styles.button,
              {
                bottom: 170,
                padding: 10,
                backgroundColor: showCurrentRadar
                  ? colors.blue
                  : colors.secondary,
              },
            ]}
            onPress={() => {
              setshowCurrentRadar(!showCurrentRadar);
            }}>
            <Icon
              name={'rainy-outline'}
              color={showCurrentRadar ? colors.secondary : colors.primary}
              size={33}
            />
          </Pressable>
        )}
        {downloadMap && (
          <View
            style={{
              position: 'absolute',
              zIndex: 999,
              top: 100,
              backgroundColor: colors.secondary,
              borderColor: colors.veryLight,
              borderWidth: 1,
              borderRadius: 10,
              alignSelf: 'center',
              width: '70%',
              padding: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'InriaSans-Regular',
                color: colors.medium,
                fontSize: 14,
              }}>
              {tra('mappa.centraArea')}
            </Text>
          </View>
        )}
        {downloadMap && (
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
              }}
            />
          </View>
        )}
        {pickEnabled && (
          <View
            style={{
              zIndex: 999,
              position: 'absolute',
              flex: 1,
              top: Dimensions.get('window').height / 2 - 15,
              left: Dimensions.get('window').width / 2 - 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="location" size={30} color={'#333'} />
          </View>
        )}
        {pickEnabled && (
          <View
            style={{
              position: 'absolute',
              zIndex: 999,
              bottom: 10,
              backgroundColor: colors.secondary,
              borderColor: colors.veryLight,
              borderWidth: 1,
              borderRadius: 10,
              alignSelf: 'center',
              width: '70%',
              padding: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'InriaSans-Regular',
                color: colors.medium,
                fontSize: 14,
                marginBottom: 10,
              }}>
              Center the screen at the right coordinates and press the button
              below
            </Text>
            <BottoneBase
              onPress={async () => {
                const coordinates = await map.current.getCoordinateFromView([
                  Dimensions.get('window').height / 2,
                  Dimensions.get('window').width / 2,
                ]);
                console.log(coordinates);
              }}
              text={'Press me'}
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
