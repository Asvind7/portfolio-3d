"use client";
import React, { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";

export default function TipsWidget() {
    const tips = [
        "Click the desktop icons or Taskbar apps to open your Projects and Resume.",
        "Open the Start Menu to view my pinned skills and proficiencies.",
        "Double-click a window's title bar to maximize it to full screen.",
        "The 3D character reacts dynamically to your mouse movements!",
        "Check out the Featured Projects widget on the left for quick 3D previews.",
        "Every icon in the Taskbar is fully active—try clicking them!"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % tips.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [tips.length]);

    return (
        <div className="w-full h-full flex items-center justify-between px-6 pointer-events-auto gap-4">
            <div className="flex items-center gap-3 shrink-0">
                <HelpCircle size={18} className="text-emerald-400 drop-shadow-md" />
                <h4 className="text-white font-bold text-[11px] uppercase tracking-wider">Did you know?</h4>
            </div>
            
            <div className="relative flex-1 h-full overflow-hidden">
                {tips.map((tip, i) => (
                    <div 
                        key={i}
                        className={`absolute inset-0 flex items-center transition-all duration-700 ease-in-out ${
                            i === currentIndex ? 'opacity-100 translate-y-0' : 
                            i < currentIndex ? 'opacity-0 -translate-y-4' : 'opacity-0 translate-y-4'
                        }`}
                    >
                        <p className="text-white/80 text-[11px] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                            {tip}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex gap-1 shrink-0">
                {tips.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/20'}`}
                    />
                ))}
            </div>
        </div>
    );
}
