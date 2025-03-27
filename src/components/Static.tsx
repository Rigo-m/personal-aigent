import React, { memo, ReactNode } from 'react';

// A component wrapper that prevents re-renders
interface StaticProps {
  children: ReactNode;
  id?: string;
}

// Use React.memo with a custom comparison function that always returns true
// This ensures the component never re-renders regardless of prop changes
const Static = memo(
  ({ children }: StaticProps) => {
    return <>{children}</>;
  },
  () => true // Always return true to prevent re-renders
);

export default Static;