import React, { memo, ReactNode } from 'react';

// A component wrapper that prevents re-renders
interface StaticProps {
  children: ReactNode;
  id?: string;
}

// Use React.memo with default comparison
// This prevents re-renders when props haven't changed
const Static = memo(({ children }: StaticProps) => {
  return <>{children}</>;
});

export default Static;