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
        paddingVertical:15,
        justifyContent:"space-between"
        //marginTop:10
    },
    placeText:{
        fontFamily:"InriaSans-Regular",
        color:colors.primary,
        marginLeft:10
    },
    iconView:{
        width:30,
        height:30,
        borderRadius:5,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:colors.primary
    }
})
