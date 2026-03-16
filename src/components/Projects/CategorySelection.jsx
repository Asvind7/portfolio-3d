"use client";

import React, { useState } from "react";
import { useFadeUp } from "./Shared";

export const CategoryCard = ({ cat, onClick, delay, onMouseEnter, onMouseLeave }) => {
    const fade = useFadeUp(delay);
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
        if (onMouseEnter) onMouseEnter(cat.id);
    };

    const handleMouseLeave = () => {
        setHovered(false);
        if (onMouseLeave) onMouseLeave(null);
    };

    return (
        <div
            ref={fade.ref}
            onClick={() => {
                onClick();
                if (onMouseEnter) onMouseEnter(cat.id); // Trigger click as hover-style active
            }}
            style={{
                ...fade.style,
                borderColor: hovered ? "var(--accent)" : "var(--card-border)",
                boxShadow: hovered ? "0 0 50px var(--accent-glow), 0 16px 48px rgba(0,0,0,0.15)" : "0 4px 20px rgba(0,0,0,0.05)",
                transform: fade.style.transform + (hovered ? " translateY(-4px)" : ""),
            }}
            className="relative flex flex-col rounded-2xl border bg-card-bg backdrop-blur-sm overflow-hidden transition-all duration-300 cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: hovered ? "linear-gradient(90deg, transparent 5%, var(--accent) 50%, transparent 95%)" : "linear-gradient(90deg, transparent 15%, color-mix(in srgb, var(--accent) 20%, transparent) 50%, transparent 85%)", transition: "all 0.3s" }} />

            {/* Body */}
            <div className="flex flex-row items-center p-3 sm:p-4 lg:p-7 lg:py-8 min-h-[70px] lg:min-h-[130px] gap-4 lg:gap-7">
                {/* Icon Container */}
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0 bg-black/40 text-accent border border-white/5 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:text-black">
                    {cat.id === "3d"
                        ? <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 lg:w-8 lg:h-8" stroke="currentColor" strokeWidth={2}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                        : <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 lg:w-8 lg:h-8" stroke="currentColor" strokeWidth={2}><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    }
                </div>

                {/* Text Content */}
                <div className="flex flex-col flex-1 text-left">
                    <div className="flex flex-col lg:flex-row lg:items-baseline gap-0.5 lg:gap-3">
                        <h3 className="text-foreground font-black text-base lg:text-xl uppercase tracking-tight leading-tight">{cat.label}</h3>
                        <span className="text-[10px] font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20 uppercase tracking-widest hidden lg:inline-block">
                            {cat.tag}
                        </span>
                    </div>

                    <p className="text-muted-text text-sm max-w-2xl mt-1.5 opacity-70 leading-relaxed hidden lg:block">
                        {cat.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 lg:gap-2 mt-1.5 lg:mt-3">
                        {cat.subcategories.map(s => (
                            <div key={s.id} className="text-[8px] lg:text-[9px] font-black px-2 py-0.5 lg:px-3 lg:py-1 rounded-md bg-accent/10 text-accent border border-accent/20 uppercase tracking-widest transition-all group-hover:bg-accent/20">
                                {s.name.includes(' ') && cat.id !== '3d' ? s.name.split(' ')[0] : s.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop Indicator */}
                <div className="flex-col items-center gap-1 hidden lg:flex shrink-0 opacity-30 group-hover:opacity-100 transition-all">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-3 -rotate-90 origin-right translate-x-3">Explore</div>
                    <div className="w-[2px] h-14 bg-accent/30 rounded-full group-hover:bg-accent transition-colors" />
                </div>
            </div>
        </div>
    );
};
