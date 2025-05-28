export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[hsl(0,0%,0%)] text-center p-4 relative overflow-hidden">
      {/* Animated Stars Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(700)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-4 text-white">Welcome to Chelsea&apos;s Developer Portfolio</h1>
        <p className="mb-6 text-lg text-white">Dive into my projects, learn more about me, or get in touch:</p>
        <nav className="space-x-6 text-lg">
          <a href="/home" className="hover:underline text-white">Home</a>
          <a href="/projects" className="hover:underline text-white">Projects</a>
          <a href="/contact" className="hover:underline text-white">Contact</a>
        </nav>
      </div>
    </main>
  );
}
