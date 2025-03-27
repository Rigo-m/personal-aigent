import React, { memo } from 'react';
import { Box, Text } from 'ink';
import TodoItem from './TodoItem';
import { Todo } from '../types';
import Static from './Static';

interface TodoListProps {
  todos: Todo[];
  selectedIndex: number;
}

// The TodoList container is static (border, etc)
const TodoListContainer = ({ children }: { children: React.ReactNode }) => (
  <Static>
    <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1}>
      {children}
    </Box>
  </Static>
);

// The actual list content can change
const TodoList = memo(({ todos, selectedIndex }: TodoListProps) => (
  <TodoListContainer>
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
  </TodoListContainer>
));

export default TodoList;