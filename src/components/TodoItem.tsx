import React, { memo } from 'react';
import { Box, Text } from 'ink';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  isSelected: boolean;
}

// Memoized TodoItem component to prevent unnecessary re-renders
const TodoItem = memo(({ todo, isSelected }: TodoItemProps) => (
  <Box>
    <Text>
      {isSelected ? '>' : ' '} 
      <Text color={todo.completed ? 'green' : 'white'} strikethrough={todo.completed}>
        {todo.text}
      </Text>
    </Text>
  </Box>
));

export default TodoItem;