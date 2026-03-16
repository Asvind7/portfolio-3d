"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

import Link from "next/link";

// Dynamically import the 3D scene because it's client-side only and expensive
const CharacterScene = dynamic(() => import("./HomeCharacter"), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-accent animate-pulse font-mono tracking-widest text-sm italic">INITIALIZING 3D ENGINE...</div>,
});

const Hero = () => {
    return (
        <section
            id="home"
            className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-between min-h-screen pt-12 lg:pt-0 px-8 lg:px-24 overflow-hidden bg-transparent"
        >
            {/* Top/Right Column: 3D Scene (Appears first/top on mobile, right on desktop) */}
            <div className="w-full h-[33vh] lg:h-screen relative lg:absolute lg:right-0 lg:w-[55%] flex items-center justify-center z-0 lg:z-10 order-1 lg:order-2">
                <CharacterScene />
            </div>

            {/* Bottom/Left Column: Text Content */}
            <div className="flex-1 w-full max-w-3xl z-10 text-center lg:text-left mt-[20px] lg:mt-0 relative order-2 lg:order-1">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight tracking-tighter bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
                    ASVIND V.A
                </h1>

                <h2 className="text-xl md:text-2xl text-muted-text font-medium mb-8 lg:mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed z-20 relative px-4 lg:px-0">
                    3D Artist, Motion Designer & Video Editor crafting immersive digital experiences.
                </h2>

                <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 justify-center lg:justify-start">
                    <a 
                        href="/Asvind_VA_CV.pdf" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-10 py-4 rounded-full bg-accent text-background font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[var(--accent-glow)] flex items-center justify-center gap-2" 
                        style={{ boxShadow: "0 0 20px var(--accent-glow)" }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                        </svg>
                        View PDF
                    </a>

                    <Link href="#contact" className="w-full sm:w-auto px-10 py-4 rounded-full border-2 border-accent text-accent font-bold text-lg transition-all duration-300 hover:bg-accent/10" style={{ boxShadow: "0 0 10px var(--accent-glow)" }}>
                        Contact Me
                    </Link>
                </div>

                <div className="hidden lg:flex gap-12 mt-20 text-accent/20 z-20 relative">
                    <Sparkles className="w-10 h-10 animate-pulse delay-200" />
                </div>
            </div>
        </section>
    );
};

export default Hero;
