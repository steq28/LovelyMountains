import { StyleSheet } from 'react-native'
import { colors } from '../../utils/colors'

export const styles = StyleSheet.create({
    wrapper:{
        width:"100%",
        borderColor: colors.primary,
        alignItems:"center",
        display:"flex",
        flexDirection:"row",
        padding:15,
        justifyContent:"space-between",
        borderWidth:0.3,
        borderRadius: 5,
        marginBottom:10
        //marginTop:10
    },
    right:{
        width:"13%",
        height:"100%",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center"
    },
    left:{
        width:"85%",
        height:"100%",
        flexDirection:"row"
    },
    nomePercorso:{
        fontFamily:"InriaSans-Bold",
        color: colors.primary,
        fontSize: 17,
    },
    statsText:{
        fontFamily:"InriaSans-Regular",
        color: colors.medium,
        fontSize: 14,
        marginTop:3
    },

    placeText:{
        fontFamily:"InriaSans-Regular",
        color:colors.primary,
        marginLeft:10
    }
})
