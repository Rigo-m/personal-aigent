import React, { memo } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import Static from './Static';

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

// The InputField container is static
const InputFieldContainer = ({ children }: { children: React.ReactNode }) => (
  <Static>
    <Box marginTop={1} borderStyle="single" padding={1}>
      <Text>Add Todo: </Text>
      {children}
    </Box>
  </Static>
);

// The actual input field can change
const InputField = memo(({ value, onChange, onSubmit }: InputFieldProps) => (
  <InputFieldContainer>
    <TextInput
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      focus={true}
    />
  </InputFieldContainer>
));

export default InputField;