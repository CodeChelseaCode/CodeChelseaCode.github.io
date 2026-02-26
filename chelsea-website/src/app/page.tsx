"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Drop = {
  left: string;
  height: string;
  delay: string;
  duration: string;
  colorClass: string;
};

export default function LandingPage() {
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    // higher contrast on white
    const colors = ["bg-yellow-400/90", "bg-purple-500/90"];

    const newDrops: Drop[] = Array.from({ length: 140 }).map(() => {
      const colorClass = colors[Math.floor(Math.random() * colors.length)];
      return {
        left: `${Math.random() * 100}%`,
        height: `${30 + Math.random() * 90}px`,
        delay: `${Math.random() * 1.8}s`,
        duration: `${1.2 + Math.random() * 1.3}s`,
        colorClass,
      };
    });

    setDrops(newDrops);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070712] text-white flex items-center justify-center px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.20),transparent_55%),radial-gradient(circle_at_right,rgba(99,102,241,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(244,63,94,0.14),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/45" />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Big Logo Box */}
        <div className="relative select-none rounded-3xl bg-white border border-white/10 shadow-2xl p-8 overflow-hidden">
          {/* soft inner tint so rain pops */}
          <div className="pointer-events-none absolute inset-0 z-[1] bg-black/[0.02]" />

          {/* 🌧 Two-color rain layer (ABOVE white bg, BELOW logo) */}
          <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
            {drops.map((d, i) => (
              <span
                key={i}
                className={`absolute w-[2px] rounded-full animate-rain ${d.colorClass}`}
                style={{
                  left: d.left,
                  height: d.height,
                  animationDelay: d.delay,
                  animationDuration: d.duration,
                  // make colors visibly “pop” on white
                  filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.15))",
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <div className="relative z-[3]">
            <Image
              src="/CLogo.png"
              alt="Chelsea Logo"
              width={900}
              height={260}
              priority
              className="logo-grow w-[min(86vw,680px)] drop-shadow-[0_30px_70px_rgba(0,0,0,0.60)]"
            />
          </div>
        </div>

        {/* Enter button */}
        <a
          href="/home"
          className="mt-8 inline-flex items-center justify-center rounded-2xl bg-white text-black px-10 py-4 text-lg md:text-xl font-extrabold shadow-xl hover:opacity-90 active:scale-[0.98] transition"
        >
          Enter Portfolio →
        </a>
      </div>
    </main>
  );
}