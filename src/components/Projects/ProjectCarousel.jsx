"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useFadeUp, GreenLabel, BackBtn } from "./Shared";
import { Home } from "lucide-react";

export const ProjectCarousel = ({ subcategory, categoryLabel, onViewCaseStudy, onBack, onBackToHome }) => {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [mounted, setMounted] = useState(false);
    const projects = subcategory.projects;
    const total = projects.length;

    useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

    const go = useCallback((dir) => {
        if (animating) return;
        setAnimating(true);
        setCurrent(c => (c + dir + total) % total);
        setTimeout(() => setAnimating(false), 450);
    }, [animating, total]);

    return (
        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(32px)", transition: "all 0.45s ease" }} className="flex flex-col gap-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 flex-wrap text-sm">
                <button onClick={onBackToHome} className="p-2 border border-card-border rounded-full hover:bg-card-bg hover:text-accent transition-colors"><Home size={16}/></button>
                <span className="text-muted-text/30">›</span>
                <BackBtn label={categoryLabel} onClick={onBack} />
                <span className="text-muted-text/30">›</span>
                <span style={{ color: "var(--accent)" }} className="font-semibold">{subcategory.name}</span>
            </div>

            <div className="flex flex-col gap-2">
                <GreenLabel>{categoryLabel} · {subcategory.name}</GreenLabel>
                <h2 className="text-4xl md:text-5xl font-black text-foreground">{subcategory.name}</h2>
            </div>

            {/* Main carousel */}
            <div className="relative w-full rounded-2xl overflow-hidden border" style={{ borderColor: "var(--card-border)" }}>
                {/* Slide strip */}
                <div className="flex" style={{ transform: `translateX(-${current * 100}%)`, transition: animating ? "transform 0.45s cubic-bezier(0.4,0,0.2,1)" : "none" }}>
                    {projects.map((project, i) => (
                        <div key={project.id} className="relative w-full flex-shrink-0" style={{ aspectRatio: "16/9" }}>
                            <Image src={project.src} alt={project.title} fill className="object-cover" />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(3,7,18,0.95) 100%)" }} />
                            {/* Slide info */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    {project.subcategoryName && (
                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-accent text-background">
                                            {project.subcategoryName}
                                        </span>
                                    )}
                                    <span className="text-xs font-semibold tracking-widest uppercase text-white/40">{project.subtitle}</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white">{project.title}</h3>
                                <p className="text-white/60 text-sm">{project.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Arrows */}
                <button onClick={() => go(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                    style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", backdropFilter: "blur(8px)" }}>
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button onClick={() => go(1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                    style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", backdropFilter: "blur(8px)" }}>
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6" /></svg>
                </button>
            </div>

            {/* Dots + CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-2">
                    {projects.map((_, i) => (
                        <button key={i} onClick={() => setCurrent(i)} className="rounded-full transition-all duration-300"
                            style={{ 
                                width: i === current ? 24 : 8, 
                                height: 8, 
                                background: i === current ? "var(--accent)" : "color-mix(in srgb, var(--foreground) 15%, transparent)", 
                                boxShadow: i === current ? "0 0 8px var(--accent-glow)" : "none" 
                            }} />
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => onViewCaseStudy(projects[current])}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border transition-all duration-300 hover:gap-3 group shadow-sm"
                        style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)", color: "var(--accent)" }}
                        onMouseEnter={e => { 
                            e.currentTarget.style.background = "linear-gradient(135deg, var(--accent), var(--accent-secondary))"; 
                            e.currentTarget.style.color = "var(--background)"; 
                            e.currentTarget.style.borderColor = "transparent"; 
                        }}
                        onMouseLeave={e => { 
                            e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 10%, transparent)"; 
                            e.currentTarget.style.color = "var(--accent)"; 
                            e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 30%, transparent)"; 
                        }}
                    >
                        View More Details
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 group-hover:translate-x-1 transition-transform" stroke="currentColor" strokeWidth={2}>
                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {projects.map((p, i) => (
                    <button key={p.id} onClick={() => setCurrent(i)}
                        className="relative flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm"
                        style={{ width: 120, height: 72, borderColor: i === current ? "var(--accent)" : "var(--card-border)", opacity: i === current ? 1 : 0.55 }}
                    >
                        <Image src={p.src} alt={p.title} fill className="object-cover" />
                        <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/60 to-transparent">
                            <span className="text-[10px] text-white font-bold truncate tracking-wide">{p.title}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
