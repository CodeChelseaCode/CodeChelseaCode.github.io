"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Returns an integer in the inclusive range [min, max].
 */
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type Vector2D = { x: number; y: number };
type GridPoint = { x: number; y: number };
type GameOverReason = "wall" | "self";

export default function SnakeGame() {
  /**
   * Board config (grid-based).
   * cols/rows define the logical board size, cellPx defines pixel size per cell.
   */
  const GRID_COLS = 18;
  const GRID_ROWS = 10;
  const CELL_PX = 22;

  const CANVAS_WIDTH = GRID_COLS * CELL_PX;
  const CANVAS_HEIGHT = GRID_ROWS * CELL_PX;

  // Canvas + game loop refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tickIntervalRef = useRef<number | null>(null);

  /**
   * Key -> direction map (Arrow keys + WASD).
   * useMemo keeps the object stable so it isn't recreated on every render.
   */
  const KEY_TO_DIR = useMemo<Record<string, Vector2D>>(
    () => ({
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
    }),
    []
  );

  // UI state
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [statusText, setStatusText] = useState(
    "Press Start — no thoughts, just vibes 🐍"
  );

  /**
   * "Game state" stored in refs so the game loop can update instantly
   * without waiting for React state re-renders.
   */
  const snakeRef = useRef<GridPoint[]>([]);
  const currentDirRef = useRef<Vector2D>({ x: 1, y: 0 }); // direction currently applied
  const queuedDirRef = useRef<Vector2D>({ x: 1, y: 0 }); // direction requested by user input
  const foodRef = useRef<GridPoint>({ x: 10, y: 5 });

  /**
   * Stops the game loop timer.
   */
  const stopGameLoop = () => {
    if (tickIntervalRef.current) window.clearInterval(tickIntervalRef.current);
    tickIntervalRef.current = null;
  };

  /**
   * Places food on a random cell that is NOT occupied by the snake.
   * Includes a safety cap to avoid infinite loops on tiny/full boards.
   */
  const spawnFood = () => {
    const snake = snakeRef.current;
    let x = 0;
    let y = 0;
    let attempts = 0;

    do {
      x = randomInt(0, GRID_COLS - 1);
      y = randomInt(0, GRID_ROWS - 1);
      attempts++;
      if (attempts > 200) break;
    } while (snake.some((p) => p.x === x && p.y === y));

    foodRef.current = { x, y };
  };

  /**
   * Draws the current game state to the canvas.
   */
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Board background
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Grid lines
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    for (let x = 0; x <= GRID_COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_PX, 0);
      ctx.lineTo(x * CELL_PX, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= GRID_ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_PX);
      ctx.lineTo(CANVAS_WIDTH, y * CELL_PX);
      ctx.stroke();
    }

    // Food
    const food = foodRef.current;
    ctx.fillStyle = "rgba(239, 68, 68, 0.95)";
    ctx.fillRect(
      food.x * CELL_PX + 3,
      food.y * CELL_PX + 3,
      CELL_PX - 6,
      CELL_PX - 6
    );

    // Snake
    const snake = snakeRef.current;
    snake.forEach((segment, index) => {
      ctx.fillStyle =
        index === 0 ? "rgba(0,0,0,0.95)" : "rgba(0,0,0,0.75)";
      ctx.fillRect(
        segment.x * CELL_PX + 2,
        segment.y * CELL_PX + 2,
        CELL_PX - 4,
        CELL_PX - 4
      );
    });
  };

  /**
   * Initializes game state back to the beginning.
   */
  const resetGame = () => {
    const startX = Math.floor(GRID_COLS / 3);
    const startY = Math.floor(GRID_ROWS / 2);

    snakeRef.current = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];

    currentDirRef.current = { x: 1, y: 0 };
    queuedDirRef.current = { x: 1, y: 0 };

    spawnFood();
    setScore(0);
    setIsRunning(false);
    setStatusText("Press Start — no thoughts, just vibes 🐍");

    stopGameLoop();
    renderCanvas();
  };

  /**
   * Handles game over logic and messaging.
   */
  const endGame = (reason: GameOverReason) => {
    stopGameLoop();
    setIsRunning(false);
    setBestScore((prev) => Math.max(prev, score));

    setStatusText(
      reason === "wall"
        ? "Wall wins. You lose. 💀 Press Start."
        : "You ate yourself??? Press Start."
    );
  };

  /**
   * One "tick" of the game:
   * - Apply queued direction (unless it's a 180° reversal)
   * - Move head
   * - Detect collisions
   * - Handle food vs. normal movement
   * - Re-render
   */
  const step = () => {
    // Apply the queued direction if it isn't directly opposite the current one
    const queued = queuedDirRef.current;
    const current = currentDirRef.current;
    const isOpposite = queued.x === -current.x && queued.y === -current.y;
    if (!isOpposite) currentDirRef.current = queued;

    const snake = snakeRef.current;
    const head = snake[0];
    const dir = currentDirRef.current;

    const newHead: GridPoint = { x: head.x + dir.x, y: head.y + dir.y };

    // Wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_COLS ||
      newHead.y < 0 ||
      newHead.y >= GRID_ROWS
    ) {
      endGame("wall");
      return;
    }

    // Self collision
    if (snake.some((p) => p.x === newHead.x && p.y === newHead.y)) {
      endGame("self");
      return;
    }

    // Move snake forward
    snake.unshift(newHead);

    // Food check
    const food = foodRef.current;
    const ateFood = newHead.x === food.x && newHead.y === food.y;

    if (ateFood) {
      setScore((s) => s + 1);
      spawnFood();
    } else {
      snake.pop(); // keep length the same if no food eaten
    }

    snakeRef.current = snake;
    renderCanvas();
  };

  /**
   * Starts the interval-based game loop.
   */
  const startGameLoop = () => {
    stopGameLoop();
    tickIntervalRef.current = window.setInterval(step, 120);
  };

  /**
   * Starts the game (UI + loop).
   */
  const startGame = () => {
    setIsRunning(true);
    setStatusText("Alright… lock in 😈 (Arrow keys / WASD)");
    startGameLoop();
  };

  // Initial setup + keyboard controls
  useEffect(() => {
    resetGame();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Start on Space/Enter
      if (e.key === " " || e.key === "Enter") {
        if (!isRunning) startGame();
        return;
      }

      // Direction controls
      const dir = KEY_TO_DIR[e.key];
      if (dir) {
        e.preventDefault();
        queuedDirRef.current = dir;
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      stopGameLoop();
    };
    // Intentionally run once (we want stable init behavior)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fun status messages as score increases
  useEffect(() => {
    if (!isRunning) return;

    if (score === 0) setStatusText("Warm-up lap. Don’t blink 😌");
    if (score === 3) setStatusText("Okayyy… you’re kinda nice with it ✨");
    if (score === 6) setStatusText("We’re cooking. Keep it cute. 🐍🔥");
    if (score === 9) setStatusText("Main character energy: ON 💅");
    if (score === 12) setStatusText("Respectfully… who trained you?? 😭");
    if (score === 15) setStatusText("15?! Stop. You’re cracked. 🏆");
  }, [score, isRunning]);

  // Keep bestScore updated
  useEffect(() => {
    setBestScore((prev) => Math.max(prev, score));
  }, [score]);

  return (
    <section className="rounded-3xl bg-white/10 backdrop-blur border border-white/10 shadow-xl p-7">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-extrabold">Quick Snake</h2>
          <p className="mt-1 text-black/80 font-semibold">{statusText}</p>
          <p className="mt-1 text-sm text-white/60 font-semibold">
            Controls: Arrow keys or WASD • Press Enter/Space to start
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-white/10 px-3 py-2 font-extrabold border border-white/10 shadow">
            Score: {score}
          </span>

          <span className="rounded-xl bg-white/10 px-3 py-2 font-extrabold border border-white/10 shadow">
            Best: {bestScore}
          </span>

          {!isRunning ? (
            <button
              onClick={startGame}
              className="rounded-xl bg-white text-black px-3 py-2 font-extrabold shadow hover:opacity-90 transition"
            >
              Start
            </button>
          ) : (
            <button
              onClick={() => {
                stopGameLoop();
                setIsRunning(false);
                setStatusText("Paused. Hydrate. Be cute. 😌");
              }}
              className="rounded-xl bg-white text-black px-3 py-2 font-extrabold shadow hover:opacity-90 transition"
            >
              Pause
            </button>
          )}

          <button
            onClick={resetGame}
            className="rounded-xl bg-white/10 px-3 py-2 font-extrabold border border-white/10 shadow hover:bg-white/15 transition"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <div className="rounded-3xl border border-white/10 shadow overflow-hidden bg-gradient-to-r from-rose-200/20 via-white/10 to-indigo-200/20 p-3">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}