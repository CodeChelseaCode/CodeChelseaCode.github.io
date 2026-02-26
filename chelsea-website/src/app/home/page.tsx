"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  // ===== Snake Game =====
  const cols = 18;
  const rows = 10;
  const cell = 22; // px
  const width = cols * cell;
  const height = rows * cell;

  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const DIRS = useMemo(
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

  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState("Press Start — no thoughts, just vibes 🐍");
  const [running, setRunning] = useState(false);

  // game state in refs (so interval doesn't fight React rerenders)
  const snakeRef = useRef([]);
  const dirRef = useRef({ x: 1, y: 0 });
  const nextDirRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef({ x: 10, y: 5 });

  const placeFood = () => {
    const snake = snakeRef.current;
    let fx, fy, tries = 0;

    do {
      fx = randInt(0, cols - 1);
      fy = randInt(0, rows - 1);
      tries++;
      if (tries > 200) break;
    } while (snake.some((p) => p.x === fx && p.y === fy));

    foodRef.current = { x: fx, y: fy };
  };

  const stopLoop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // background
    ctx.clearRect(0, 0, width, height);

    // soft board bg
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillRect(0, 0, width, height);

    // grid (subtle)
    ctx.strokeStyle = "rgba(0,0,0,0.07)";
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cell, 0);
      ctx.lineTo(x * cell, height);
      ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cell);
      ctx.lineTo(width, y * cell);
      ctx.stroke();
    }

    // food
    const food = foodRef.current;
    ctx.fillStyle = "rgba(250, 204, 21, 0.95)"; // yellow-ish
    ctx.fillRect(food.x * cell + 3, food.y * cell + 3, cell - 6, cell - 6);

    // snake
    const snake = snakeRef.current;
    snake.forEach((p, i) => {
      // head darker
      ctx.fillStyle =
        i === 0 ? "rgba(17, 24, 39, 0.95)" : "rgba(17, 24, 39, 0.78)";
      ctx.fillRect(p.x * cell + 2, p.y * cell + 2, cell - 4, cell - 4);
    });
  };

  const resetGame = () => {
    const startX = Math.floor(cols / 3);
    const startY = Math.floor(rows / 2);
    snakeRef.current = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    placeFood();
    setScore(0);
    setStatus("Press Start — no thoughts, just vibes 🐍");
    setRunning(false);
    stopLoop();
    draw();
  };

  const startLoop = () => {
    stopLoop();
    intervalRef.current = setInterval(tick, 120);
  };

  const startGame = () => {
    setRunning(true);
    setStatus("Alright bestie… don’t embarrass us 😭 (Arrow keys / WASD)");
    startLoop();
  };

  const gameOver = () => {
    stopLoop();
    setRunning(false);
    setStatus("You bonked 💀 Press Start for revenge.");
    setBest((b) => Math.max(b, score));
  };

  const tick = () => {
    // update dir (prevent instant reverse)
    const d = nextDirRef.current;
    const cur = dirRef.current;
    if (!(d.x === -cur.x && d.y === -cur.y)) {
      dirRef.current = d;
    }

    const snake = snakeRef.current;
    const head = snake[0];
    const dir = dirRef.current;

    const newHead = {
      x: head.x + dir.x,
      y: head.y + dir.y,
    };

    // walls -> game over
    if (
      newHead.x < 0 ||
      newHead.x >= cols ||
      newHead.y < 0 ||
      newHead.y >= rows
    ) {
      gameOver();
      return;
    }

    // self collision -> game over
    if (snake.some((p) => p.x === newHead.x && p.y === newHead.y)) {
      gameOver();
      return;
    }

    // move
    snake.unshift(newHead);

    // eat?
    const food = foodRef.current;
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore((s) => s + 1);
      placeFood();
    } else {
      snake.pop();
    }

    snakeRef.current = snake;
    draw();
  };

  // init + key controls
  useEffect(() => {
    resetGame();

    const onKeyDown = (e) => {
      const key = e.key;
      if (key === " " || key === "Enter") {
        // space/enter toggles start/pause-ish
        if (!running) startGame();
        return;
      }
      const d = DIRS[key];
      if (d) {
        e.preventDefault();
        nextDirRef.current = d;
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      stopLoop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // cute/quirky status updates based on score
  useEffect(() => {
    if (!running) return;

    if (score === 0) setStatus("Warm-up lap. Don’t blink 😌");
    if (score === 3) setStatus("Okay… you kinda ate that. Literally. ✨");
    if (score === 6) setStatus("We’re cooking. Keep it cute. 🐍🔥");
    if (score === 9) setStatus("Main character energy activated 💅");
    if (score === 12) setStatus("Respectfully… who trained you?? 😭");
    if (score === 15) setStatus("15?! Stop. You’re cracked. 🏆");
  }, [score, running]);

  // keep best in sync when score changes
  useEffect(() => {
    setBest((b) => Math.max(b, score));
  }, [score]);

  return (
    <div className="relative min-h-screen bg-[tan] text-black overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-yellow-300/55 blur-3xl" />
        <div className="absolute top-28 -right-24 h-[28rem] w-[28rem] rounded-full bg-slate-900/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-200/45 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 12px)",
          }}
        />
      </div>

      {/* Hamburger nav (small) */}
      <header className="absolute top-0 right-0 p-5 z-20">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="rounded-2xl bg-white/70 backdrop-blur shadow border border-black/10 px-4 py-3 hover:bg-white/80 transition"
          >
            <div className="flex flex-col gap-1.5">
              <span className="h-0.5 w-7 bg-black/90 rounded" />
              <span className="h-0.5 w-7 bg-black/90 rounded" />
              <span className="h-0.5 w-7 bg-black/90 rounded" />
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white/80 backdrop-blur shadow-xl border border-black/10 overflow-hidden">
              <div className="p-2">
                {[
                  { label: "Home", href: "/home" },
                  { label: "Projects", href: "/projects" },
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/contact" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block rounded-xl px-4 py-3 font-semibold text-black/80 hover:text-black hover:bg-white transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="/resume.pdf"
                  className="mt-1 block rounded-xl bg-black text-white px-4 py-3 font-extrabold text-center hover:opacity-90 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Resume
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Logo (DO NOT MOVE) */}
      <div className="flex justify-center items-start pt-8 relative z-10">
        <Image
          src="/CLogo.png"
          alt="Logo"
          width={300}
          height={62}
          priority
          className="logo-grow"
        />
      </div>

      {/* Page content */}
      <main className="relative z-10 px-6">
        <div className="mx-auto max-w-6xl">
          {/* HERO */}
          <section className="mt-10 rounded-3xl bg-white/70 backdrop-blur shadow-xl border border-black/10 p-8">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-black">
              Hi, I’m Chelsea.
            </h1>

            <p className="mt-5 text-lg text-black/90 max-w-3xl font-semibold leading-relaxed">
              I’m a 2024 Computer Science graduate who builds with intention —
              clean interfaces, sharp details, and code that holds up when it matters.
            </p>

            <p className="mt-4 text-lg text-black/80 max-w-3xl font-medium leading-relaxed">
              This portfolio is my proof of work. Every project is a step forward:
              new tools, tougher problems, better structure, and cleaner execution.
              I learn fast, iterate relentlessly, and I’m always ready for the next level.
            </p>
          </section>

          {/* SNAKE GAME */}
          <section className="mt-10">
            <div className="rounded-3xl bg-white/70 backdrop-blur shadow-xl border border-black/10 p-7">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-extrabold">Quick Snake</h2>
                  <p className="mt-1 text-black/80 font-semibold">{status}</p>
                  <p className="mt-1 text-sm text-black/60 font-semibold">
                    Controls: Arrow keys or WASD • Press Enter/Space to start
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-yellow-300 px-3 py-2 font-extrabold border border-black/10 shadow">
                    Score: {score}
                  </span>
                  <span className="rounded-xl bg-white/70 px-3 py-2 font-extrabold border border-black/10 shadow">
                    Best: {best}
                  </span>

                  {!running ? (
                    <button
                      onClick={startGame}
                      className="rounded-xl bg-black text-white px-3 py-2 font-extrabold shadow hover:opacity-90 transition"
                    >
                      Start
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        stopLoop();
                        setRunning(false);
                        setStatus("Paused. Take a breath. Hydrate. 😌");
                      }}
                      className="rounded-xl bg-black text-white px-3 py-2 font-extrabold shadow hover:opacity-90 transition"
                    >
                      Pause
                    </button>
                  )}

                  <button
                    onClick={resetGame}
                    className="rounded-xl bg-white/70 px-3 py-2 font-extrabold border border-black/10 shadow hover:bg-white transition"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <div className="rounded-3xl border border-black/10 shadow overflow-hidden bg-gradient-to-r from-yellow-200/60 via-white/60 to-amber-200/60 p-3">
                  <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* EXPLORE (kept, simple) */}
          <section className="mt-10 pb-16">
            <div className="rounded-3xl bg-white/60 backdrop-blur shadow border border-black/10 p-8">
              <h3 className="text-xl font-extrabold">Explore</h3>
              <p className="mt-2 text-black/70 font-medium">
                Jump to what you’re looking for.
              </p>

              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                <a
                  href="/projects"
                  className="rounded-2xl bg-white/75 border border-black/10 shadow p-6 hover:-translate-y-1 transition"
                >
                  <p className="font-extrabold">Projects</p>
                  <p className="mt-1 text-sm text-black/70 font-medium">
                    Case studies and builds
                  </p>
                </a>

                <a
                  href="/about"
                  className="rounded-2xl bg-white/75 border border-black/10 shadow p-6 hover:-translate-y-1 transition"
                >
                  <p className="font-extrabold">About</p>
                  <p className="mt-1 text-sm text-black/70 font-medium">
                    Background and skills
                  </p>
                </a>

                <a
                  href="/contact"
                  className="rounded-2xl bg-white/75 border border-black/10 shadow p-6 hover:-translate-y-1 transition"
                >
                  <p className="font-extrabold">Contact</p>
                  <p className="mt-1 text-sm text-black/70 font-medium">
                    Say hello and connect
                  </p>
                </a>
              </div>
            </div>
          </section>

          {/* Scroll to Footer */}
          <section className="text-center pb-16">
            <button
              onClick={() =>
                document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" })
              }
              className="animate-bounce text-5xl font-bold text-black"
              aria-label="Scroll to footer"
            >
              ⬇️
            </button>
          </section>
        </div>
      </main>

      {/* Footer (UNCHANGED) */}
      <footer id="footer" className="bg-black text-white text-center py-6">
        <p>© {new Date().getFullYear()} Chelsea Rice. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a
            href="https://github.com/codechelseacode"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/chelsea-rice"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            LinkedIn
          </a>
          <a href="/resume.pdf" className="hover:underline">
            Resume
          </a>
        </div>
      </footer>
    </div>
  );
}