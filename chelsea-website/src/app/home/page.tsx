"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import SnakeGame from "../components/SnakeGame";

type NavItem = { label: string; href: string };
type InfoCard = { title: string; value: string };

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Keep navigation labels/links in one place
  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "Home", href: "/home" },
      { label: "Projects", href: "/projects" },
      { label: "Contact", href: "/contact" },
    ],
    []
  );

  // Small “about me” cards
  const infoCards = useMemo<InfoCard[]>(
    () => [
      { title: "Current Focus", value: "Re-Learning Java" },
      { title: "Tools", value: "Next.js • TypeScript • Git" },
    ],
    []
  );

  const currentYear = new Date().getFullYear();

  const toggleMobileMenu = () => setIsMobileMenuOpen((open) => !open);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-yellow-100 text-black overflow-hidden">
      {/* Background (blobs + dotted grid overlay) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-pink-300/55 blur-3xl" />
        <div className="absolute top-10 -right-28 h-[30rem] w-[30rem] rounded-full bg-fuchsia-300/40 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.28) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      {/* NAVBAR */}
      <header className="relative z-20">
        <div className="mx-auto max-w-6xl px-6 pt-6 flex items-center justify-between">
          {/* Left: Logo */}
          <a href="/home" className="flex items-center">
            <Image
              src="/CLogo.png"
              alt="Chelsea logo"
              width={220}
              height={220}
              priority
              className="logo-grow object-contain w-40"
            />
          </a>

          {/* Right: Desktop nav + Mobile menu button */}
          <div className="rounded-2xl bg-white/70 backdrop-blur shadow border border-black/10 px-6 py-4">
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8 font-semibold text-black/80">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="hover:text-black transition"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden rounded-xl bg-white/70 border border-black/10 px-3 py-2 shadow"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="flex flex-col gap-1.5">
                <span className="h-0.5 w-6 bg-black rounded" />
                <span className="h-0.5 w-6 bg-black rounded" />
                <span className="h-0.5 w-6 bg-black rounded" />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="mx-auto max-w-6xl px-6 mt-3 md:hidden">
            <div className="rounded-2xl bg-white/75 backdrop-blur shadow border border-black/10">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-5 py-4 font-semibold hover:bg-white/80"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 px-6 flex-1">
        <div className="mx-auto max-w-6xl">
          {/* Intro */}
          <section className="mt-10 rounded-3xl bg-white/70 backdrop-blur shadow-xl border border-black/10 p-8">
            <p className="inline-flex rounded-full bg-pink-500/15 px-4 py-2 font-extrabold border border-black/10">
              ✿ Home ✿
            </p>

            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold">
              Hi, I’m Chelsea 👋
            </h1>

            <p className="mt-4 text-lg font-semibold text-black/80 max-w-3xl">
              Computer Science grad focused on QA mindset, debugging, and building
              clean, reliable software. Welcome to my space.
            </p>

          </section>

          {/* Quick info cards */}
          <section className="mt-10 grid md:grid-cols-3 gap-6">
            {infoCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl bg-white/70 backdrop-blur shadow-xl border border-black/10 p-7"
              >
                <p className="text-xs font-extrabold uppercase tracking-wide text-black/60">
                  {card.title}
                </p>
                <p className="mt-2 text-lg font-extrabold">{card.value}</p>
              </div>
            ))}
          </section>

          {/* Mini game section */}
          <section className="mt-10 pb-16">
            <div className="rounded-3xl bg-white/70 backdrop-blur shadow-xl border border-black/10 p-8">
              <p className="inline-flex rounded-full bg-pink-500/15 px-4 py-2 font-extrabold border border-black/10">
                ✿ Mini Game ✿
              </p>

              <h2 className="mt-6 text-2xl md:text-3xl font-extrabold">Snake</h2>

              <p className="mt-3 text-black/80 font-medium">
                Wanna take a game break?
              </p>

              <div className="mt-6">
                <SnakeGame />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white text-center py-6">
        <p>© {currentYear} Chelsea Rice. All rights reserved.</p>

        <div className="flex justify-center gap-6 mt-4">
          <a
            href="https://github.com/codechelseacode"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/chelsea-rice"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a href="/resume.pdf">Resume</a>
        </div>
      </footer>
    </div>
  );
}