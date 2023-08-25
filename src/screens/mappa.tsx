import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken(
  'pk.eyJ1IjoibGlub2RldiIsImEiOiJja3Rpc291amEwdTVtMndvNmw0OHhldHRkIn0.CxsTqIuyhCtGGgLNmVuEAg',
);

export const Mappa = ({navigation}) => {
  return (
    <View style={styles.page}>
      <Pressable style={{position:"absolute", top:0, left:0, backgroundColor:"red", width:100, height:100, zIndex:99}} onPress={()=>navigation.navigate("SearchScreen")}/>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
});
