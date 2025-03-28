import Image from "next/image";

export default function Contact() {
    return (
      <div className="relative min-h-screen bg-[#1c853f]">
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
              <Image src="/CLogo.png" alt="Logo" width={180} height={38} priority />
            </div>
          </div>
    );
  }
  