import React, {useCallback, useRef} from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import {useTranslations} from '../../hooks/useTranslations';
import {SearchBox} from '../../components/SearchBox';
import {useFocusEffect} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {colors} from '../../utils/colors';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PrincipalWrapper} from '../../components/PrincipalWrapper';
import Icon from 'react-native-vector-icons/Ionicons';
import MapboxGL, {Camera} from '@rnmapbox/maps';
import {BottoneBase} from '../../components/BottoneBase';

export const PercorsoSelezionato = ({route, navigation}) => {
  const {track} = route?.params;
  const {tra} = useTranslations();
  const insets = useSafeAreaInsets();
  const map = useRef<MapboxGL.MapView>(null);
  const camera = useRef<Camera>(null);

  const queryPlaces = async query => {
    console.log('sium');
  };

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
    <PrincipalWrapper>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <Pressable
          style={{flex: 0.3}}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="arrow-back-outline" size={30} color={colors.medium} />
        </Pressable>
        <View
          style={{
            flex: 0.3,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Icon name="flag-outline" size={30} color={colors.medium} />
          <Icon
            name="ellipsis-vertical-outline"
            size={30}
            color={colors.light}
          />
          <Icon name="location-outline" size={30} color={colors.medium} />
        </View>
        <View style={{flex: 1.7, marginHorizontal: 10}}>
          <SearchBox small placeholder={''} onPress={() => {}} />
          <View style={{height: 20}} />
          <SearchBox small placeholder={''} onPress={() => {}} />
        </View>
        <Pressable
          style={{flex: 0.3, alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="repeat-outline" size={30} color={colors.medium} />
        </Pressable>
      </View>
      <View style={{height: 250, marginTop: 20}}>
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
              10,
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
          <MapboxGL.ShapeSource id={'hike'} shape={track.features[0].geometry}>
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: 20,
          justifyContent: 'center',
        }}>
        <BottoneBase
          text={'Avvia'}
          fixedWidth={{marginRight: 10}}
          onPress={() => {}}
        />
        <BottoneBase
          text={'Salva tracciato offline'}
          outlined
          onPress={() => {}}
        />
      </View>
      <Text>DATA</Text>
      <View style={{flexDirection: 'column'}}>
        <Text>
          Difficulty:{' '}
          {getTrailDifficulty(
            track.features[0].properties.extras.traildifficulty.summary,
          )}
        </Text>
        <Text>
          Distance:{' '}
          {(
            Math.round(
              (track.features[0].properties.summary.distance / 1000 +
                Number.EPSILON) *
                100,
            ) / 100
          ).toString()}{' '}
          Km
        </Text>
        <Text>
          Duration:{' '}
          {(
            Math.round(
              (track.features[0].properties.summary.duration / 3600 +
                Number.EPSILON) *
                100,
            ) / 100
          ).toString()}{' '}
          Hr
        </Text>
        <Text>
          Elevation gain: {track.features[0].properties.ascent.toString()} m
        </Text>
        <Text>
          Elevation loss: {track.features[0].properties.descent.toString()} m
        </Text>
      </View>
    </PrincipalWrapper>
  );
};
const styles = StyleSheet.create({});
