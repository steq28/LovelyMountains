import { StyleSheet } from 'react-native'
import { colors } from '../../utils/colors'

export const styles = StyleSheet.create({
    wrapper: {
        width:'100%',
        height:55,
        borderWidth:0.6,
        borderRadius:500,
        borderColor: colors.medium,
        backgroundColor:colors.secondary,
        display:'flex',
        flexDirection:'row',
        paddingHorizontal: 15,
        alignItems:'center',
    },

    textInput:{
        width:'90%',
        fontFamily:'InriaSans-Regular',
        fontSize:17,
        color:colors.primary
    }
})
