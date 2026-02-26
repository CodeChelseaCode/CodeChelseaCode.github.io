"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Project = {
  title: string;
  description: string;
  repoUrl: string;
  tags: string[];
};

type NavItem = {
  label: string;
  href: string;
};

const PROJECT_LIST: Project[] = [
  {
    title: "Portfolio Website",
    description:
      "Personal portfolio built using Next.js and TypeScript showcasing projects and growth.",
    repoUrl: "https://github.com/codechelseacode/codechelseacode.github.io",
    tags: ["Next.js", "TypeScript", "UI/UX"],
  },

  {
    title: "Malware Extermination",
    description:
      "A C# cybersecurity-themed game where NPC cats teach players how to protect systems from malware threats.",
    repoUrl: "https://github.com/CodeChelseaCode/Malware-Exterminator",
    tags: ["C#", "Game Dev", "Cybersecurity"],
  }
];

export default function ProjectsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "Home", href: "/home" },
      { label: "Projects", href: "/projects" },
      { label: "Contact", href: "/contact" },
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
              width={200}
              height={200}
              priority
              className="logo-grow object-contain w-36"
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
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              className="md:hidden rounded-xl bg-white/70 border border-black/10 px-3 py-2 shadow"
              onClick={toggleMobileMenu}
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
          {/* Page header */}
          <section className="mt-10 rounded-3xl bg-white/70 backdrop-blur shadow-xl border border-black/10 p-8">
            <p className="inline-flex rounded-full bg-pink-500/15 px-4 py-2 font-extrabold border border-black/10">
              ✿ Projects ✿
            </p>

            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold">My Work</h1>

            <p className="mt-4 text-lg font-semibold text-black/80 max-w-3xl">
              Projects that showcase problem-solving, experimentation, and
              continuous improvement through building and testing.
            </p>
          </section>

          {/* Project cards */}
          <section className="mt-10 pb-16 grid md:grid-cols-2 gap-6">
            {PROJECT_LIST.map((project) => (
              <article
                key={project.title}
                className="rounded-3xl bg-white/70 backdrop-blur shadow-xl border border-black/10 p-7"
              >
                <h2 className="text-xl font-extrabold">{project.title}</h2>

                <p className="mt-3 text-black/80 font-medium">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/70 px-3 py-1 text-xs font-extrabold border border-black/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Repo link */}
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 rounded-xl bg-black text-white px-4 py-2 font-extrabold shadow hover:opacity-90 transition"
                >
                  View GitHub →
                </a>
              </article>
            ))}
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