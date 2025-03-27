#!/usr/bin/env bun
import React, { useState } from 'react';
import { render, Box, Text, useApp, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { nanoid } from 'nanoid';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const App = () => {
  const { exit } = useApp();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputMode, setInputMode] = useState(false);

  // Handle keyboard input
  useInput((input, key) => {
    if (inputMode) {
      if (key.escape) {
        setInputMode(false);
      }
      return;
    }

    if (key.escape) {
      exit();
    } else if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex(prev => Math.min(todos.length - 1, prev + 1));
    } else if (input === 'a') {
      setInputMode(true);
    } else if (input === 'd' && todos.length > 0) {
      // Delete the selected todo
      setTodos(prev => prev.filter((_, index) => index !== selectedIndex));
      setSelectedIndex(prev => Math.min(prev, todos.length - 2));
    } else if (input === 'c' && todos.length > 0) {
      // Toggle completed state
      setTodos(prev => 
        prev.map((todo, index) => 
          index === selectedIndex 
            ? { ...todo, completed: !todo.completed } 
            : todo
        )
      );
    } else if (input === 'q') {
      exit();
    }
  });

  const handleSubmit = (value: string) => {
    if (value.trim()) {
      setTodos(prev => [
        ...prev,
        { id: nanoid(), text: value.trim(), completed: false }
      ]);
      setInputValue('');
    }
    setInputMode(false);
  };

  return (
    <Box
      flexDirection="column"
      width="100%"
      height="100%"
      padding={1}
    >
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

      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1}>
        {todos.length === 0 ? (
          <Text dimColor>No todos yet. Press 'a' to add one.</Text>
        ) : (
          <Box flexDirection="column">
            {todos.map((todo, index) => (
              <Box key={todo.id}>
                <Text>
                  {index === selectedIndex ? '>' : ' '} 
                  <Text color={todo.completed ? 'green' : 'white'} strikethrough={todo.completed}>
                    {todo.text}
                  </Text>
                </Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {inputMode && (
        <Box marginTop={1} borderStyle="single" padding={1}>
          <Text>Add Todo: </Text>
          <TextInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            focus={true}
          />
        </Box>
      )}
    </Box>
  );
};

// Use fullscreen option to make the app stay open and use the full terminal
// We need to check if stdin is TTY to avoid raw mode errors
if (process.stdin.isTTY) {
  render(<App />, {
    exitOnCtrlC: false,
    patchConsole: true
  });
} else {
  console.log('This application requires an interactive terminal to run.');
  process.exit(1);
}