#!/usr/bin/env bun
import React from 'react';
import { render, Box, Text } from 'ink';

const App = () => {
  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
      borderStyle="round"
      borderColor="green"
      padding={1}
    >
      <Text bold color="green">
        Hello, World!
      </Text>
      <Text>Welcome to my TUI application built with ink</Text>
    </Box>
  );
};

render(<App />);