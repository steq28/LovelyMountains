import React, { FC } from "react";
import {Text, Pressable, ViewStyle, ActivityIndicator} from "react-native";
import { styles } from "./styles";
import { colors } from "../../utils/colors";

interface IBottoneBase{
    text: string,
    onPress: () => void,
    outlined?: boolean,
    fixedWidth?: ViewStyle
    size?: "small" | "big"
    isLoading?: boolean
}

export const BottoneBase: FC<IBottoneBase> = ({text, onPress, outlined=false, fixedWidth, size, isLoading}) =>{
    return(
        <Pressable disabled={isLoading} style={[styles.wrapper, outlined && styles.wrapperOutlined, fixedWidth, size=="big" && styles.wrapperBig]} onPress={onPress}>
            {isLoading ? 
                <ActivityIndicator color={outlined ? colors.primary : colors.secondary} size={size=="big" ? 29 : 22}/>
                :
                <Text allowFontScaling={false} style={[styles.text, outlined && styles.textOutlined, size=="big" && styles.textBig]}>{text}</Text>
            }
        </Pressable>
    );
};