import React, { useState } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

type Props = TextInputProps & { error?: boolean };

export default function UIInput({ style, error, ...rest }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      {...rest}
      style={[
        styles.input,
        isFocused && styles.inputFocused,
        error && styles.inputError,
        style,
      ]}
      placeholderTextColor="#9CA3AF"
      onFocus={(e) => { setIsFocused(true); rest.onFocus?.(e); }}
      onBlur={(e) => { setIsFocused(false); rest.onBlur?.(e); }}
      underlineColorAndroid="transparent"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#F3F4F6',
    color: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 4,
    maxWidth: 150,
  },
  inputFocused: { borderColor: '#3B82F6' },
  inputError:   { borderColor: '#EF4444' },
});
