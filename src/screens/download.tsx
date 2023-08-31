import React, { useState } from "react"
import { Dimensions, Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { colors } from "../utils/colors"
import { useTranslations } from "../hooks/useTranslations"
import { useFocusEffect } from "@react-navigation/native"
import { CardPercorso } from "../components/CardPercorso"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BottonBase } from "../components/BottoneBase"

export const Download = ()=>{
    const { tra } = useTranslations();
    const [showModal, setShowModal] = useState(false)
    const insets = useSafeAreaInsets();
    
    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBackgroundColor(colors.secondary)
        }, [])
    );
    
    return(
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}  contentContainerStyle={{ height: "100%", paddingTop: Platform.OS==="android" ? StatusBar.currentHeight : insets.top}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={colors.secondary} translucent/>
            <Modal visible={showModal} animationType="fade" transparent statusBarTranslucent>
                <View style={{width:"100%", height:"100%", backgroundColor:"rgba(30,30,30,0.6)", alignItems:"center", justifyContent:"center", paddingHorizontal:30}}>
                    <View style={{backgroundColor:colors.secondary, width:"100%", borderRadius:10, paddingHorizontal:20, paddingVertical:20}}>
                        <Text allowFontScaling={false} style={styles.titoloModal}>{tra("download.titoloModal")}</Text>
                        <Text allowFontScaling={false} style={styles.testoModal}>{tra("download.seiSicuro")}</Text>
                        <View style={{flexDirection:"row", width:"100%", alignItems:"center", justifyContent:"center", marginTop:15}}>
                            <BottonBase text={tra("download.conferma")} onPress={()=>setShowModal(false)} />
                            <View style={{width:10}}></View>
                            <BottonBase text={tra("download.annulla")} outlined onPress={()=>setShowModal(false)}/>
                        </View>
                    </View>
                </View>
            </Modal>
            <SafeAreaView edges={['top', 'left', 'right']} style={{flex:1, backgroundColor:colors.secondary, paddingHorizontal:30}}>
                <Text allowFontScaling={false} style={styles.titolo}>{tra("download.titolo")}</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={{maxHeight: Dimensions.get("window").height - 143}}>
                    <CardPercorso name={undefined} img={undefined} onPress={undefined} onDelete={() => setShowModal(true)} />
                    <CardPercorso name={undefined} img={undefined} onPress={undefined} onDelete={() => setShowModal(true)} />
                    <CardPercorso name={undefined} img={undefined} onPress={undefined} onDelete={() => setShowModal(true)} />
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
    titoloModal:{
        color:colors.primary,
        fontFamily:"InriaSans-Bold",
        fontSize:20,
        textAlign:"center",
        marginBottom:15
    },
    testoModal:{
        color:colors.primary,
        fontFamily:"InriaSans-Light",
        fontSize:17,
        textAlign:"center",
    }
})