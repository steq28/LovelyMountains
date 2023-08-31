import React, { useMemo, useState } from 'react'
import { Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { colors } from '../../utils/colors'
import { useTranslations } from '../../hooks/useTranslations'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons';
import i18n from '../../translations'
import { RadioButton, RadioGroup } from 'react-native-radio-buttons-group'
import { useDispatch, useSelector } from 'react-redux'
import { setLanguage } from '../../redux/settingsSlice'

export const Lingua = ({navigation})=>{
    const dispatch = useDispatch()
    const { tra } = useTranslations();
    const insets = useSafeAreaInsets();
    const {lingua} = useSelector(state => state.settings)
    //const [language, setLanguage] = useState(lingua)

    const radioButtons = useMemo(() => ([
        {
            id: 'it', // acts as primary key, should be unique and non-empty string
            label: 'Italiano',
            value: 'it',
            end: false
        },
        {
            id: 'en',
            label: 'English',
            value: 'en',
            end: true
        }
    ]), []);
    
    return(
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}  contentContainerStyle={{ height: '100%', paddingTop: Platform.OS==='android' ? StatusBar.currentHeight : insets.top}}>
            <SafeAreaView edges={['top', 'left', 'right']} style={{flex:1, backgroundColor:colors.secondary, paddingHorizontal:30}}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Pressable onPress={()=>{navigation.goBack()}}>
                        <Icon name={'arrow-back-outline'} size={27} color={colors.primary}/>
                    </Pressable>
                    <Text style={styles.titolo}>{tra('impostazioni.lingua')}</Text>
                </View>
                <View style={styles.wrapper}>
                    {radioButtons.map((button) => (
                        <RadioButton
                            {...button}
                            key={button.id}
                            selected={button.id === lingua}
                            onPress={() => {
                                i18n.changeLanguage(button.id)
                                //setLanguage(button.id)
                                dispatch(setLanguage(button.id))
                            }}
                            labelStyle={{
                                color: colors.primary,
                                fontFamily:'InriaSans-Regular',
                                fontSize:16,
                                marginVertical:10,
                            }}
                            containerStyle={{
                                borderBottomWidth: button.end ? 0 : 0.2,
                                paddingBottom:button.end ? 5 : 10,
                                borderColor: colors.light
                            }}
                        />
                    ))}
                </View>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}

export const styles = StyleSheet.create({
    titolo:{
        color:colors.primary,
        fontFamily:'InriaSans-Bold',
        fontSize:30,
        marginTop:15,
        marginBottom:20,
        marginLeft: 15
    },
    wrapper:{
        width:'100%',
        borderWidth:0.2,
        borderRadius: 5,
        color: colors.medium,
        paddingTop:5,
        paddingHorizontal:10
    },
})