import React, { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { styles } from "./styles";
import { colors } from "../../utils/colors";
import Icon from "react-native-vector-icons/Ionicons";

export const CardPercorso = ({name, img, onPress, onDelete}) =>{
    
    return(
        <Pressable style={styles.wrapper} onPress={onPress}>
            <View style={styles.left}>
                <View style={{height:70, width:70, borderRadius:5, overflow:"hidden"}}>
                    <Image source={{uri: "https://picsum.photos/200"}} style={{resizeMode:"cover", height:"100%", width:"100%"}}/>
                </View>
                <View style={{marginLeft:10, justifyContent:"center"}}>
                    <Text numberOfLines={2} style={styles.nomePercorso}>Cammino di Santiago</Text>
                    <Text numberOfLines={1} style={styles.statsText}>Lunghezza totale: <Text style={{fontFamily:"InriaSans-Light"}}>50km</Text></Text>
                    <Text numberOfLines={1} style={styles.statsText}>Durata media: <Text style={{fontFamily:"InriaSans-Light"}}>2h e 43 min</Text></Text>
                </View>
            </View>
            <Pressable style={styles.right} onPress={onDelete}>
                <Icon name={"trash-outline"} size={26} color={colors.light}/>
            </Pressable>
        </Pressable>
    );
};