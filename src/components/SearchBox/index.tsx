import React from "react";
import { Dimensions, Keyboard, Pressable, TextInput, View } from "react-native";
import { styles } from "./styles";
import {BoxShadow} from 'react-native-shadow';
import { colors } from "../../utils/colors";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export const SearchBox = ({icon, placeholder, onPress=null}) =>{
    const width= Dimensions.get("window").width - 60
    const navigation = useNavigation<any>()

    const shadowOpt = {
        width: width,
        height:55,
        color: "#000",
        border: 5,
        radius:25,
        opacity:0.06,
        x:0,
        y:3,
        style:{marginVertical:5}
    }

    return(
        <BoxShadow setting={shadowOpt}>
            <View style={styles.wrapper}>
                <Pressable
                    onPress={()=>{
                        Keyboard.dismiss()
                        navigation.goBack()
                    }}
                    style={{width:"10%"}}
                >
                    <Icon name={icon} color={colors.medium} size={25}/>
                </Pressable>
                <TextInput autoFocus placeholder={placeholder} placeholderTextColor={colors.light} style={styles.textInput}/>
            </View>
            {onPress && <Pressable style={{width:"100%", height:"100%", position:"absolute"}} onPress={onPress} />}
        </BoxShadow>
    );
};