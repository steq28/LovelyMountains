import React, { FC } from "react";
import { Text, SafeAreaView, StatusBar, StyleSheet, Platform, View } from "react-native";
import { colors } from "../../utils/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IPrincipalWrapper{
    children: any,
    name?: string,
    fullscreen?: boolean
}

export const PrincipalWrapper: FC<IPrincipalWrapper> = ({children, name="", fullscreen = false}) =>{
    const insets = useSafeAreaInsets();
    
    return(
        <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={[{height: '100%'}, !fullscreen && {paddingTop: Platform.OS==="android" ? StatusBar.currentHeight : insets.top}]}
        >
            {!fullscreen && <StatusBar barStyle={'dark-content'} backgroundColor={fullscreen ? "transparent" : colors.secondary} translucent/>}
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.secondary,
                    paddingHorizontal: fullscreen ? 0 : 30,
                }}
            >
                {name!="" && <Text allowFontScaling={false} style={styles.titolo}>{name}</Text>}
                {children}
            </View>
        </KeyboardAwareScrollView>
    );
};

export const styles = StyleSheet.create({
    titolo:{
        color:colors.primary,
        fontFamily:"InriaSans-Bold",
        fontSize:30,
        marginTop:15,
        marginBottom:20
    },
})