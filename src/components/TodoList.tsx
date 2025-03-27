import React, { memo } from 'react';
import { Box, Text } from 'ink';
import TodoItem from './TodoItem';
import { Todo } from '../types';
import Static from './Static';

interface TodoListProps {
  todos: Todo[];
  selectedIndex: number;
}

// The TodoList component with a static border
const TodoList = ({ todos, selectedIndex }: TodoListProps) => (
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
);

export default TodoList;