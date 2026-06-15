"use client";

import React, { useState, useEffect } from "react";

const cards = [
    { 
        title: "Why Hire Me?", 
        content: "I bridge the gap between technical execution and visual design, creating highly immersive 3D and motion experiences.", 
        color: "bg-[#10b981]/20 backdrop-blur-xl", 
        border: "border-white/20" 
    },
    { 
        title: "My Expertise", 
        content: "Advanced in Blender, Premiere Pro, and After Effects. Specializing in 3D modeling, animation, and dynamic editing.", 
        color: "bg-[#8b5cf6]/20 backdrop-blur-xl", 
        border: "border-white/20" 
    },
    { 
        title: "Hobbies", 
        content: "When I'm not rendering scenes, I'm gaming, exploring new technologies, or experimenting with generative design.", 
        color: "bg-[#3b82f6]/20 backdrop-blur-xl", 
        border: "border-white/20" 
    },
    { 
        title: "Quote", 
        content: "\"Design is not just what it looks like and feels like. Design is how it works.\" — Steve Jobs", 
        color: "bg-[#f59e0b]/20 backdrop-blur-xl", 
        border: "border-white/20" 
    }
];

export default function CardStackWidget() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 4000); // Rotate every 4 seconds
        return () => clearInterval(timer);
    }, []);

    const getCardStyle = (index) => {
        const total = cards.length;
        const offset = (index - currentIndex + total) % total;

        // Base styles for transitions
        let transform = "";
        let zIndex = 0;
        let opacity = 1;

        if (offset === 0) {
            // Front Card
            transform = "translateZ(20px) rotate(0deg) scale(1.05)";
            zIndex = 40;
        } else if (offset === 1) {
            // Right Card
            transform = "translateX(15px) translateY(8px) rotate(8deg) scale(0.95)";
            zIndex = 30;
        } else if (offset === total - 1) {
            // Left Card
            transform = "translateX(-15px) translateY(8px) rotate(-8deg) scale(0.95)";
            zIndex = 30;
        } else {
            // Hidden back card (slides down or fades out)
            transform = "translateY(20px) rotate(0deg) scale(0.8)";
            zIndex = 20;
            opacity = 0;
        }

        return { transform, zIndex, opacity };
    };

    return (
        <div className="relative w-[150px] h-[150px] mx-auto flex items-center justify-center my-4 perspective-[1000px] pointer-events-auto">
            {cards.map((card, i) => {
                const style = getCardStyle(i);
                
                return (
                    <div 
                        key={i}
                        className={`absolute w-full h-full rounded-2xl p-4 shadow-xl border transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col justify-center ${card.color} ${card.border}`}
                        style={{
                            ...style,
                            transformStyle: "preserve-3d"
                        }}
                    >
                        <h4 className="text-white font-black text-[11px] uppercase tracking-wider mb-1 drop-shadow-md">{card.title}</h4>
                        <p className="text-white/90 text-[9px] leading-relaxed font-medium drop-shadow-sm">
                            {card.content}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
