import React from "react"
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { colors } from "../utils/colors"
import { useTranslations } from "../hooks/useTranslations"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CardSetting } from "../components/CardSetting"
import { useFocusEffect } from "@react-navigation/native"

export const Settings = ({navigation})=>{
    const { tra } = useTranslations();
    const insets = useSafeAreaInsets();
    
    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBackgroundColor(colors.secondary)
        }, [])
    );
    return(
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}  contentContainerStyle={{ height: "100%", paddingTop: Platform.OS==="android" ? StatusBar.currentHeight : insets.top}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={colors.secondary} translucent/>
            <SafeAreaView edges={['top', 'left', 'right']} style={{flex:1, backgroundColor:colors.secondary, paddingHorizontal:30}}>
                <Text allowFontScaling={false} style={styles.titolo}>{tra("impostazioni.titolo")}</Text>
                <View style={styles.wrapper}>
                    <CardSetting name={tra("impostazioni.gestisci")} icon={"map"} onPress={undefined} />
                    <CardSetting name={tra("impostazioni.lingua")} icon={"globe-outline"} onPress={()=>{navigation.navigate("Lingua")}} />
                    <CardSetting isEnd name={tra("impostazioni.chi")} icon={"heart-circle-outline"} onPress={undefined} />
                </View>
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
    wrapper:{
        width:"100%",
        borderWidth:0.2,
        borderRadius: 5,
        color: colors.medium
    },
})