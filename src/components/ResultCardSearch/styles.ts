import { StyleSheet } from 'react-native'
import { colors } from '../../utils/colors'

export const styles = StyleSheet.create({
    wrapper:{
        width:"100%",
        paddingHorizontal:25,
        borderColor: colors.light,
        alignItems:"center",
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        paddingVertical:15,
        //marginTop:10
    },
    placeText:{
        fontFamily:"InriaSans-Light",
        width:"88%",
        maxWidth:"88%",
        color:colors.primary,
    }
})
