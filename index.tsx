#!/usr/bin/env bun
import React, { useState, useEffect, useCallback, memo } from 'react';
import { render, Box, Text, useApp, useInput, useStdout } from 'ink';
import TextInput from 'ink-text-input';
import { nanoid } from 'nanoid';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Memoized TodoItem component to prevent unnecessary re-renders
const TodoItem = memo(({ todo, isSelected }: { todo: Todo; isSelected: boolean }) => (
  <Box>
    <Text>
      {isSelected ? '>' : ' '} 
      <Text color={todo.completed ? 'green' : 'white'} strikethrough={todo.completed}>
        {todo.text}
      </Text>
    </Text>
  </Box>
));

// Memoized Header component
const Header = memo(() => (
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
));

// Memoized TodoList component
const TodoList = memo(({ todos, selectedIndex }: { todos: Todo[]; selectedIndex: number }) => (
  <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1}>
    {todos.length === 0 ? (
      <Text dimColor>No todos yet. Press 'a' to add one.</Text>
    ) : (
      <Box flexDirection="column">
        {todos.map((todo, index) => (
          <TodoItem 
            key={todo.id}
            todo={todo}
            isSelected={index === selectedIndex}
          />
        ))}
      </Box>
    )}
  </Box>
));

// Memoized InputField component
const InputField = memo(({ value, onChange, onSubmit }: { value: string; onChange: (value: string) => void; onSubmit: (value: string) => void }) => (
  <Box marginTop={1} borderStyle="single" padding={1}>
    <Text>Add Todo: </Text>
    <TextInput
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      focus={true}
    />
  </Box>
));

// Main App component
const App = () => {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputMode, setInputMode] = useState(false);
  
  // Clean up function to exit the app
  const cleanExit = useCallback(() => {
    exit();
  }, [exit]);

  // Handle keyboard input with useCallback to prevent recreating this function on each render
  useInput(useCallback((input, key) => {
    if (inputMode) {
      if (key.escape) {
        setInputMode(false);
      }
      return;
    }

    if (key.escape) {
      cleanExit();
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
      cleanExit();
    }
  }, [cleanExit, inputMode, selectedIndex, todos.length]));

  // Handle submit with useCallback
  const handleSubmit = useCallback((value: string) => {
    if (value.trim()) {
      setTodos(prev => [
        ...prev,
        { id: nanoid(), text: value.trim(), completed: false }
      ]);
      setInputValue('');
    }
    setInputMode(false);
  }, []);

  // Only update input value when in input mode to reduce updates
  const handleInputChange = useCallback((value: string) => {
    if (inputMode) {
      setInputValue(value);
    }
  }, [inputMode]);

  return (
    <Box
      flexDirection="column"
      padding={0}
    >
      <Header />
      <TodoList todos={todos} selectedIndex={selectedIndex} />
      {inputMode && (
        <InputField 
          value={inputValue} 
          onChange={handleInputChange} 
          onSubmit={handleSubmit} 
        />
      )}
    </Box>
  );
};

// Initialize the app
if (process.stdout.isTTY) {
  // Set up terminal for full-screen mode before rendering
  process.stdout.write('\u001B[?1049h'); // Enable alternate screen buffer
  process.stdout.write('\u001B[?25l');   // Hide cursor
  
  // Configure Ink with options to reduce flickering
  const options = {
    exitOnCtrlC: false,
    patchConsole: true,
    fullscreen: true,
    stdout: process.stdout,
    // Setting a low frame rate can reduce flickering in some terminals
    fps: 30
  };
  
  const { waitUntilExit } = render(<App />, options);
  
  // Handle cleanup when process is about to exit
  process.on('SIGINT', () => {
    process.stdout.write('\u001B[?1049l'); // Disable alternate screen buffer
    process.stdout.write('\u001B[?25h');   // Show cursor
  });
  
  waitUntilExit().then(() => {
    // Ensure terminal is restored on exit
    process.stdout.write('\u001B[?1049l'); // Disable alternate screen buffer
    process.stdout.write('\u001B[?25h');   // Show cursor
  });
} else {
  console.log('This application requires an interactive terminal to run.');
  process.exit(1);
}