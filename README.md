# DrawBack

A modern drawing application built with Next.js that allows users to create circles with undo/redo functionality. Features a clean UI with dark mode support and real-time state visualization.

## Features

- Draw circles with customizable colors and sizes
- Undo/Redo functionality using stack-based state management
- Real-time JSON state visualization
- Dark mode support
- Responsive, modern UI with the Righteous font
- Limited to 4 circles for focused drawing

## Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Captain-Sangam/DrawBack.git
   cd DrawBack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - The app should be running with hot-reload enabled

## Implementation Details

### State Management for Undo/Redo

The application implements undo/redo functionality using a dual-stack approach:

#### Data Structure
```typescript
const [previousStates, setPreviousStates] = useState<AppState[]>([]);  // Undo stack
const [currentState, setCurrentState] = useState<AppState>({ stage: [] });  // Current state
const [nextStates, setNextStates] = useState<AppState[]>([]);  // Redo stack
```

#### Undo/Redo Logic

1. **Drawing a Circle**
   - When a new circle is drawn:
     ```typescript
     setPreviousStates([...previousStates, currentState]);  // Push current state to undo stack
     setCurrentState(newState);  // Update current state
     setNextStates([]);  // Clear redo stack
     ```

2. **Undo Operation**
   - When undo is clicked:
     ```typescript
     const lastState = previousStates[previousStates.length - 1];  // Get last state
     setPreviousStates(previousStates.slice(0, -1));  // Remove it from undo stack
     setNextStates([currentState, ...nextStates]);  // Push current state to redo stack
     setCurrentState(lastState);  // Set last state as current
     ```

3. **Redo Operation**
   - When redo is clicked:
     ```typescript
     const nextState = nextStates[0];  // Get next state
     setNextStates(nextStates.slice(1));  // Remove it from redo stack
     setPreviousStates([...previousStates, currentState]);  // Push current state to undo stack
     setCurrentState(nextState);  // Set next state as current
     ```

#### State Visualization
- The current state is always displayed in the JSON viewer
- Each circle has:
  - Unique ID
  - Random human-readable name
  - Position (x, y)
  - Radius
  - Color

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: CSS Modules
- **Font**: Google Fonts (Righteous)
- **State Management**: React useState
- **Canvas**: HTML5 Canvas API

## Future Improvements

- Add more shape options (squares, triangles)
- Implement shape dragging
- Add color picker with custom colors
- Save drawings to local storage
- Export drawings as images

## Contributing

Feel free to submit issues and enhancement requests!
