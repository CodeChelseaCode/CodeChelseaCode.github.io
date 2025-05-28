import Image from "next/image";

export default function Projects() {
  return (
    <div className="relative min-h-screen bg-[#774708]">
      {/* Navigation Bar */}
      <nav className="absolute top-0 right-0 p-6">
        <ul className="flex gap-6 text-lg font-medium">
          <li>
            <a href="/home" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/projects" className="hover:underline">
              Projects
            </a>
          </li>
          <li>
            <a href="/contact" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </nav>

      {/* Logo centered at the top */}
      <div className="flex justify-center items-start pt-8">
        <Image
          src="/CLogo.png"
          alt="Logo"
          width={300} // Increase the width
          height={62} // Increase the height
          priority
          className="logo-grow" // Apply the grow effect
        />
      </div>
    </div>
  );
}
