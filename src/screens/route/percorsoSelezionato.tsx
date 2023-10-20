import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';

import {useTranslations} from '../../hooks/useTranslations';
import {useFocusEffect} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {colors} from '../../utils/colors';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PrincipalWrapper} from '../../components/PrincipalWrapper';
import MapboxGL, {Camera} from '@rnmapbox/maps';
import {BottoneBase} from '../../components/BottoneBase';
import BottomSheet, {
  BottomSheetScrollView
} from '@gorhom/bottom-sheet';
import {LineChart} from 'react-native-gifted-charts';
import Icon from 'react-native-vector-icons/Ionicons';
import SystemSetting from 'react-native-system-setting';
import GetLocation from 'react-native-get-location';

export const PercorsoSelezionato = ({route, navigation}) => {
  const {track, routeStack} = route?.params;
  const {tra} = useTranslations();
  const insets = useSafeAreaInsets();
  const [readytToRender, setReadyToRender] = React.useState(false);
  const [altitude, setAltitude] = useState([]);
  const [pendenza, setPendenza] = useState([]);
  const [pavimentazione, setPavimentazione] = React.useState([]);
  const [pendenzaVisualizzata, setPendenzaVisualizzata] = React.useState({
    descrizione: '',
    value: 0,
  });
  const map = useRef<MapboxGL.MapView>(null);
  const [currentLocation, setcurrentLocation] = useState([0, 0]);
  const [hasLocationPermissions, sethasLocationPermissions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrayTracciato, setArrayTracciato] = useState([]);
  const [showPendenza, setShowPendenza] = useState(false);

  const camera = useRef<Camera>(null);
  const colorPalette = [
    '#0095FF',
    '#93FCF8',
    '#BDB2FA',
    '#FFA5BA',
    '#4E8074',
    '#FFD86A',
    '#FFF86A',
    '#A6D46A',
    '#6AC4D8',
    '#6A8CD8',
    '#6A6AD8',
    '#8C6AD8',
  ];

  const getTrailDifficulty = e => {
    let max = 0;
    e.map(item => {
      if (item.value > max) {
        max = item.value;
      }
    });
    return difficultyDictionary(max);
  };

  const difficultyDictionary = max => {
    switch (max) {
      case 0:
        return 'Easy';
      case 1:
        return 'Hiking';
      case 2:
        return 'Mountain hiking';
      case 3:
        return 'Demanding mountain hiking';
      case 4:
        return 'Alpine hiking';
      case 5:
        return 'Demanding alpine hiking';
      case 6:
        return 'Difficult alpine hiking';
      case 7:
        return 'no tags';
    }
  };

  // const downloadGeoJson = async () => {
  //   let fileUri =
  //     FileSystem.documentDirectory +
  //     Math.floor(Math.random() * 1000000).toString() +
  //     '.geojson';
  //   await FileSystem.writeAsStringAsync(
  //     fileUri,
  //     JSON.stringify(this.state.route),
  //     {encoding: FileSystem.EncodingType.UTF8},
  //   );
  // };
  const percentageToHsl = (percentage, hue0, hue1) => {
    var hue = (percentage * (hue1 - hue0)) + hue0;
    return 'hsl(' + hue + ', 90%, 50%)';
}

  const zioPedroCheFunzioneDifficileCheSara = () => {
    let profiloAltrimetrico = [];
    let pendenza = 0;
    let pavimentazione = [];
    let sommaCumulata = 0;
    let arrayTracciatoTemp=[];


    if (!readytToRender) {

      track.features[0].properties.legs[0].elevation.map(item => {
        profiloAltrimetrico.push({
          value: item
        });
      })

      track.features[0].properties.legs[0].steps.map((item, index) => {
        if(track.features[0].geometry.coordinates[0].slice(item.from_index,item.to_index+1).length>1){
          pendenza = Math.round(((item.elevation_gain/item.distance) + Number.EPSILON) * 100) / 100
          if(index>0&& track.features[0].properties.legs[0].steps[index-1].to_index!=track.features[0].properties.legs[0].steps[index].from_index)
            pendenza = Math.round(((track.features[0].properties.legs[0].steps[index-1].elevation_gain/track.features[0].properties.legs[0].steps[index-1].distance) + Number.EPSILON) * 100) / 100
          arrayTracciatoTemp.push({
            type: "Feature",
            properties: {
              colorPendenza: percentageToHsl(pendenza/0.37, 70, 0),//`rgb(${colorChange(pendenza).red}, ${colorChange(pendenza).green}, 0)`,
              colorSurface: item.surface=="paved_smooth" ? "yellow" : item.surface=="paved"? "red" : item.surface=="paved_rough"? "green": item.surface=="compacted"? "#3D0C11" : item.surface=="dirt"? "orange" : item.surface=="gravel"? "blue" : item.surface=="path"? "black" : "#000"
            },
            geometry: {
              type: "LineString",
              coordinates: index > 0 && track.features[0].properties.legs[0].steps[index-1].to_index!=track.features[0].properties.legs[0].steps[index].from_index ? track.features[0].geometry.coordinates[0].slice(track.features[0].properties.legs[0].steps[index-1].to_index,item.to_index+1) : track.features[0].geometry.coordinates[0].slice(item.from_index,item.to_index+1)
            }
          })
        }else{
          if(track.features[0].properties.legs[0].steps[index-1].to_index!=item.to_index){
            pendenza = Math.round(((track.features[0].properties.legs[0].steps[index-1].elevation_gain/track.features[0].properties.legs[0].steps[index-1].distance) + Number.EPSILON) * 100) / 100
            arrayTracciatoTemp.push({
              type: "Feature",
              properties: {
                colorPendenza: percentageToHsl(pendenza/0.4, 70, 0),//`rgb(${colorChange(pendenza).red}, ${colorChange(pendenza).green}, 0)`,
                colorSurface: item.surface=="paved_smooth" ? "yellow" : item.surface=="paved"? "red" : item.surface=="paved_rough"? "green": item.surface=="compacted"? "#3D0C11" : item.surface=="dirt"? "orange" : item.surface=="gravel"? "blue" : item.surface=="path"? "black" : "#000"
              },
              geometry: {
                type: "LineString",
                coordinates: track.features[0].geometry.coordinates[0].slice(track.features[0].properties.legs[0].steps[index-1].to_index)
              }
            })
          }
        }
      })

      setArrayTracciato(arrayTracciatoTemp)
      // Pendenza
      // let tot = 0;
      // let pendenzaTemp = {descrizione: '', value: 0};
      // track.features[0].properties.extras.steepness.summary.map(item => {
      //   tot += item.distance;
      // });
      // track.features[0].properties.extras.steepness.summary.map(
      //   (item, index) => {
      //     pendenza.push({
      //       x: steepnessDictionary(item.value),
      //       y:
      //         Math.round(((item.distance * 100) / tot + Number.EPSILON) * 100) /
      //         100,
      //     });
      //     // let valore =
      //     //   Math.round(((item.distance * 100) / tot + Number.EPSILON) * 100) /
      //     //   100;
      //     // if (pendenzaTemp.value < valore)
      //     //   pendenzaTemp = {
      //     //     descrizione: steepnessDictionary(item.value),
      //     //     value: valore,
      //     //   };

      //     // pendenza.push({
      //     //   //x: steepnessDictionary(item.value),
      //     //   descrizione: steepnessDictionary(item.value),setAltitude
      //     //   color: colorPalette[index],
      //     //   value: valore,
      //     // });
      //   },
      // );
      // // setPendenzaVisualizzata(pendenzaTemp);
      // //Pavimentazione
      // let tot2 = 0;
      // track.features[0].properties.extras.surface.summary.map(item => {
      //   tot2 += item.distance;
      // });
      // track.features[0].properties.extras.surface.summary.map(item => {
      //   pavimentazione.push({
      //     x:
      //       surfaceDictionary(item.value) +
      //       ':  ' +
      //       Math.round((item.distance / 1000 + Number.EPSILON) * 100) / 100 +
      //       'Km',
      //     y:
      //       Math.round(((item.distance * 100) / tot2 + Number.EPSILON) * 100) /
      //       100,
      //   });
      // });
      setReadyToRender(true);
      setAltitude(profiloAltrimetrico);
    }
  };

  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['20%', '50%', '83%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const surfaceDictionary = value => {
    switch (value) {
      case 0:
        return 'Unknown';
      case 1:
        return 'Paved';
      case 2:
        return 'Unpaved';
      case 3:
        return 'Asphalt';
      case 4:
        return 'Concrete';
      case 5:
        return 'Cobblestone';
      case 6:
        return 'Metal';
      case 7:
        return 'Wood';
      case 8:
        return 'Compacted Gravel';
      case 9:
        return 'Fine Gravel';
      case 10:
        return 'Gravel';
      case 11:
        return 'Dirt';
      case 12:
        return 'Ground';
      case 13:
        return 'Ice';
      case 14:
        return 'Paving Stones';
      case 15:
        return 'Sand';
      case 16:
        return 'Woodchips';
      case 17:
        return 'Grass';
      case 18:
        return 'Grass Paver';
    }
  };

  const steepnessDictionary = item => {
    switch (item) {
      case -5:
        return '> -16%';
      case -4:
        return '- 12-15%';
      case -3:
        return '- 7-11%';
      case -2:
        return '- 4-6%';
      case -1:
        return '- 1-3%';
      case 0:
        return '0%';
      case 1:
        return '1-3%';
      case 2:
        return '4-6%';
      case 3:
        return '7-11%';
      case 4:
        return '12-15%';
      case 5:
        return '> 16%';
    }
  };
  useEffect(() => {
    zioPedroCheFunzioneDifficileCheSara();
  });

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

  useFocusEffect(
    useCallback(() => {
      // Platform.OS === 'android' &&
      //   StatusBar.setBackgroundColor(colors.secondary);
      navigation.getParent().setOptions({
        tabBarStyle: {display: 'none'},
      });

      return () => {
        navigation.getParent().setOptions({
          tabBarStyle: {
            display: 'flex',
            height: 70,
            borderTopWidth: 0,
          },
        });
      };
    }, []),
  );
  return (
    <PrincipalWrapper fullscreen>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        translucent
      />
      <View style={{position:"absolute", flexDirection:"row", zIndex:999999,borderWidth:1, borderColor:colors.light, borderRadius:20, paddingHorizontal:10, paddingVertical:10, alignItems:"center", justifyContent:"center", top:Platform.OS==='android' ? StatusBar.currentHeight : insets.top, left:20, width:Dimensions.get("screen").width-40, backgroundColor:colors.secondary}}>
        <Icon name="arrow-back-outline" size={30} color={colors.primary} onPress={()=>navigation.goBack()}/>
        <View style={{flexDirection:"row", flex:1, marginLeft:10, overflow:'hidden'}}>
          <Text numberOfLines={1} style={{fontFamily:"InriaSans-Bold", fontSize:16, color:colors.primary, textAlign:"left"}}>
            {routeStack.map((item, index)=>{
              if(index==routeStack.length-1)
                return item.searchName
              else
                return item.searchName + " > "
            })}
          </Text>

        </View>
      </View>
      <View style={{height: "90%"}}>
        <MapboxGL.MapView
          ref={map}
          style={{flex: 1}}
          compassEnabled={true}
          pitchEnabled={false}
          scrollEnabled={true}
          rotateEnabled={true}
          scaleBarEnabled={false}
          zoomEnabled={true}
          logoEnabled={false}
          onDidFinishLoadingMap={() => {
            camera.current?.fitBounds(
              [track.properties.waypoints[0].lon,track.properties.waypoints[0].lat],
              [track.properties.waypoints[1].lon,track.properties.waypoints[1].lat],
              150
            );
          }}

          
          //compassFadeWhenNorth
          attributionEnabled={false}
          compassPosition={{
            top: Platform.OS === 'android' ? StatusBar.currentHeight + 70 : insets.top + 70,
            right: 10,
          }}
          styleURL="mapbox://styles/linodev/ckw951ybo54sb15ocs835d13d"
        >
          <MapboxGL.UserLocation
            showsUserHeadingIndicator={true}
            animated
            androidRenderMode={'compass'}
          />

          <Camera ref={camera} />

          {/* {arrayTracciato?.map((item, index)=>(
            <MapboxGL.ShapeSource
              id={`hike`}
              shape={item}
            >
              <MapboxGL.LineLayer
                id={`linelayer${index}`}
                style={{lineColor: item.color, lineWidth: 4}}
              />
            </MapboxGL.ShapeSource>
            ))
          } */}
          <MapboxGL.ShapeSource
              id={`hike`}
              shape={{
                type: "FeatureCollection",
                features: arrayTracciato,
              }}
            >
              <MapboxGL.LineLayer
                id={`linelayer`}
                style={{
                  lineColor: showPendenza ? ["get", "colorPendenza"] : colors.blue,
                  lineWidth: 4,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
          </MapboxGL.ShapeSource>
          <MapboxGL.PointAnnotation
            id="searchResult"
            title="searchResult"
            coordinate={[track.properties.waypoints[0].lon,track.properties.waypoints[0].lat]}>
            <View style={{backgroundColor:colors.secondary, borderRadius:99999, padding:3, borderColor:colors.primary, borderWidth:2}}>
              <Icon name="location" size={14} color={colors.primary} />
            </View>
          </MapboxGL.PointAnnotation>

          <MapboxGL.PointAnnotation
            id="searchResult"
            title="searchResult"
            coordinate={[track.properties.waypoints[1].lon,track.properties.waypoints[1].lat]}
          >
            <View style={{backgroundColor:colors.secondary, borderRadius:99999, padding:4, borderColor:colors.primary, borderWidth:2}}>
              <Icon name="flag" size={13} color={colors.primary} />
            </View>
          </MapboxGL.PointAnnotation>

        </MapboxGL.MapView>
        <Pressable
          style={[styles.button, {top: Dimensions.get('screen').height * 0.66 - 130, padding:9.5}]}
          disabled={loading}
          onPress={() => {
            setShowPendenza(!showPendenza)
          }}>
            <Icon
              name={'trending-up-outline'}
              color={showPendenza ? colors.blue : colors.primary}
              size={30}
            />
        </Pressable>

        <Pressable
          style={[styles.button, {top: Dimensions.get('screen').height * 0.66 - 65, padding:9.5}]}
          disabled={loading}
          onPress={() => {
            camera.current?.fitBounds(
              [track.properties.waypoints[0].lon,track.properties.waypoints[0].lat],
              [track.properties.waypoints[1].lon,track.properties.waypoints[1].lat],
              150, 1000
            );
          }}>
            <Icon
              name={'scan'}
              color={colors.primary}
              size={30}
            />
        </Pressable>
        
        <Pressable
          style={styles.button}
          disabled={loading}
          onPress={() => {
            setLoading(true);

            SystemSetting.isLocationEnabled().then(enable => {
              if (enable) {
                if (JSON.stringify(currentLocation) != JSON.stringify([0, 0])) {
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
                ToastAndroid.show(tra('mappa.abilitaGeo'), ToastAndroid.SHORT);
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
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
      >
        <BottomSheetScrollView style={{paddingHorizontal:30, paddingVertical:10}}>
          <View style={{flexDirection:"row", alignItems:"flex-start", justifyContent:"center"}}>
            <View style={{flex:1}}>
              <Text style={styles.sectionText}>{tra('percorsoSelezionato.distanza')}</Text>
              <Text style={styles.subText}>
                {(
                  Math.round(
                    (track.features[0].properties.distance / 1000 +
                      Number.EPSILON) *
                      100,
                  ) / 100
                ).toString()}{' '}
                Km
              </Text>
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.sectionText}>
                {tra('percorsoSelezionato.durata')}
              </Text>
              <Text style={styles.subText}>
                {
                  Math.floor(track.features[0].properties.time / 3600 ) > 0 &&
                  Math.floor(track.features[0].properties.time / 3600 )+ "H " 
                }
                {Math.floor(((track.features[0].properties.time / 3600 ) - Math.floor(track.features[0].properties.time / 3600 ))*60)}
                min
              </Text>
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.sectionText}>
                {tra('percorsoSelezionato.difficolta')}
              </Text>
              <Text numberOfLines={2} style={styles.subText}>
                {/* {getTrailDifficulty(
                  track.features[0].properties.extras.traildifficulty.summary,
                )} */}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginTop: 20,
              justifyContent: 'center',
              width: '100%',
            }}>
            {/* <BottoneBase
              text={tra('percorsoSelezionato.apriMappa')}
              fixedWidth={{marginRight: 10, flex: 1}}
              onPress={() => {}}
            /> */}
            <BottoneBase
              text={tra('percorsoSelezionato.salvaTracciato')}
              fixedWidth={{flex: 2}}
              icon="arrow-down-circle-outline"
              //outlined
              onPress={() => navigation.navigate('SaveTrack', {track: track, routeStack: routeStack})}
            />
          </View>
          {readytToRender && (
            <View style={{marginTop: 50}}>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.sectionText}>
                  {tra('percorsoSelezionato.elevazione')}
                </Text>
                <LineChart
                  areaChart
                  data={altitude}
                  startFillColor={colors.primary}
                  startOpacity={0.8}
                  initialSpacing={0}
                  endSpacing={0}
                  adjustToWidth
                  //spacing={(Dimensions.get('screen').width)/(altitude.length+70)}
                  width={Dimensions.get('screen').width - 120}
                  height={250}
                  noOfSections={7}
                  //stepValue={50}
                  endFillColor={colors.secondary}
                  endOpacity={0.2}
                  curved
                  yAxisTextStyle={{
                    fontFamily: 'InriaSans-Regular',
                    color: colors.medium,
                    margin: 0,
                  }}
                  hideDataPoints
                  yAxisLabelSuffix={' m'}
                  yAxisLabelWidth={50}
                  yAxisLabelContainerStyle={{
                    margin: 0,
                    paddingRight: 5,
                    justifyContent: 'flex-end',
                  }}
                  // pointerConfig={{
                  //   pointerColor: colors.primary,
                  //   activatePointersDelay: 0,
                  //   pointerLabelComponent: items => {
                  //     return (
                  //       <View
                  //         style={{
                  //           height: 90,
                  //           width: 100,
                  //           justifyContent: 'center',
                  //         }}>
                  //         <View
                  //           style={{
                  //             paddingHorizontal: 14,
                  //             paddingVertical: 6,
                  //             borderRadius: 16,
                  //             backgroundColor: 'white',
                  //             borderColor: colors.primary,
                  //             borderWidth: 1,
                  //           }}>
                  //           <Text
                  //             style={{
                  //               fontFamily: 'InriaSans-Regular',
                  //               color: colors.primary,
                  //               textAlign: 'center',
                  //             }}>
                  //             {items[0].value + ' m'}
                  //           </Text>
                  //         </View>
                  //       </View>
                  //     );
                  //   },
                  // }}
                />
              </View>
{/* 
              <View style={styles.wrapperSection}>
                <Text style={[styles.sectionText]}>
                  {tra('percorsoSelezionato.pendenza')}
                </Text>
                <VictoryStack theme={VictoryTheme.material} height={80}>
                  {pendenza.map(item => (
                    <VictoryBar barWidth={30} horizontal data={[item]} />
                  ))}
                </VictoryStack>
                <View style={{marginLeft: 50, display: 'flex', height: 150}}>
                  <VictoryLegend
                    theme={VictoryTheme.material}
                    width={Dimensions.get('window').width}
                    height={120}
                    title={tra('percorsoSelezionato.legenda')}
                    centerTitle
                    data={pendenza.map(item => ({name: item.x}))}
                  />
                </View> */}
                {/* <PieChart
                  data={pendenza}
                  donut
                  focusOnPress
                  onPress={val => {
                    setPendenzaVisualizzata(val);
                  }}
                  showGradient
                  sectionAutoFocus
                  radius={90}
                  innerRadius={60}
                  innerCircleColor={colors.primary}
                  centerLabelComponent={() => {
                    return (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 22,
                            color: colors.secondary,
                            fontFamily: 'InriaSans-Bold',
                          }}>
                          {pendenzaVisualizzata.value + '%'}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: colors.secondary,
                            fontFamily: 'InriaSans-Light',
                          }}>
                          {pendenzaVisualizzata.descrizione}
                        </Text>
                      </View>
                    );
                  }}
                /> */}
              {/* </View>

              <View style={[styles.wrapperSection, {marginBottom: 40}]}>
                <Text style={styles.sectionText}>
                  {tra('percorsoSelezionato.pavimentazione')}
                </Text>
                <VictoryStack theme={VictoryTheme.material} height={80}>
                  {pavimentazione.map(item => (
                    <VictoryBar barWidth={30} horizontal data={[item]} />
                  ))}
                </VictoryStack>
                <View style={{marginLeft: 10, display: 'flex'}}>
                  <VictoryLegend
                    theme={VictoryTheme.material}
                    width={Dimensions.get('window').width}
                    title={tra('percorsoSelezionato.legenda')}
                    centerTitle
                    borderPadding={20}
                    data={pavimentazione.map(item => ({name: item.x}))}
                  />
                </View>
              </View> */}
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </PrincipalWrapper>
  );
};
const styles = StyleSheet.create({
  wrapperSection: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },

  sectionText: {
    fontFamily: 'InriaSans-Regular',
    fontSize: 16,
    color: colors.medium,
    width: '100%',
    marginBottom: 5,
    textAlign: 'center',
  },
  subText:{
    fontFamily:'InriaSans-Bold',
    fontSize:18,
    color:colors.primary,
    width:'100%',
    textAlign:"center"
  },
  button: {
    position: 'absolute',
    backgroundColor: 'white',
    //zIndex: 999,
    top: Dimensions.get('screen').height * 0.66,
    right: 10,
    borderRadius: 30,
    padding: 7,
    elevation: 4,
  }
});
