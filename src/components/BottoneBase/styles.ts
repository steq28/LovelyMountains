import { StyleSheet } from 'react-native'
import { colors } from '../../utils/colors'

export const styles = StyleSheet.create({
    wrapper:{
        backgroundColor: colors.primary,
        alignItems:"center",
        display:"flex",
        flexDirection:"row",
        paddingVertical:12,
        paddingHorizontal:15,
        justifyContent:"center",
        borderWidth:1,
        borderRadius: 5,
        //marginTop:10
    },
    wrapperOutlined:{
        backgroundColor: colors.secondary,
        borderColor: colors.primary,
    },

    wrapperBig:{
        paddingHorizontal:20,
    },

    text:{
        fontFamily:"InriaSans-Regular",
        fontSize:17,
        color: colors.secondary
    },
    textOutlined:{
        color: colors.primary
    },
    textBig:{
        fontSize:23
    },
})
