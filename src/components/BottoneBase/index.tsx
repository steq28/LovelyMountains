import React, { FC } from "react";
import {Text, Pressable, ViewStyle} from "react-native";
import { styles } from "./styles";

interface IBottoneBase{
    text: string,
    onPress: () => void,
    outlined?: boolean,
    fixedWidth?: ViewStyle
    size?: "small" | "big"
}

export const BottoneBase: FC<IBottoneBase> = ({text, onPress, outlined=false, fixedWidth, size}) =>{
    return(
        <Pressable style={[styles.wrapper, outlined && styles.wrapperOutlined, fixedWidth, size=="big" && styles.wrapperBig]} onPress={onPress}>
            <Text allowFontScaling={false} style={[styles.text, outlined && styles.textOutlined, size=="big" && styles.textBig]}>{text}</Text>
        </Pressable>
    );
};