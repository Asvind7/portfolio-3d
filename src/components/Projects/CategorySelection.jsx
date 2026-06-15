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

    // Determine which icon to use based on the category ID
    const iconSrc = cat.id === "3d" ? "/icons/blender.png" : "/icons/premiere-pro.png";
    const appName = cat.id === "3d" ? "Blender" : "Premiere Pro";

    return (
        <div
            ref={fade.ref}
            onClick={() => {
                onClick();
                if (onMouseEnter) onMouseEnter(cat.id);
            }}
            style={{
                ...fade.style,
                transform: fade.style.transform + (hovered ? " scale(1.05)" : ""),
            }}
            className="relative flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-200 w-32 h-36"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Desktop Icon Selection Highlight */}
            <div 
                className={`absolute inset-0 rounded-xl transition-all duration-200 ${hovered ? "bg-white/10 border border-white/20" : "bg-transparent border border-transparent"}`}
            />

            {/* Application Icon Image */}
            <img 
                src={iconSrc} 
                alt={appName} 
                className={`w-16 h-16 object-contain z-10 transition-all duration-200 ${hovered ? "drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "drop-shadow-md"}`} 
            />

            {/* Desktop Label Text */}
            <span className={`mt-3 text-xs text-center z-10 px-2 py-0.5 rounded ${hovered ? "bg-accent text-background font-bold" : "text-white text-shadow-sm"}`} style={{ textShadow: hovered ? "none" : "0 1px 3px rgba(0,0,0,0.8)" }}>
                {cat.id === "3d" ? "3D_Projects.blend" : "Motion_Reels.prproj"}
            </span>
        </div>
    );
};
