import React from 'react';
import { Box, Text } from 'ink';
import Static from './Static';

// We can keep the header static since it never changes
const Header = () => (
  <Box 
    borderStyle="round" 
    borderColor="green" 
    flexDirection="column"
    width="100%"
    padding={1}
    marginBottom={1}
  >
    <Text bold color="green">Personal Aigent - Todo List</Text>
    <Text>Press <Text color="yellow">a</Text> to add a todo, <Text color="yellow">c</Text> to toggle completion,</Text>
    <Text><Text color="yellow">d</Text> to delete, arrow keys to navigate, <Text color="yellow">q</Text> or <Text color="yellow">ESC</Text> to quit</Text>
  </Box>
);

export default Header;