import React, {useEffect, useState} from 'react';
import {View, Pressable, Platform, StatusBar, SafeAreaView} from 'react-native';
import {useTranslations} from '../../hooks/useTranslations';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {colors} from '../../utils/colors';
import {SearchBox} from '../../components/SearchBox';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BottoneBase} from '../../components/BottoneBase';

export const Route = ({route, navigation}) => {
  const {searchStatus} = route?.params;
  const {tra} = useTranslations();
  const insets = useSafeAreaInsets();

  const [searchState, setSearchState] = useState([]);

  const queryPlaces = async query => {
    console.log('sium');
  };

  useEffect(() => {
    setSearchState(searchStatus);
  }, [searchStatus]);

  const calculate = async () => {
    let points = [];
    searchState.map(item => {
      points.push(item.searchCoordinates);
    });
    const key = '5b3ce3597851110001cf6248f3beea2f6e124872b3e48deff92f1c30';
    const url = `https://api.openrouteservice.org/v2/directions/foot-hiking/geojson`;
    const headers = {
      Authorization: key,
      'Content-Type': 'application/json',
    };
    // if (this.state.waypoints.length === 0) {
    //   points = this.state.points;
    // } else {
    //   let waypoints = this.state.waypoints.map(item => item.coordinates);
    //   points = points.concat([this.state.points[0]], waypoints, [
    //     this.state.points[1],
    //   ]);
    // }
    const body = {
      coordinates: points,
      elevation: true,
      extra_info: [
        'traildifficulty',
        'waytype',
        'waycategory',
        'steepness',
        'suitability',
        'surface',
      ],
    };
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    }).then(resp => {
      let a = resp.json();
      a.then(data => {
        navigation.navigate('PercorsoSelezionato', {track: data});
      });
      // this.setState(
      //   {
      //     route: resp.data,
      //   },
      //   () => {
      //     //onsole.log(resp.data.features[0].properties.extras.steepness);
      //     this.steepnessHanlder(
      //       resp.data.features[0].properties.extras.steepness.summary
      //     );
      //     this.elevationCalc(resp.data.features[0].geometry.coordinates);
      //     this.surfaceCalc(
      //       resp.data.features[0].properties.extras.surface.summary
      //     );
      //   }
      // );
    });
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
  const steepnessHanlder = data => {
    // data = data.map((item) => ({
    //   x: this.steepnessDictionary(item.value),
    //   y: item.amount,
    // }));
    // this.setState({ steepness: data });
  };
  const elevationCalc = data => {
    // let iso = [];
    // data.map((item, i) => {
    //   iso.push({
    //     x: i,
    //     y: item[2],
    //   });
    // });
    // this.setState({
    //   isoipse: iso,
    //   stats: true,
    //   loading: false,
    // });
  };
  const surfaceCalc = data => {
    // let tot = 0;
    // let surface = [];
    // data.map((item) => {
    //   tot += item.distance;
    // });
    // data.map((item) => {
    //   surface.push({
    //     x: this.surfaceDictionary(item.value),
    //     y:
    //       Math.round(((item.distance * 100) / tot + Number.EPSILON) * 100) /
    //       100,
    //   });
    // });
    // this.setState({
    //   surfaces: surface,
    // });
  };

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

  const getTrailDifficulty = e => {
    // let max = 0;
    // e.map((item) => {
    //   if (item.value > max) {
    //     max = item.value;
    //   }
    // });
    // return this.difficultyDictionary(max);
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
  const toggleSwitch = index => {
    // switch (index) {
    //   case 0:
    //     this.setState({
    //       profiles0: this.state.profiles0 ? false : true,
    //       profiles1: false,
    //       profiles2: false,
    //       profile: "foot-hiking",
    //     });
    //     break;
    //   case 1:
    //     this.setState({
    //       profiles0: false,
    //       profiles1: this.state.profiles1 ? false : true,
    //       profiles2: false,
    //       profile: "cycling-road",
    //     });
    //     break;
    //   case 2:
    //     this.setState({
    //       profiles0: false,
    //       profiles1: false,
    //       profiles2: this.state.profiles2 ? false : true,
    //       profile: "cycling-mountain",
    //     });
    //     break;
    // }
  };

  return (
    <View>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={{
          height: '100%',
          paddingTop:
            Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
        }}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={colors.secondary}
          translucent
        />
        <SafeAreaView
          edges={['top', 'left', 'right']}
          style={{
            flex: 1,
            backgroundColor: colors.secondary,
            paddingHorizontal: 30,
          }}>
          <View style={{marginTop: 20, marginBottom: 20}}>
            <SearchBox
              hiker={false}
              nonHikerIcon={'golf-outline'}
              icon={'arrow-back-outline'}
              placeholder={
                searchState[0]?.searchName
                  ? searchStatus[0].searchName
                  : tra('search.cerca')
              }
              callback={queryPlaces}
              onPress={() =>
                navigation.navigate('SearchScreen', {
                  pickEnabled: true,
                  fromRoute: true,
                  searchStatus: searchStatus,
                  searchInput: 0,
                })
              }
            />
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 50,
              }}>
              <Icon name="add-circle-outline" color={'#333'} size={35} />
            </View>
            <SearchBox
              hiker={false}
              nonHikerIcon={'pin-outline'}
              icon={'arrow-back-outline'}
              placeholder={
                searchState[1]?.searchName
                  ? searchStatus[1].searchName
                  : tra('search.cerca')
              }
              callback={queryPlaces}
              onPress={() =>
                navigation.navigate('SearchScreen', {
                  pickEnabled: true,
                  fromRoute: true,
                  searchStatus: searchStatus,
                  searchInput: 1,
                })
              }
            />
          </View>
          {/* TODO fix language */}
          <BottoneBase text={'Calcola Percorso'} onPress={() => calculate()} />
        </SafeAreaView>
      </KeyboardAwareScrollView>
      <Pressable
        style={{height: 100, width: 100, backgroundColor: 'red'}}
        onPress={() => navigation.navigate('PercorsoSelezionato')}
      />
    </View>
  );
};
