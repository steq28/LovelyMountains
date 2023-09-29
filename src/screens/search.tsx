import React, {useEffect, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, Pressable, Animated} from 'react-native';
import {SearchBox} from '../components/SearchBox';
import {colors} from '../utils/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ResultCardSearch} from '../components/ResultCardSearch';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslations} from '../hooks/useTranslations';
import axios from 'axios';
import {PrincipalWrapper} from '../components/PrincipalWrapper';
import {Keyboard} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addRouteStack, setRicercaCorrente, setRisultatoSingoloMappa } from '../redux/settingsSlice';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';

export const Search = ({route, navigation}) => {
  const {pickEnabled, fromRoute, searchInput, searchStatus} = route?.params;
  const {tra} = useTranslations();
  const {ricercaCorrente} = useSelector(state => state.settings)
  const dispatch = useDispatch()
  const [autocomplete, setAutocomplete] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const [recentSearch, setRecentSearch] = useState([])
  const {lingua} = useSelector(state => state.settings)

  const queryPlaces = async query => {
    if (query.length > 4) {
      setIsLoading(true)
      await axios
        .get(
          `https://api.locationiq.com/v1/autocomplete?key=pk.2f431d7187a78c08d82874d26509ef9d&q=${query}&limit=5&accept-language=${lingua}`,
        )
        .then(res => {
          setAutocomplete(res.data);
          setIsLoading(false)
        }).catch(err => {
          setIsLoading(false)
          console.log(err)
        });
    } else {
      setAutocomplete([]);
    }
  };

  useEffect(() => {
    (async () =>{
        const localSearch = await AsyncStorage.getItem('recentSearch')
        if(localSearch){
          setRecentSearch(JSON.parse(localSearch))
        }
      }
    )()
  },[])


  useEffect(()=>{
    if(recentSearch.length > 0)
      recentSearch.map((item, index) => {
        console.log(item)
      })
  },[recentSearch])

  return (
    <PrincipalWrapper>
      <View style={{height: '10%'}}>
        <SearchBox
          icon={'arrow-back-outline'}
          placeholder={tra('search.cerca')}
          callback={queryPlaces}
          value={ricercaCorrente}
          setValue={(e) => dispatch(setRicercaCorrente(e))}
        />
      </View>
      <ScrollView keyboardShouldPersistTaps={'always'} style={{flexGrow: 1}}>
        {autocomplete.length > 0 && !isLoading && (
          <View style={{marginTop: 15}}>
              <View>
                {autocomplete.map((item:any, index) => (
                  <ResultCardSearch
                    key={index}
                    isEnd={index == autocomplete.length - 1 ? true : false}
                    name={item.display_place}
                    address={item.display_address}
                    callback={() => {
                      Keyboard.dismiss();
                      dispatch(setRicercaCorrente(""))
                      setAutocomplete([]);

                      if(recentSearch){
                        const pos = recentSearch.map(e => e.searchCoordinates.toString()).indexOf([item.lon, item.lat].toString());
                        if(pos==-1){
                          if(recentSearch.length > 4){
                            recentSearch.pop()
                          }
                          recentSearch.unshift({searchName: item.display_place, searchAddress:item.display_address, searchType:item.type, searchCoordinates: [item.lon, item.lat]})
                          AsyncStorage.setItem('recentSearch', JSON.stringify(recentSearch));
                        }
                      }else{
                        AsyncStorage.setItem('recentSearch', JSON.stringify([{searchName: item.display_place, searchAddress:item.display_address, searchType:item.type, searchCoordinates: [item.lon, item.lat]}]));
                      }

                      if (!fromRoute) {
                        dispatch(setRisultatoSingoloMappa({name: item.display_place, coordinates: [item.lon, item.lat]}))
                        navigation.navigate('Mappa');
                      } else {

                        dispatch(
                          addRouteStack({
                            index: searchInput,
                            value: {
                              searchName: item.display_place,
                              searchAddress:item.display_address,
                              searchType:item.type,
                              searchCoordinates: [item.lon, item.lat],
                            }
                          }  
                        ))

                        navigation.navigate('RouteStack', {
                          screen: 'Route',
                          params:{
                            searchStatus: searchStatus,
                          }
                        });
                      }
                    }}
                    icon={item.type=="peak" ? "prism-outline" : item.type=="cross" ? 'leaf-outline' : item.type=="waterfall" ? "water-outline" : item.type=="path" ? "footsteps-outline"  : "location-outline"}
                  />
                ))}
              </View>
          </View>
        )}

        {isLoading &&
          <View style={{flex:1,height: Dimensions.get("window").height*0.5}}>
            <ActivityIndicator size="large" color={colors.primary} style={{flex:1, alignSelf:"center"}} />
          </View>
        }

        {autocomplete.length == 0 && recentSearch.length !=0 && !isLoading && (
          <View style={{marginTop: 20}}>
            <Text style={styles.sectionTitle}>{tra("search.recenti")}</Text>
            {recentSearch.map((item, index) => (
                  <ResultCardSearch
                    key={index}
                    isEnd={index == recentSearch.length - 1 ? true : false}
                    name={item.searchName}
                    address={item.searchAddress}
                    callback={() => {
                      Keyboard.dismiss();
                      dispatch(setRicercaCorrente(""))
                      setAutocomplete([]);
                      if (!fromRoute) {
                        dispatch(setRisultatoSingoloMappa({name: item.searchName, coordinates: item.searchCoordinates}))
                        navigation.navigate('Mappa');
                      } else {

                        dispatch(
                          addRouteStack({
                            index: searchInput,
                            value: {
                              searchName: item.searchName,
                              searchAddress: item.searchAddress,
                              searchCoordinates: item.searchCoordinates,
                              searchType:item.searchType,
                            }
                          }  
                        ))
                        navigation.navigate('RouteStack', {
                            screen: 'Route'
                        });
                      }
                    }}
                    icon={item.searchType=="peak" ? "prism-outline" : item.searchType=="cross" ? 'leaf-outline' : item.searchType=="waterfall" ? "water-outline" : item.searchType=="path" ? "footsteps-outline"  : "location-outline"}
                  />
                ))}
          </View>
        )}
      </ScrollView>
      
    </PrincipalWrapper>
  );
};

export const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.primary,
    textTransform: 'uppercase',
    fontFamily: 'InriaSans-Bold',
    fontSize: 16,
    marginBottom: 10,
  },
});
