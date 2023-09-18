import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import {useTranslations} from '../../hooks/useTranslations';
import {useFocusEffect} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {colors} from '../../utils/colors';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PrincipalWrapper} from '../../components/PrincipalWrapper';
import Icon from 'react-native-vector-icons/Ionicons';
import MapboxGL, {Camera} from '@rnmapbox/maps';
import {BottoneBase} from '../../components/BottoneBase';
import {
  VictoryArea,
  VictoryBar,
  VictoryChart,
  VictoryLegend,
  VictoryStack,
  VictoryTheme,
} from 'victory-native';
import {ScrollView} from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { LineChart } from 'react-native-gifted-charts';

export const PercorsoSelezionato = ({route, navigation}) => {
  const {track} = route?.params;
  const {tra} = useTranslations();
  const insets = useSafeAreaInsets();
  const [readytToRender, setReadyToRender] = React.useState(false);
  const [altitude, setAltitude] = React.useState([]);
  const [pendenza, setPendenza] = React.useState([]);
  const [pavimentazione, setPavimentazione] = React.useState([]);
  const map = useRef<MapboxGL.MapView>(null);
  const camera = useRef<Camera>(null);

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

  const zioPedroCheFunzioneDifficileCheSara = () => {
    let profiloAltrimetrico = [];
    let pendenza = [];
    let pavimentazione = [];
    let sommaCumulata = 0;
    if (!readytToRender) {
      //Profilo altimetrico
      track.features[0].properties.segments[0].steps.map(item => {
        profiloAltrimetrico.push({
          //x: sommaCumulata,
          //y: track.features[0].geometry.coordinates[item.way_points[1]][2],
          value: track.features[0].geometry.coordinates[item.way_points[1]][2],
        });
        sommaCumulata +=
          Math.round((item.distance / 1000 + Number.EPSILON) * 100) / 100;
      });

      // Pendenza
      let tot = 0;
      track.features[0].properties.extras.steepness.summary.map(item => {
        tot += item.distance;
      });
      track.features[0].properties.extras.steepness.summary.map(item => {
        pendenza.push({
          x: steepnessDictionary(item.value),
          y:
            Math.round(((item.distance * 100) / tot + Number.EPSILON) * 100) /
            100,
        });
      });

      //Pavimentazione
      let tot2 = 0;
      track.features[0].properties.extras.surface.summary.map(item => {
        tot2 += item.distance;
      });
      track.features[0].properties.extras.surface.summary.map(item => {
        pavimentazione.push({
          x: surfaceDictionary(item.value),
          y:
            Math.round(((item.distance * 100) / tot2 + Number.EPSILON) * 100) /
            100,
        });
      });
      setReadyToRender(true);
      setPendenza(pendenza);
      setPavimentazione(pavimentazione);
      setAltitude(profiloAltrimetrico);
      console.log(profiloAltrimetrico.length);
    }
  };

  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['20%', '60%'], []);

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

  useFocusEffect(
    React.useCallback(() => {
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(colors.secondary);
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(colors.secondary);
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
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: StatusBar.currentHeight + 10,
            width: '100%',
            marginLeft: 15,
          }}>
          <Pressable
            style={{flex: 1}}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="arrow-back-outline" size={30} color={colors.medium} />
          </Pressable>
        </View> */}
        <View style={{height: "82%"}}>
          <MapboxGL.MapView
            ref={map}
            style={{flex: 1, marginHorizontal: -30}}
            compassEnabled={false}
            pitchEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            scaleBarEnabled={false}
            logoEnabled={false}
            onDidFinishLoadingMap={() => {
              camera.current?.fitBounds(
                track.bbox.slice(0, 2),
                track.bbox.slice(3, 5),
                100,
              );
            }}
            compassFadeWhenNorth
            attributionEnabled={false}
            compassPosition={{
              top: 15,
              right: 10,
            }}
            styleURL="mapbox://styles/linodev/ckw951ybo54sb15ocs835d13d">
            <MapboxGL.UserLocation
              showsUserHeadingIndicator={true}
              animated
              androidRenderMode={'compass'}
            />
            <Camera ref={camera} />
            <MapboxGL.ShapeSource
              id={'hike'}
              shape={track.features[0].geometry}>
              <MapboxGL.LineLayer
                id="linelayer1"
                style={{lineColor: '#007AFF', lineWidth: 3}}
              />
            </MapboxGL.ShapeSource>
            <MapboxGL.PointAnnotation
              id="searchResult"
              title="searchResult"
              coordinate={track.features[0].geometry.coordinates[0]}>
              <View
                style={{
                  height: 15,
                  width: 15,
                  backgroundColor: 'green',
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 3,
                }}
              />
            </MapboxGL.PointAnnotation>
            <MapboxGL.PointAnnotation
              id="searchResult"
              title="searchResult"
              coordinate={track.features[0].geometry.coordinates.slice(-1)[0]}>
              <View
                style={{
                  height: 15,
                  width: 15,
                  backgroundColor: 'black',
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 3,
                }}
              />
            </MapboxGL.PointAnnotation>
          </MapboxGL.MapView>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: 20,
            justifyContent: 'center',
            width:"100%",
            paddingHorizontal: 30
          }}>
          <BottoneBase
            text={tra('percorsoSelezionato.apriMappa')}
            fixedWidth={{marginRight: 10, flex:1}}

            onPress={() => {}}
          />
          <BottoneBase
            text={tra('percorsoSelezionato.salvaTracciato')}
            fixedWidth={{flex:2}}
            outlined
            onPress={() => navigation.navigate('SaveTrack', {track: track})}
          />
        </View> */}
        {/* <View style={[{marginTop:30, paddingHorizontal:30}]}>
          <Text style={styles.sectionText}>{tra('percorsoSelezionato.info')}</Text>
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.subText}>
              {tra('percorsoSelezionato.difficolta')}
              <Text style={{fontFamily:"InriaSans-Bold"}}>
                {getTrailDifficulty(
                  track.features[0].properties.extras.traildifficulty.summary,
                )}
              </Text>
            </Text>
            <Text style={styles.subText}>
              {tra('percorsoSelezionato.distanza')}
              <Text style={{fontFamily:"InriaSans-Bold"}}>
                {(
                  Math.round(
                    (track.features[0].properties.summary.distance / 1000 +
                      Number.EPSILON) *
                      100,
                  ) / 100
                ).toString()}{' '}
                Km
              </Text>
            </Text>
            <Text style={styles.subText}>
              {tra('percorsoSelezionato.durata')}
              <Text style={{fontFamily:"InriaSans-Bold"}}>
                {(
                  Math.round(
                    (track.features[0].properties.summary.duration / 3600 +
                      Number.EPSILON) *
                      100,
                  ) / 100
                ).toString()}{' '}
                Hr
              </Text>
            </Text>
            <Text style={styles.subText}>
              {tra('percorsoSelezionato.dislivello')}
              <Text style={{fontFamily:"InriaSans-Bold"}}>{track.features[0].properties.ascent.toString()} m</Text>
            </Text>
            <Text style={styles.subText}>
              {tra('percorsoSelezionato.perditaQuota')}
              <Text style={{fontFamily:"InriaSans-Bold"}}>{track.features[0].properties.descent.toString()} m</Text>
            </Text>
          </View>
        </View>

        {readytToRender && (
          <View>
            <View style={styles.wrapperSection}>
              <Text style={styles.sectionText}>{tra('percorsoSelezionato.elevazione')}</Text>
              <VictoryChart
                width={Dimensions.get('window').width}
                height={400}
                theme={VictoryTheme.material}
              >
                <VictoryArea
                  data={altitude}
                  interpolation={'natural'}
                  style={{
                    data: {
                      fill: '#333',
                      fillOpacity: 0.5,
                      stroke: '#333',
                      strokeWidth: 4,
                      strokeOpacity: 1,
                    },
                  }}
                />
              </VictoryChart>
            </View>
            
            <View style={styles.wrapperSection}>
              <Text style={styles.sectionText}>{tra('percorsoSelezionato.pendenza')}</Text>
              <VictoryStack theme={VictoryTheme.material} height={80}>
                {pendenza.map(item => (
                  <VictoryBar barWidth={30} horizontal data={[item]} />
                ))}
              </VictoryStack>
              <View style={{marginLeft: 50, display: 'flex', height:150}}>
                <VictoryLegend
                  theme={VictoryTheme.material}
                  width={Dimensions.get('window').width}
                  height={120}
                  title={tra('percorsoSelezionato.legenda')}
                  centerTitle
                  data={pendenza.map(item => ({name: item.x}))}
                />
              </View>
            </View>
            
            <View style={styles.wrapperSection}>
              <Text style={styles.sectionText}>{tra('percorsoSelezionato.pavimentazione')}</Text>
              <VictoryStack theme={VictoryTheme.material} height={80}>
                {pavimentazione.map(item => (
                  <VictoryBar barWidth={30} horizontal data={[item]} />
                ))}
              </VictoryStack>
              <View style={{marginLeft: 10, display: 'flex', height:200}}>
                <VictoryLegend
                  theme={VictoryTheme.material}
                  width={Dimensions.get('window').width}
                  title={tra('percorsoSelezionato.legenda')}
                  centerTitle
                  borderPadding={20}
                  data={pavimentazione.map(item => ({name: item.x}))}
                />
              </View>
            </View>
          </View>
        )} */}
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
                    (track.features[0].properties.summary.distance / 1000 +
                      Number.EPSILON) *
                      100,
                  ) / 100
                ).toString()}{' '}
                Km
              </Text>
            </View>

            <View style={{flex:1}}>
              <Text style={styles.sectionText}>{tra('percorsoSelezionato.durata')}</Text>
              <Text style={styles.subText}>
                {(
                  Math.round(
                    (track.features[0].properties.summary.duration / 3600 +
                      Number.EPSILON) *
                      100,
                  ) / 100
                ).toString()}{' '}
                Hr
              </Text>
            </View>

            <View style={{flex:1}}>
              <Text style={styles.sectionText}>{tra('percorsoSelezionato.difficolta')}</Text>
              <Text numberOfLines={2} style={styles.subText}>
                {getTrailDifficulty(
                  track.features[0].properties.extras.traildifficulty.summary,
                )}
              </Text>
            </View>

          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginTop: 20,
              justifyContent: 'center',
              width:"100%",
            }}>
            <BottoneBase
              text={tra('percorsoSelezionato.apriMappa')}
              fixedWidth={{marginRight: 10, flex:1}}

              onPress={() => {}}
            />
            <BottoneBase
              text={tra('percorsoSelezionato.salvaTracciato')}
              fixedWidth={{flex:2}}
              outlined
              onPress={() => navigation.navigate('SaveTrack', {track: track})}
            />
          </View>
          {readytToRender && (
          <View>
            <View style={{alignItems:"center"}}>
              <Text style={styles.sectionText}>{tra('percorsoSelezionato.elevazione')}</Text>
              {/* <VictoryChart
                width={Dimensions.get('window').width}
                height={400}
                theme={VictoryTheme.material}
              >
                <VictoryArea
                  data={altitude}
                  interpolation={'natural'}
                  style={{
                    data: {
                      fill: '#333',
                      fillOpacity: 0.5,
                      stroke: '#333',
                      strokeWidth: 4,
                      strokeOpacity: 1,
                    },
                  }}
                />
              </VictoryChart> */}
              <LineChart
                areaChart
                data={altitude}
                startFillColor={colors.primary}
                startOpacity={0.8}
                initialSpacing={0}
                endSpacing={0}
                adjustToWidth 
                //spacing={(Dimensions.get('screen').width)/(altitude.length+70)}
                width={Dimensions.get('screen').width-120}
                height={300}
                endFillColor={colors.secondary}
                endOpacity={0.2}
                curved
                hideDataPoints
                focusEnabled
                pointerConfig={{
                  pointerColor:colors.primary,
                  activatePointersDelay:0,
                  pointerLabelComponent: items => {
                    return (
                      <View
                        style={{
                          height: 90,
                          width: 100,
                          justifyContent: 'center',
                          // marginTop: -30,
                          // marginLeft: -40,
                        }}>
                        <View
                          style={{
                            paddingHorizontal: 14,
                            paddingVertical: 6,
                            borderRadius: 16,
                            backgroundColor: 'white',
                          }}>
                          <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                            {items[0].value+ " m"}
                          </Text>
                        </View>
                      </View>
                    );
                  },
                }}
              />
            </View>
            
            <View style={styles.wrapperSection}>
              <Text style={styles.sectionText}>{tra('percorsoSelezionato.pendenza')}</Text>
              <VictoryStack theme={VictoryTheme.material} height={80}>
                {pendenza.map(item => (
                  <VictoryBar barWidth={30} horizontal data={[item]} />
                ))}
              </VictoryStack>
              <View style={{marginLeft: 50, display: 'flex', height:150}}>
                <VictoryLegend
                  theme={VictoryTheme.material}
                  width={Dimensions.get('window').width}
                  height={120}
                  title={tra('percorsoSelezionato.legenda')}
                  centerTitle
                  data={pendenza.map(item => ({name: item.x}))}
                />
              </View>
            </View>
            
            <View style={styles.wrapperSection}>
              <Text style={styles.sectionText}>{tra('percorsoSelezionato.pavimentazione')}</Text>
              <VictoryStack theme={VictoryTheme.material} height={80}>
                {pavimentazione.map(item => (
                  <VictoryBar barWidth={30} horizontal data={[item]} />
                ))}
              </VictoryStack>
              <View style={{marginLeft: 10, display: 'flex', height:200}}>
                <VictoryLegend
                  theme={VictoryTheme.material}
                  width={Dimensions.get('window').width}
                  title={tra('percorsoSelezionato.legenda')}
                  centerTitle
                  borderPadding={20}
                  data={pavimentazione.map(item => ({name: item.x}))}
                />
              </View>
            </View>
          </View>
        )}
        </BottomSheetScrollView>
      </BottomSheet>
    </PrincipalWrapper>
  );
};
const styles = StyleSheet.create({
  wrapperSection:{
    paddingHorizontal: 30,
    justifyContent:'center',
    alignItems:"center",
    marginTop:20,
    width:"100%"
  },

  sectionText:{
    fontFamily:'InriaSans-Regular',
    fontSize:16,
    color:colors.medium,
    width:'100%',
    marginBottom: 5,
    textAlign:"center"
  },
  subText:{
    fontFamily:'InriaSans-Bold',
    fontSize:18,
    color:colors.primary,
    width:'100%',
    textAlign:"center"
  }
});
