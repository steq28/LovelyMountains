import React from "react"
import { ScrollView, View, Text } from "react-native"
import { SearchBox } from "../../components/SearchBox"
import { colors } from "../../utils/colors"
import { SafeAreaView } from "react-native-safe-area-context"
import { styles } from "./styles"
import { ResultCardSearch } from "../../components/ResultCardSearch"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

export const SearchScreen = () =>{
    return(
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'never'} contentContainerStyle={{ height: "100%" }}>
            <SafeAreaView edges={['top', 'left', 'right']} style={{flex:1, backgroundColor:colors.secondary, paddingHorizontal:30}}>
                <View style={{height:"10%"}}>
                    <SearchBox icon={"arrow-back-outline"} placeholder={"Cerca luoghi"}/>
                </View>
                <ScrollView style={{flexGrow:1}}>
                    <View style={{marginTop:15}}>
                        <Text style={styles.sectionTitle}>luoghi</Text>
                        <ResultCardSearch isEnd={false} name={"Monte Zucco, San Pellegrino Terme (BG)"} icon={"leaf-outline"}/>
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