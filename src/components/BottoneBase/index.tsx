import React, {FC} from 'react';
import {Text, Pressable, ViewStyle, ActivityIndicator} from 'react-native';
import {styles} from './styles';
import {colors} from '../../utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {View} from 'react-native';

interface IBottoneBase {
  text: string;
  onPress: () => void;
  outlined?: boolean;
  fixedWidth?: ViewStyle;
  size?: 'small' | 'big';
  isLoading?: boolean;
  icon?: string;
  disabled?: boolean;
}

export const BottoneBase: FC<IBottoneBase> = ({
  text,
  onPress,
  outlined = false,
  fixedWidth,
  size,
  isLoading,
  icon = '',
  disabled = false,
}) => {
  return (
    <Pressable
      disabled={disabled || isLoading}
      style={[
        styles.wrapper,
        outlined && styles.wrapperOutlined,
        fixedWidth,
        size == 'big' && styles.wrapperBig,
      ]}
      onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator
          color={outlined ? colors.primary : colors.secondary}
          size={size == 'big' ? 29 : 22}
        />
      ) : (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {icon != '' && (
            <Icon
              style={{marginRight: 5}}
              name={icon}
              size={24}
              color={colors.secondary}
            />
          )}
          <Text
            allowFontScaling={false}
            style={[
              styles.text,
              outlined && styles.textOutlined,
              size == 'big' && styles.textBig,
            ]}>
            {text}
          </Text>
        </View>
      )}
    </Pressable>
  );
};
