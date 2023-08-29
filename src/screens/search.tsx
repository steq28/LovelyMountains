import React, {useState} from 'react';
import {ScrollView, View, Text, StyleSheet, Pressable} from 'react-native';
import {SearchBox} from '../components/SearchBox';
import {colors} from '../utils/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ResultCardSearch} from '../components/ResultCardSearch';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslations} from '../hooks/useTranslations';
import i18n from '../translations';
import axios from 'axios';

export const SearchScreen = () => {
  const {tra} = useTranslations();
  const [autocomplete, setAutocomplete] = useState([]);

  const queryPlaces = async query => {
    console.log(query);
    if (query.length > 4) {
      await axios
        .get(
          `https://api.openrouteservice.org/geocode/autocomplete?api_key=5b3ce3597851110001cf6248f3beea2f6e124872b3e48deff92f1c30&text=${query}&size=5`,
        )
        .then(res => {
          //console.log(res.data.features);
          setAutocomplete(res.data.features);
        });
    }
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={'always'}
      contentContainerStyle={{height: '100%'}}>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{
          flex: 1,
          backgroundColor: colors.secondary,
          paddingHorizontal: 30,
        }}>
        <View style={{height: '10%'}}>
          <SearchBox
            icon={'arrow-back-outline'}
            placeholder={tra('search.cerca')}
            callback={queryPlaces}
          />
        </View>
        <ScrollView style={{flexGrow: 1}}>
          <View style={{marginTop: 15}}>
            <Text style={styles.sectionTitle}>luoghi</Text>
            {autocomplete.length == 0 && (
              <View>
                <ResultCardSearch
                  isEnd={false}
                  name={tra('welcome')}
                  icon={'leaf-outline'}
                />
                <ResultCardSearch
                  isEnd={false}
                  name={'Monte Resegone, Monza (MB)'}
                  icon={'leaf-outline'}
                />
                <ResultCardSearch
                  isEnd={true}
                  name={'San Giovanni Bianco, Bergamo'}
                  icon={'location-outline'}
                />
              </View>
            )}
            {autocomplete.length > 0 && (
              <View>
                {autocomplete.map((item, index) => (
                  <ResultCardSearch
                    key={index}
                    isEnd={index == autocomplete.length - 1 ? true : false}
                    name={item.properties.name}
                    icon={'location-outline'}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={{marginTop: 20}}>
            <Text style={styles.sectionTitle}>recenti</Text>
            <ResultCardSearch
              isEnd={false}
              name={'Monte Zucco, San Pellegrino Terme (BG)'}
              icon={'timer-outline'}
            />
            <ResultCardSearch
              isEnd={false}
              name={'Monte Resegone, Monza (MB)'}
              icon={'timer-outline'}
            />
            <ResultCardSearch
              isEnd={true}
              name={'San Giovanni Bianco, Bergamo'}
              icon={'timer-outline'}
            />
          </View>
          <Pressable
            onPress={() => {
              i18n.changeLanguage('en');
            }}
            style={{height: 100, width: 100, backgroundColor: 'red'}}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAwareScrollView>
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
