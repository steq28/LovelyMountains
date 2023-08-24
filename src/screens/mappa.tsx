import React from "react"
import { Pressable, View } from "react-native"

export const Mappa = ({navigation}) =>{
    return(
        <View>
            <Pressable style={{backgroundColor:"red", width:100, height:100}} onPress={()=> navigation.navigate("SearchScreen")}></Pressable>
        </View>
    )
}