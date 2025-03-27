# personal-aigent

A Terminal User Interface (TUI) application built with [ink](https://github.com/vadimdemedes/ink), which allows building CLI apps with React components.

## Features

- Fullscreen terminal application that stays open until explicitly closed
- Todo list management with keyboard navigation
- Add, toggle completion, and delete todo items
- Uses React components for terminal UI

## Installation

To install dependencies:

```bash
bun install
```

To install the command globally:

```bash
bun link
```

## Running the Application

To run the TUI app:

```bash
bun run start
```

Or directly:

```bash
./index.tsx
```

If installed globally:

```bash
personal-aigent
```

## Usage

Once the application is running, you can:
- Press `a` to add a new todo
- Use arrow keys to navigate the todo list
- Press `c` to toggle completion of the selected todo
- Press `d` to delete the selected todo
- Press `q` or `ESC` to quit the application

## Development

This project was created using `bun init` in bun v1.2.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

### Technologies Used

- [Bun](https://bun.sh) - JavaScript runtime
- [ink](https://github.com/vadimdemedes/ink) - React for CLI
- [React](https://reactjs.org) - UI library
- [ink-text-input](https://github.com/vadimdemedes/ink-text-input) - Text input component for ink
- [@inkjs/ui](https://github.com/inkjs/ui) - UI components for ink
