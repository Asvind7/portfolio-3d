"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Wifi, Battery, Volume2, ChevronUp, FolderOpen } from "lucide-react";

const TaskbarItem = ({ icon: Icon, imgSrc, label, isActive, isOpen, onClick }) => {
    return (
        <button 
            onClick={onClick}
            title={label}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-all relative group
                ${isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/10"}
            `}
        >
            {imgSrc ? (
                <img src={imgSrc} alt={label} className="w-6 h-6 object-contain" />
            ) : (
                <Icon size={20} className={isActive ? "text-white" : "text-white/60 group-hover:text-white/90"} />
            )}
            
            {isOpen && (
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all
                    ${isActive ? "w-4 bg-accent" : "w-1 bg-[#888]"}
                `} />
            )}
            
            {/* Tooltip */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-[#333] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {label}
            </div>
        </button>
    );
};

const StartMenu = ({ isOpen, onClose, openWindow }) => {
    if (!isOpen) return null;

    const skills = [
        { name: "Blender 3D", imgSrc: "/icons/blender.png", level: "Expert", bg: "bg-white/10", appId: "blender" },
        { name: "Premiere Pro", imgSrc: "/icons/premiere-pro.png", level: "Advanced", bg: "bg-white/10", appId: "premiere" },
        { name: "After Effects", imgSrc: "/icons/after-effects.png", level: "Advanced", bg: "bg-white/10", appId: "ae" },
        { name: "Photoshop", imgSrc: "/icons/photoshop.png", level: "Intermediate", bg: "bg-white/10", appId: null },
        { name: "Illustrator", imgSrc: "/icons/illustrator.png", level: "Intermediate", bg: "bg-white/10", appId: null }
    ];

    return (
        <div className="absolute bottom-16 md:bottom-14 left-1/2 -translate-x-1/2 w-[95vw] md:w-[600px] h-[75vh] md:h-[650px] glass-dark backdrop-blur-3xl rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-200 z-[10000]">
            {/* Search Bar */}
            <div className="p-6 pb-2">
                <div className="bg-black/20 border border-white/10 rounded-full h-10 px-4 flex items-center gap-3 text-white/50">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                    <input type="text" placeholder="Search for apps, settings, and documents" className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-white/40" />
                </div>
            </div>

            {/* Pinned Skills */}
            <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-sm">Pinned Skills</h3>
                    <button className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-colors">All apps &gt;</button>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-y-6 gap-x-2">
                    {skills.map((skill, i) => (
                        <div 
                            key={i} 
                            onClick={() => {
                                if (skill.appId) {
                                    openWindow(skill.appId);
                                    onClose();
                                }
                            }}
                            className="flex flex-col items-center justify-center gap-2 hover:bg-white/10 p-2 rounded-md cursor-pointer transition-colors group"
                        >
                            <div className="w-12 h-12 bg-[#222] rounded-xl flex items-center justify-center shadow-md border border-[#333] group-hover:border-[#555] transition-colors">
                                {skill.imgSrc ? (
                                    <img src={skill.imgSrc} className="w-8 h-8 object-contain" alt={skill.name} />
                                ) : (
                                    <span className="text-2xl">{skill.icon}</span>
                                )}
                            </div>
                            <span className="text-xs text-[#ccc] group-hover:text-white transition-colors">{skill.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommended */}
            <div className="p-6 pt-0 flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-sm">Recommended</h3>
                    <button className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-colors">More &gt;</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-md cursor-pointer transition-colors">
                        <img src="/pfp.jpeg" className="w-10 h-10 rounded bg-[#222] object-cover" />
                        <div className="flex flex-col">
                            <span className="text-sm text-white">Resume.pdf</span>
                            <span className="text-xs text-[#777]">17m ago</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-md cursor-pointer transition-colors">
                        <div className="w-10 h-10 rounded bg-[#222] flex items-center justify-center text-[#10b981] border border-[#10b981]/30">
                            <Mail size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-white">Contact Info</span>
                            <span className="text-xs text-[#777]">Yesterday</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Footer */}
            <div className="h-16 bg-[#111] border-t border-[#333] flex items-center justify-between px-6">
                <div className="flex items-center gap-3 hover:bg-white/10 p-1.5 pr-4 rounded-md cursor-pointer transition-colors">
                    <img src="/pfp.jpeg" className="w-8 h-8 rounded-full bg-[#333] object-cover" />
                    <span className="text-sm text-white font-medium">Asvind V.A</span>
                </div>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-md text-[#aaa] hover:text-white transition-colors" title="Power">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                </button>
            </div>
        </div>
    );
};

const Taskbar = ({ openWindows, activeWindow, toggleWindow, openWindow }) => {
    const [time, setTime] = useState(new Date());
    const [startMenuOpen, setStartMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Close start menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (startMenuOpen && !e.target.closest(".taskbar-container") && !e.target.closest(".start-menu-container")) {
                setStartMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [startMenuOpen]);

    return (
        <>
            {/* Start Menu Popup */}
            <div className="start-menu-container">
                <StartMenu isOpen={startMenuOpen} onClose={() => setStartMenuOpen(false)} openWindow={openWindow} />
            </div>

            {/* Windows 11 Taskbar - Dark Glass */}
            <div className="absolute bottom-0 left-0 right-0 h-12 glass-dark flex items-center justify-between px-2 z-[9999] select-none taskbar-container">
                {/* Widgets area */}
                <div className="flex-1 flex items-center px-2">
                    <div className="text-xs text-white/70 hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-violet-400" stroke="currentColor" strokeWidth="2"><path d="M17.5 19c-1.5 0-2.5-2-2.5-4a5 5 0 1 0-10 0c0 2-1 4-2.5 4h15z"/></svg>
                        24°C Clear
                    </div>
                </div>

                {/* App Icons (Center) */}
                <div className="flex-1 flex justify-center items-center gap-1">
                    {/* Start Button */}
                    <button 
                        onClick={() => setStartMenuOpen(!startMenuOpen)}
                        className={`w-10 h-10 flex items-center justify-center rounded-md transition-all group ${startMenuOpen ? "bg-white/20 shadow-inner" : "hover:bg-white/10"}`}
                        title="Start"
                    >
                        {/* Windows 11 Logo approximation */}
                        <div className="grid grid-cols-2 gap-[2px] w-5 h-5 group-hover:scale-105 transition-transform">
                            <div className="bg-[#00a4ef] rounded-[1px]"></div>
                            <div className="bg-[#00a4ef] rounded-[1px]"></div>
                            <div className="bg-[#00a4ef] rounded-[1px]"></div>
                            <div className="bg-[#00a4ef] rounded-[1px]"></div>
                        </div>
                    </button>

                    <TaskbarItem 
                        icon={FolderOpen} 
                        label="Projects" 
                        isOpen={openWindows.includes("projects")}
                        isActive={activeWindow === "projects"}
                        onClick={() => { toggleWindow("projects"); setStartMenuOpen(false); }}
                    />
                    <TaskbarItem 
                        icon={User} 
                        label="Resume" 
                        isOpen={openWindows.includes("about")}
                        isActive={activeWindow === "about"}
                        onClick={() => { toggleWindow("about"); setStartMenuOpen(false); }}
                    />
                    <TaskbarItem 
                        imgSrc="/icons/blender.png" 
                        label="Blender 3D" 
                        isOpen={openWindows.includes("blender")}
                        isActive={activeWindow === "blender"}
                        onClick={() => { toggleWindow("blender"); setStartMenuOpen(false); }}
                    />
                    <TaskbarItem 
                        imgSrc="/icons/premiere-pro.png" 
                        label="Premiere Pro" 
                        isOpen={openWindows.includes("premiere")}
                        isActive={activeWindow === "premiere"}
                        onClick={() => { toggleWindow("premiere"); setStartMenuOpen(false); }}
                    />
                    <TaskbarItem 
                        icon={Mail} 
                        label="Contact" 
                        isOpen={openWindows.includes("contact")}
                        isActive={activeWindow === "contact"}
                        onClick={() => { toggleWindow("contact"); setStartMenuOpen(false); }}
                    />
                    <TaskbarItem 
                        imgSrc="/icons/after-effects.png" 
                        label="After Effects" 
                        isOpen={openWindows.includes("ae")}
                        isActive={activeWindow === "ae"}
                        onClick={() => { toggleWindow("ae"); setStartMenuOpen(false); }}
                    />
                </div>

                {/* System Tray (Right) */}
                <div className="flex-1 flex justify-end items-center gap-1 h-full py-1">
                    <button className="h-full px-2 hover:bg-white/10 rounded flex items-center justify-center text-white/70 transition-colors">
                        <ChevronUp size={16} />
                    </button>
                    <div className="h-full px-2 hover:bg-white/10 rounded flex items-center gap-3 text-white/90 transition-colors cursor-pointer">
                        <Wifi size={16} />
                        <Volume2 size={16} />
                        <Battery size={16} />
                    </div>
                    <div className="h-full px-2 hover:bg-white/10 rounded flex flex-col items-end justify-center text-white text-[10px] transition-colors cursor-pointer text-right leading-tight">
                        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>{time.toLocaleDateString()}</span>
                    </div>
                    <div className="w-1 h-full border-l border-white/20 ml-1" />
                </div>
            </div>
        </>
    );
};

export default Taskbar;
