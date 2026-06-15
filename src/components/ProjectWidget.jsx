"use client";

import React, { useState, useEffect } from "react";
import { projectsData } from "@/lib/projectsData";

export default function ProjectWidget({ onProjectClick }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Extract a few featured projects
    const featuredProjects = [
        {
            categoryId: "3d",
            subcategory: projectsData["3d"].subcategories.find(s => s.id === "character"),
            project: projectsData["3d"].subcategories.find(s => s.id === "character").projects.find(p => p.id === "char-01")
        },
        {
            categoryId: "3d",
            subcategory: projectsData["3d"].subcategories.find(s => s.id === "character"),
            project: projectsData["3d"].subcategories.find(s => s.id === "character").projects.find(p => p.id === "char-02")
        },
        {
            categoryId: "3d",
            subcategory: projectsData["3d"].subcategories.find(s => s.id === "character"),
            project: projectsData["3d"].subcategories.find(s => s.id === "character").projects.find(p => p.id === "char-03")
        }
    ].filter(item => item.project); // Ensure they exist

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
        }, 5000); // Rotate every 5 seconds
        return () => clearInterval(timer);
    }, [featuredProjects.length]);

    const getCardStyle = (index) => {
        const total = featuredProjects.length;
        const offset = (index - currentIndex + total) % total;

        let transform = "";
        let zIndex = 0;
        let opacity = 1;

        if (offset === 0) {
            transform = "translateZ(20px) rotate(0deg) scale(1.05)";
            zIndex = 40;
        } else if (offset === 1) {
            transform = "translateX(15px) translateY(8px) rotate(8deg) scale(0.95)";
            zIndex = 30;
        } else if (offset === total - 1) {
            transform = "translateX(-15px) translateY(8px) rotate(-8deg) scale(0.95)";
            zIndex = 30;
        } else {
            transform = "translateY(20px) rotate(0deg) scale(0.8)";
            zIndex = 20;
            opacity = 0;
        }

        return { transform, zIndex, opacity };
    };

    if (featuredProjects.length === 0) return null;

    return (
        <div className="relative w-[150px] h-[150px] mx-auto flex items-center justify-center my-4 perspective-[1000px] pointer-events-auto">
            {featuredProjects.map((item, i) => {
                const style = getCardStyle(i);
                
                return (
                    <div 
                        key={i}
                        onClick={() => {
                            // Only trigger click if it's the front card (offset === 0)
                            const offset = (i - currentIndex + featuredProjects.length) % featuredProjects.length;
                            if (offset === 0) {
                                onProjectClick(item.project, item.subcategory, item.categoryId);
                            } else {
                                // If clicking a back card, bring it to front
                                setCurrentIndex(i);
                            }
                        }}
                        className="absolute w-full h-full rounded-2xl p-1 shadow-xl border border-white/20 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden cursor-pointer group bg-black"
                        style={{
                            ...style,
                            transformStyle: "preserve-3d"
                        }}
                    >
                        {item.project.src && (
                            <img 
                                src={item.project.src} 
                                alt={item.project.title} 
                                className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-xl flex flex-col justify-end p-3 pointer-events-none">
                            <h4 className="text-white font-black text-[11px] tracking-wider leading-tight drop-shadow-md">{item.project.title}</h4>
                            <p className="text-emerald-400 font-bold text-[8px] uppercase tracking-widest mt-0.5">{item.project.subtitle}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
