import React from "react"
import { View } from "react-native"
import { SearchBox } from "../../components/SearchBox"
import { colors } from "../../utils/colors"

export const SearchScreen = () =>{
    return(
        <View style={{flex:1, backgroundColor:colors.secondary}}>
            <SearchBox/>
        </View>
    )
}