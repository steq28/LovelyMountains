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
import { useDispatch, useSelector } from 'react-redux';
import { addRouteStack, setRouteStack } from '../../redux/settingsSlice';
import { PrincipalWrapper } from '../../components/PrincipalWrapper';

export const Route = ({route, navigation}) => {
  const {tra} = useTranslations();
  const insets = useSafeAreaInsets();
  
  const {routeStack} = useSelector(state => state.settings)
  const [loading, setLoading] = useState(false);
  const [numeroBox, setNumeroBox] = useState(1);
  const dispatch = useDispatch()
  //const [searchState, setSearchState] = useState([]);

  const queryPlaces = async query => {
    console.log('sium');
  };

  const addSearchBox = () => {
    if(numeroBox<4){
      dispatch(
        addRouteStack({
          index: numeroBox,
          value: {visible:true}
        }  
      ))
      setNumeroBox(numeroBox + 1);
    }
  }

  const calculate = async () => {
    setLoading(true);
    let points = "";
    let routeAppoggio=routeStack.filter(item => Object.keys(item).length !== 0)
    routeAppoggio.map((item,index) => {
      if(Object.keys(item).length !== 0)
        points+=item.searchCoordinates[1]+","+item.searchCoordinates[0];
      if(index !== routeAppoggio.length-1)
        points+="|";
    });

    const headers = {
      'Content-Type': 'application/json',
    };

    setTimeout(()=>{
      setLoading(false);
    }, 10000)

    fetch(`https://api.geoapify.com/v1/routing?waypoints=${points}&mode=hike&lang=it&details=instruction_details,route_details,elevation&apiKey=c4e97efe9ddc40039bbf49627c43e976`, {
      method: 'GET',
      headers: headers
    }).then(resp => {
      let a = resp.json();
      a.then(data => {
        setLoading(false);
        navigation.navigate('PercorsoSelezionato',
        {
          track: data,
          routeStack: routeStack.filter(item => Object.keys(item).length !== 0)
        }
        );
      });
    }).catch(err => (console.log("Errrrrore", err)));
  };


  return (
    <PrincipalWrapper name={"Calcola percorso"}>
      <View style={{marginBottom: 20}}>
        <SearchBox
          hiker={false}
          nonHikerIcon={'golf-outline'}
          icon={'arrow-back-outline'}
          placeholder={tra("route.partenza")}
          value={Object.keys(routeStack[0]).length > 1 ? routeStack[0].searchName : ""}
          callback={queryPlaces}
          onPress={() =>
            navigation.navigate('Search', {
              pickEnabled: true,
              fromRoute: true,
              searchInput: 0,
            })
          }
        />
        <Pressable
          onPress={addSearchBox}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 50,
          }}>
          <Icon name="add-circle-outline" color={colors.primary} size={35} />
        </Pressable>
        {routeStack.map((item: any, index: number) => (
          (index!=0 && index!=(routeStack.length-1) && item.visible) &&
            <SearchBox
              hiker={false}
              nonHikerIcon={'pin-outline'}
              icon={'arrow-back-outline'}
              placeholder={`Tappa ${index}`}
              value={Object.keys(item).length > 1 ? item.searchName : ""}
              callback={queryPlaces}
              onPress={() =>{
                  navigation.navigate('Search', {
                    pickEnabled: true,
                    fromRoute: true,
                    searchInput: index,
                  })
                }
              }
            />
          ))
        }
        <SearchBox
          hiker={false}
          nonHikerIcon={'pin-outline'}
          icon={'arrow-back-outline'}
          placeholder={tra("route.arrivo")}
          value={Object.keys(routeStack[4]).length > 1 ? routeStack[4].searchName : ""}
          callback={queryPlaces}
          onPress={() =>{
              navigation.navigate('Search', {
                pickEnabled: true,
                fromRoute: true,
                searchInput: 4,
              })
            }
          }
        />
      </View>
      {/* TODO fix language */}
      <BottoneBase text={tra("route.calcolaPercorso")} isLoading={loading} onPress={() => calculate()} />
    </PrincipalWrapper>
  );
};
