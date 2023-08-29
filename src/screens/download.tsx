import React from "react"
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { colors } from "../utils/colors"
import { useTranslations } from "../hooks/useTranslations"
import { useFocusEffect } from "@react-navigation/native"
import { CardPercorso } from "../components/CardPercorso"

export const Download = ()=>{
    const { tra } = useTranslations();

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBackgroundColor(colors.secondary)
        }, [])
    );
    
    return(
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}  contentContainerStyle={{ height: "100%", paddingTop: Platform.OS==="android" ? StatusBar.currentHeight : insets.top}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={colors.secondary} translucent/>
            <SafeAreaView edges={['top', 'left', 'right']} style={{flex:1, backgroundColor:colors.secondary, paddingHorizontal:30}}>
                <Text allowFontScaling={false} style={styles.titolo}>{tra("download.titolo")}</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={{maxHeight: Dimensions.get("window").height - 143}}>
                    <CardPercorso name={undefined} img={undefined} onPress={undefined} />
                    <CardPercorso name={undefined} img={undefined} onPress={undefined} />
                    <CardPercorso name={undefined} img={undefined} onPress={undefined} />
                </ScrollView>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}

export const styles = StyleSheet.create({
    titolo:{
        color:colors.primary,
        fontFamily:"InriaSans-Bold",
        fontSize:30,
        marginTop:15,
        marginBottom:20
    },
})