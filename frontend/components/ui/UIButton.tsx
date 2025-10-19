// components/ui/UIButton.tsx
import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
  
} from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  /** container styles (background, border, radius, padding, etc.) */
  style?: StyleProp<ViewStyle>;
  /** label styles (font, size, color, weight, etc.) */
  textStyle?: StyleProp<TextStyle>;
  /** 'system' = iOS-style blue text, no bg; 'filled' = primary bg */
  variant?: 'system' | 'filled';
};

const IOS_BLUE = '#007AFF'; // close to systemBlue; good fallback cross-platform

export default function UIButton({
  title,
  onPress,
  disabled,
  style,
  textStyle,
  variant = 'system',
}: Props) {
  const isFilled = variant === 'filled';
  const formattedTitle =  title;

  return (
    <Pressable
      accessibilityRole="button"
      // activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      android_ripple={isFilled ? { } : undefined}
      style={({ pressed }) => [
        styles.base,
        isFilled ? styles.filled : styles.system,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style, // caller overrides last
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text
        style={[
          styles.textBase,
          isFilled ? styles.textFilled : styles.textSystem,
          textStyle, // caller overrides last
        ]}
        numberOfLines={1}
      >
        {formattedTitle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  system: {
    backgroundColor: 'transparent',
  },
  filled: {
    backgroundColor: IOS_BLUE,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontSize: 18, 
    // Platform.OS === 'ios' ? 17 : 16,
    // fontWeight: Platform.OS === 'ios' ? '600' : '500',
  },
  textSystem: {
    color: IOS_BLUE,
  },
  textFilled: {
    color: '#FFFFFF',
  },
});
