import React, {useEffect, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, Pressable} from 'react-native';
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
import { addRouteStack, setRicercaCorrente } from '../redux/settingsSlice';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SearchScreen = ({route, navigation}) => {
  const {pickEnabled, fromRoute, searchInput, searchStatus} = route?.params;
  const {tra} = useTranslations();
  const {ricercaCorrente} = useSelector(state => state.settings)
  const dispatch = useDispatch()
  const [autocomplete, setAutocomplete] = useState([]);

  const [recentSearch, setRecentSearch] = useState([])

  const queryPlaces = async query => {
    if (query.length > 4) {
      await axios
        .get(
          `https://api.openrouteservice.org/geocode/autocomplete?api_key=5b3ce3597851110001cf6248f3beea2f6e124872b3e48deff92f1c30&text=${query}&size=5`,
        )
        .then(res => {
          //console.log(res.data.features);
          setAutocomplete(res.data.features);
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
  })

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
        {autocomplete.length > 0 && (
          <View style={{marginTop: 15}}>
            {autocomplete.length > 0 && (
              <View>
                {autocomplete.map((item, index) => (
                  <ResultCardSearch
                    key={index}
                    isEnd={index == autocomplete.length - 1 ? true : false}
                    name={item.properties.name}
                    callback={() => {
                      Keyboard.dismiss();
                      dispatch(setRicercaCorrente(""))
                      setAutocomplete([]);

                      if(recentSearch){
                        if(recentSearch.length > 4){
                          recentSearch.pop()
                        }
                        recentSearch.unshift({searchName: item.properties.name , searchCoordinates: item.geometry.coordinates})
                        AsyncStorage.setItem('recentSearch', JSON.stringify(recentSearch));
                      }else{
                        AsyncStorage.setItem('recentSearch', JSON.stringify([{searchName: item.properties.name, searchCoordinates: item.geometry.coordinates}]));
                      }

                      if (!fromRoute) {
                        navigation.navigate('Mappa', {
                          searchResult: true,
                          searchCoordinates: item.geometry.coordinates,
                        });
                      } else {

                        dispatch(
                          addRouteStack({
                            index: searchInput,
                            value: {
                              searchName: item.properties.name,
                              searchCoordinates: item.geometry.coordinates,
                            }
                          }  
                        ))
                        navigation.navigate('Route', {
                          searchStatus: searchStatus,
                        });
                      }
                    }}
                    icon={'location-outline'}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {autocomplete.length == 0 && recentSearch.length !=0 && (
          <View style={{marginTop: 20}}>
            <Text style={styles.sectionTitle}>recenti</Text>
            {recentSearch.map((item, index) => (
                  <ResultCardSearch
                    key={index}
                    isEnd={index == recentSearch.length - 1 ? true : false}
                    name={item.searchName}
                    callback={() => {
                      Keyboard.dismiss();
                      dispatch(setRicercaCorrente(""))
                      setAutocomplete([]);
                      if (!fromRoute) {
                        navigation.navigate('Mappa', {
                          searchResult: true,
                          searchCoordinates: item.searchCoordinates,
                        });
                      } else {

                        dispatch(
                          addRouteStack({
                            index: searchInput,
                            value: {
                              searchName: item.searchName,
                              searchCoordinates: item.searchCoordinates,
                            }
                          }  
                        ))

                        navigation.navigate('Route');
                      }
                    }}
                    icon={'location-outline'}
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
