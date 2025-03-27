#!/usr/bin/env bun
import React from 'react';
import { render } from 'ink';
import App from './src/components/App';

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
    // Setting a low frame rate can reduce flickering in some terminals
    fps: 20
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