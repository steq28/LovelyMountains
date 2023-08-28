import React from "react"
import { SafeAreaView, StyleSheet, Text, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { colors } from "../utils/colors"
import { useTranslations } from "../hooks/useTranslations"

export const Download = ()=>{
    const { tra } = useTranslations();
    return(
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}  contentContainerStyle={{ height: "100%" }}>
            <SafeAreaView edges={['top', 'left', 'right']} style={{flex:1, backgroundColor:colors.secondary, paddingHorizontal:30}}>
                <Text style={styles.titolo}>{tra("impostazioni.titolo")}</Text>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}

export const styles = StyleSheet.create({
    titolo:{
        color:colors.primary,
        fontFamily:"InriaSans-Bold",
        fontSize:16,
        marginBottom:10
    }
})