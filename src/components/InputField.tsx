import React, { memo } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import Static from './Static';

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

// Simplified InputField component
const InputField = ({ value, onChange, onSubmit }: InputFieldProps) => (
  <Box marginTop={1} borderStyle="single" padding={1}>
    <Text>Add Todo: </Text>
    <TextInput
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      focus={true}
    />
  </Box>
);

export default InputField;