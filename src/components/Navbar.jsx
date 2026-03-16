"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Home, User, Briefcase, Mail, Send } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Track active section with IntersectionObserver
    useEffect(() => {
        const sections = ["home", "about", "projects", "contact"];
        const observers = sections.map((id) => {
            const el = document.getElementById(id);
            if (!el) return null;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
                { threshold: 0.4 }
            );
            obs.observe(el);
            return obs;
        });
        return () => observers.forEach((obs) => obs?.disconnect());
    }, []);

    const navLinks = [
        { label: "Home", href: "#home", id: "home", icon: <Home size={20} /> },
        { label: "About", href: "#about", id: "about", icon: <User size={20} /> },
        { label: "Projects", href: "#projects", id: "projects", icon: <Briefcase size={20} /> },
        { label: "Contact", href: "#contact", id: "contact", icon: <Mail size={20} /> },
    ];

    return (
        <>
            {/* Desktop / Tablet Navbar (Top) */}
            <nav
                className={cn(
                    "hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-[70px] z-50 transition-all duration-300 px-10 items-center justify-between rounded-full border backdrop-blur-xl shadow-lg",
                    isScrolled ? "translate-y-2 scale-[0.98]" : "translate-y-0 scale-100"
                )}
                style={{
                    backgroundColor: "var(--nav-bg)",
                    borderColor: "var(--nav-border)",
                    boxShadow: "0 0 30px var(--accent-glow)"
                }}
            >
                <div className="absolute inset-0 bg-white/[0.04] rounded-full pointer-events-none" />
                <div className="flex items-center relative z-10">
                    <Link
                        href="/"
                        className="text-accent font-bold text-[20px] tracking-wider transition-all duration-300 hover:brightness-125"
                    >
                        ASVIND V.A
                    </Link>
                </div>

                <div className="flex items-center space-x-8 relative z-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={cn(
                                "group relative flex items-center space-x-2 transition-all duration-300 text-sm font-medium",
                                activeSection === link.id
                                    ? "text-accent"
                                    : "text-foreground/70 hover:text-accent"
                            )}
                        >
                            <span className={cn(
                                "transition-colors",
                                activeSection === link.id ? "text-accent" : "text-foreground/50 group-hover:text-accent"
                            )}>
                                {link.icon}
                            </span>
                            <span>{link.label}</span>
                            {/* Active indicator dot */}
                            {activeSection === link.id && (
                                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent" style={{ boxShadow: "0 0 10px var(--accent)" }} />
                            )}
                        </Link>
                    ))}

                    <a 
                        href="/Asvind_VA_CV.pdf" 
                        download
                        className="ml-4 px-6 py-2 rounded-full bg-accent text-background font-bold text-sm transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-md flex items-center justify-center gap-2"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download PDF
                    </a>
                </div>
            </nav>

            {/* Mobile Navbar (Bottom Full-width Dock) */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50 h-[85px] flex items-center justify-between px-8 border-t backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.4)]"
                style={{
                    backgroundColor: "rgba(3, 7, 18, 0.85)",
                    borderColor: "var(--nav-border)",
                }}
            >
                {/* Glow Line at top of dock */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

                <div className="flex items-center justify-between w-full relative z-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center gap-1.5 transition-all duration-300",
                                activeSection === link.id ? "text-accent scale-110" : "text-foreground/40 hover:text-accent"
                            )}
                        >
                            <div className={cn(
                                "p-1.5 rounded-xl transition-all duration-500",
                                activeSection === link.id ? "bg-accent/10 shadow-[0_0_15px_var(--accent-glow)]" : "bg-transparent"
                            )}>
                                {link.icon}
                            </div>
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                                activeSection === link.id ? "opacity-100" : "opacity-0"
                            )}>
                                {link.label}
                            </span>
                            
                            {/* Active indicator bar */}
                            {activeSection === link.id && (
                                <span className="absolute -bottom-2 w-10 h-[2px] bg-accent rounded-full pulse shadow-[0_0_10px_var(--accent)]" />
                            )}
                        </Link>
                    ))}
                    
                    <a 
                        href="/Asvind_VA_CV.pdf" 
                        download
                        className="flex flex-col items-center gap-1.5 transition-all duration-300 text-foreground/40"
                    >
                        <div className="p-2.5 rounded-2xl bg-accent text-background shadow-lg shadow-accent/20 active:scale-90 transition-transform">
                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.15em]">PDF</span>
                    </a>
                </div>
            </nav>

            <style jsx>{`
                .pulse {
                    animation: pulse-line 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse-line {
                    0%, 100% { opacity: 1; filter: brightness(1); }
                    50% { opacity: 0.6; filter: brightness(1.5); }
                }
            `}</style>
        </>
    );
};

export default Navbar;
