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

// Create memoized components to reduce re-renders
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

const App = () => {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputMode, setInputMode] = useState(false);
  const [dimensions, setDimensions] = useState({
    columns: stdout.columns || 80,
    rows: stdout.rows || 24
  });
  
  // Handle terminal resize events
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        columns: stdout.columns || 80,
        rows: stdout.rows || 24
      });
    };
    
    // Initial size setup
    handleResize();
    
    stdout.on('resize', handleResize);
    
    // Cleanup resize listener
    return () => {
      stdout.removeListener('resize', handleResize);
    };
  }, [stdout]);

  // Clean up function to exit the app
  const cleanExit = () => {
    // The terminal restoration is handled in the waitUntilExit().then() callback
    exit();
  };

  // Handle keyboard input
  useInput((input, key) => {
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
  });

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

  return (
    <Box
      flexDirection="column"
      width={dimensions.columns}
      height={dimensions.rows}
      padding={0}
    >
      <Header />

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
// We need to check if stdout is TTY to avoid raw mode errors
if (process.stdout.isTTY) {
  // Set up terminal for full-screen mode
  process.stdout.write('\u001B[?1049h'); // Enable alternate screen buffer
  process.stdout.write('\u001B[?25l');   // Hide cursor
  
  const { waitUntilExit } = render(<App />, {
    exitOnCtrlC: false,
    patchConsole: true,
    // Enable fullscreen mode to take over the entire terminal
    fullscreen: true,
    // Reduce flickering by optimizing renders
    throttleFrameRate: false,
    // Disable debug output
    debug: false
  });
  
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