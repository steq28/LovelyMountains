import React from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "./styles";
import { colors } from "../../utils/colors";
import Icon from "react-native-vector-icons/Ionicons";

export const CardSetting = ({isEnd = false, name, icon, onPress}) =>{

    return(
        <Pressable style={[styles.wrapper, {borderBottomWidth: isEnd ? 0 : 0.5}]} onPress={onPress}>
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <View style={{width:30, height:30,borderRadius:5, alignItems:"center", justifyContent:"center", backgroundColor:colors.primary}}>
                    <Icon name={icon} size={20} color={colors.secondary}/>
                </View>
                <Text style={styles.placeText} numberOfLines={1}>{name}</Text>
            </View>
            <Icon name={"chevron-forward-outline"} size={20} color={colors.primary}/>
        </Pressable>
    );
};