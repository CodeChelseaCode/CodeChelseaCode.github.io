"use client"; // Required for interactivity like onClick

import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[tan] text-black">
      {/* Navigation Bar */}
      <nav className="absolute top-0 right-0 p-6">
        <ul className="flex gap-6 text-lg font-medium">
          <li>
            <a href="/home" className="hover:underline">
              Home
            </a>
          </li>
        </ul>
      </nav>

      {/* Logo */}
      <div className="flex justify-center items-start pt-8">
        <Image
          src="/CLogo.png"
          alt="Logo"
          width={300}
          height={62}
          priority
          className="logo-grow"
        />
      </div>

      {/* Hero / Intro Section */}
      <section className="flex flex-col items-center text-center mt-12 px-6">
        <h1 className="text-4xl font-bold mb-4">Hi, I’m Chelsea Rice 👋</h1>
        <p className="text-lg max-w-2xl">
          I’m a passionate software developer and cybersecurity enthusiast.
          I love building creative projects, solving problems, and helping people
          through technology.
        </p>
      </section>

      {/* About Me */}
      <section className="mt-20 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6">About Me</h2>
        <p className="max-w-3xl mx-auto text-lg">
          I’m a recent Computer Science graduate with a background in customer
          service and technical support. I’ve completed the NPower bootcamp,
          earned my CompTIA Tech+ certification, and I’m currently preparing for
          CompTIA A+. I enjoy blending creativity with technology — from building
          websites to designing games and exploring cybersecurity.
        </p>
      </section>

      {/* Technologies I’ve Worked With */}
      <section className="mt-20 px-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Technologies I’ve Worked With
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Languages */}
          <div className="p-6 bg-white/70 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-4">Languages</h3>
            <ul className="space-y-2">
              <li>Python</li>
              <li>SQL</li>
              <li>Java</li>
              <li>C++</li>
              <li>C#</li>
            </ul>
          </div>

          {/* Frameworks & Tools */}
          <div className="p-6 bg-white/70 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-4">Frameworks & Tools</h3>
            <ul className="space-y-2">
              <li>Next.js</li>
              <li>Tailwind CSS</li>
              <li>GitHub</li>
            </ul>
          </div>

          {/* Coursework Experience */}
          <div className="p-6 bg-white/70 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-4">Coursework Experience</h3>
            <ul className="space-y-2">
              <li>Data Structures & Algorithms</li>
              <li>Databases (SQL)</li>
              <li>Software Engineering Fundamentals</li>
              <li>Object-Oriented Programming</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Featured Highlights (Project teasers) */}
      <section className="mt-20 px-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Featured Highlights
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/70 p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">Malware Extermination</h3>
            <p className="mb-4">
              A C# game where NPC cats teach players how to protect computers
              from viruses while fighting off malware.
            </p>
            <a
              href="/projects"
              className="text-blue-600 hover:underline"
            >
              View More →
            </a>
          </div>

          {/* Blank card for future featured project */}
          <div className="bg-white/70 p-6 rounded-xl shadow flex items-center justify-center">
            <p className="text-gray-500 italic">Coming Soon...</p>
          </div>
        </div>
      </section>

      {/* Scroll to Footer Button with Black Arrow */}
      <section className="mt-20 text-center px-6 pb-16">
        <button
          onClick={() =>
            document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" })
          }
          className="animate-bounce text-5xl font-bold text-black"
        >
          ⬇️
        </button>
      </section>

      {/* Footer */}
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
