import React, { useState, useCallback } from 'react';
import { Box, useApp, useInput } from 'ink';
import { nanoid } from 'nanoid';
import Header from './Header';
import TodoList from './TodoList';
import InputField from './InputField';
import { Todo } from '../types';

// Main App component
const App = () => {
  const { exit } = useApp();
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

export default App;