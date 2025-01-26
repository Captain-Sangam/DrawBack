'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

interface Circle {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface AppState {
  stage: Circle[];
}

export default function Home() {
  const [previousStates, setPreviousStates] = useState<AppState[]>([]);
  const [currentState, setCurrentState] = useState<AppState>({ stage: [] });
  const [nextStates, setNextStates] = useState<AppState[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentRadius, setCurrentRadius] = useState(20);
  const [currentColor, setCurrentColor] = useState('#000000');

  const MAX_CIRCLES = 5;

  useEffect(() => {
    drawCircles();
  }, [currentState]);

  const generateCircleName = () => {
    const adjectives = ['Happy', 'Bright', 'Swift', 'Gentle', 'Bold', 'Calm', 'Wise', 'Kind', 'Brave', 'Clever'];
    const nouns = ['Circle', 'Dot', 'Sphere', 'Spot', 'Ring', 'Bubble', 'Moon', 'Sun', 'Star', 'Planet'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${randomAdjective}${randomNoun}`;
  };

  const drawCircles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentState.stage.forEach(circle => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = circle.color;
      ctx.fill();
      
      // Add circle name below
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(circle.name, circle.x, circle.y + circle.radius + 20);
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newCircle: Circle = {
      id: Math.random().toString(36).substr(2, 9),
      name: generateCircleName(),
      x,
      y,
      radius: currentRadius,
      color: currentColor,
    };

    setPreviousStates([...previousStates, currentState]);
    setCurrentState({
      stage: [...currentState.stage, newCircle],
    });
    setNextStates([]); // Clear future states when new action is performed
  };

  const handleUndo = () => {
    if (previousStates.length === 0) return;
    
    const newPreviousStates = [...previousStates];
    const lastState = newPreviousStates.pop()!;
    
    setNextStates([currentState, ...nextStates]);
    setCurrentState(lastState);
    setPreviousStates(newPreviousStates);
  };

  const handleRedo = () => {
    if (nextStates.length === 0) return;
    
    const newNextStates = [...nextStates];
    const nextState = newNextStates.shift()!;
    
    setPreviousStates([...previousStates, currentState]);
    setCurrentState(nextState);
    setNextStates(newNextStates);
  };

  const formatState = (state: { name: string }) => {
    return `            {
                "name": "${state.name}"
            }`;
  };

  const getStateJSON = () => {
    const previousStatesStr = previousStates
      .map(state => ({
        name: state.stage[state.stage.length - 1]?.name || 'Empty'
      }))
      .filter(state => state.name !== 'Empty')
      .map(formatState)
      .join(',\n');

    const currentStateStr = formatState({
      name: currentState.stage[currentState.stage.length - 1]?.name || 'Empty'
    }).replace(/^ {12}/gm, '        '); // reduce indent for current state

    const nextStatesStr = nextStates
      .map(state => ({
        name: state.stage[state.stage.length - 1]?.name || 'Empty'
      }))
      .filter(state => state.name !== 'Empty')
      .map(formatState)
      .join(',\n');

    return `{
    "<strong>previous_states</strong>": [
${previousStatesStr || ''}
        ],
    "<strong>current_state</strong>": ${currentStateStr.trim()},
    "<strong>next_states</strong>": [
${nextStatesStr || ''}
        ]
}`;
  };

  return (
    <main className={styles.main}>
      <div className={styles.drawingControls}>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
        />
        <input
          type="range"
          min="5"
          max="50"
          value={currentRadius}
          onChange={(e) => setCurrentRadius(Number(e.target.value))}
        />
        <button onClick={handleUndo} disabled={previousStates.length === 0}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={nextStates.length === 0}>
          Redo
        </button>
      </div>
      
      <div className={styles.contentContainer}>
        <div className={styles.canvasContainer}>
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            onClick={handleCanvasClick}
            className={styles.canvas}
          />
        </div>
        
        <div 
          className={styles.jsonDisplay}
          dangerouslySetInnerHTML={{ __html: getStateJSON() }}
        />
      </div>
    </main>
  );
}
