import React from "react"
import { ScrollView, View, Text, StyleSheet, Pressable, StatusBar } from "react-native"
import { SearchBox } from "../components/SearchBox"
import { colors } from "../utils/colors"
import { SafeAreaView } from "react-native-safe-area-context"
import { ResultCardSearch } from "../components/ResultCardSearch"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useTranslations } from "../hooks/useTranslations"
import { useFocusEffect } from "@react-navigation/native"

export const SearchScreen = () =>{
    const { tra } = useTranslations();
    // useFocusEffect(
    //     React.useCallback(() => {
    //         StatusBar.setBackgroundColor(colors.secondary)
    //     }, [])
    // );
      
    return(
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}  contentContainerStyle={{ height: "100%" }}>
            <SafeAreaView edges={['top', 'left', 'right']} style={{flex:1, backgroundColor:colors.secondary, paddingHorizontal:30}}>
                <View style={{height:"10%"}}>
                    <SearchBox icon={"arrow-back-outline"} placeholder={tra("search.cerca")}/>
                </View>
                <ScrollView style={{flexGrow:1}}>
                    <View style={{marginTop:15}}>
                        <Text style={styles.sectionTitle}>luoghi</Text>
                        <ResultCardSearch isEnd={false} name={tra("welcome")} icon={"leaf-outline"}/>
                        <ResultCardSearch isEnd={false} name={"Monte Resegone, Monza (MB)"} icon={"leaf-outline"}/>
                        <ResultCardSearch isEnd={true} name={"San Giovanni Bianco, Bergamo"} icon={"location-outline"}/>
                    </View>

                    <View style={{marginTop:20}}>
                        <Text style={styles.sectionTitle}>recenti</Text>
                        <ResultCardSearch isEnd={false} name={"Monte Zucco, San Pellegrino Terme (BG)"} icon={"timer-outline"}/>
                        <ResultCardSearch isEnd={false} name={"Monte Resegone, Monza (MB)"} icon={"timer-outline"}/>
                        <ResultCardSearch isEnd={true} name={"San Giovanni Bianco, Bergamo"} icon={"timer-outline"}/>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}

export const styles = StyleSheet.create({
    sectionTitle:{
        color:colors.primary,
        textTransform:'uppercase',
        fontFamily:"InriaSans-Bold",
        fontSize:16,
        marginBottom:10
    }
})
