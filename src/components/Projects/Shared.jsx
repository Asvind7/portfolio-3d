"use client";

import React, { useState, useEffect, useRef } from "react";

// ─── Shared Styles & Components ───────────────────

export function useFadeUp(delay = 0) {
    const ref = useRef(null);
    const [v, setV] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return { ref, style: { opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms` } };
}

export const GreenLabel = ({ children }) => (
    <span className="text-xs tracking-[0.28em] uppercase font-bold" style={{ color: "var(--accent)" }}>{children}</span>
);

export const BackBtn = ({ label, onClick }) => (
    <button onClick={onClick} className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all duration-200"
        style={{ color: "var(--muted-text)" }}
        onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "var(--muted-text)"; }}
    >
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 transition-transform group-hover:-translate-x-1" stroke="currentColor" strokeWidth={3}>
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        {label}
    </button>
);

export const getToolIcon = (tool) => {
    const t = tool.toLowerCase();
    
    // Local Premium Icons from UXWing
    const icons = {
        "blender": "/icons/blender.png",
        "photoshop": "/icons/photoshop.png",
        "after effects": "/icons/after-effects.png",
        "premiere pro": "/icons/premiere-pro.png",
        "illustrator": "/icons/illustrator.png"
    };

    if (icons[t]) {
        return (
            <img 
                src={icons[t]} 
                alt={tool} 
                className="w-6 h-6 object-contain filter brightness-110 contrast-110 hover:scale-110 transition-transform" 
                loading="lazy"
            />
        );
    }

    return null;
};
