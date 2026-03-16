"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export const SubcategoryPanel = ({ sub, onSelect, index }) => {
    const [hovered, setHovered] = useState(false);
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // Use the first project's image as the panel background
    const bgSrc = sub.projects[0]?.src ?? "/projects/character.png";

    return (
        <div
            ref={ref}
            onClick={() => onSelect(sub)}
            className="relative overflow-hidden rounded-2xl cursor-pointer group border bg-[#0a0a0a]/80 backdrop-blur-md transition-all duration-300 h-full"
            style={{
                borderColor: hovered ? "var(--accent)" : "rgba(255,255,255,0.05)",
                boxShadow: hovered ? "0 0 40px var(--accent-glow)" : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease ${index * 80}ms`,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Thumbnail Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={bgSrc}
                    alt={sub.name}
                    fill
                    className="object-cover opacity-40 group-hover:opacity-60 transition-all duration-700"
                    style={{ transform: hovered ? "scale(1.1)" : "scale(1)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center p-3 h-full min-h-[70px] gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/10 backdrop-blur-md text-accent border border-white/10 group-hover:bg-accent group-hover:text-background transition-all">
                    <span className="text-2xl">{sub.icon}</span>
                </div>

                <div className="flex flex-col flex-1">
                    <h3 className="text-white font-black text-sm md:text-base uppercase tracking-tight leading-tight drop-shadow-lg">{sub.name}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        {sub.projects.slice(0, 2).map((p, i) => (
                            <div key={i} className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 text-[8px] font-black text-white uppercase tracking-tighter leading-none">
                                {p.title.split(' ')[0]}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Counter Badge */}
                <div className="text-[10px] font-black text-accent/50 pr-2 hidden xs:block tracking-widest">
                    {sub.projects.length}
                </div>

                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
        </div>
    );
};
