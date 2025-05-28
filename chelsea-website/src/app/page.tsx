// src/app/page.tsx
export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[hsl(34,44%,26%)] text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Chelsea's Site</h1>
      <p className="mb-6 text-lg">Check out my pages below:</p>
      <nav className="space-x-6 text-lg">
        <a href="/home" className="hover:underline">Home</a>
        <a href="/projects" className="hover:underline">Projects</a>
        <a href="/contact" className="hover:underline">Contact</a>
      </nav>
    </main>
  );
}
