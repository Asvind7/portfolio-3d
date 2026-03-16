import Link from "next/link";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen text-foreground relative overflow-hidden bg-transparent pb-[85px] md:pb-0">
      {/* Background provided by global BackgroundCanvas */}

      <Hero />

      {/* Other Sections Placeholders */}
      <About />

      <Projects />

      <Contact />
    </main>
  );
}
