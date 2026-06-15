"use client";

import React, { useState } from "react";
import { X, Minus, Square, Play, Image as ImageIcon, Video, Layers, Folder, ChevronDown, ChevronRight, Hash } from "lucide-react";

export const CategoryPage = ({ category, type, onViewCaseStudy, onClose }) => {
    const is3D = type === "blender";
    const isAe = type === "ae";
    
    // UI Theme Config
    const appName = is3D ? "Blender" : isAe ? "Adobe After Effects" : "Adobe Premiere Pro";
    const appIcon = is3D ? "/icons/blender.png" : isAe ? "/icons/after-effects.png" : "/icons/premiere-pro.png";
    const appTitle = is3D ? "3D_Projects.blend" : isAe ? "Motion_Reels.aep" : "Motion_Reels.prproj";
    const accentColor = is3D ? "text-[#ff8800]" : isAe ? "text-[#9999ff]" : "text-[#9861d8]";
    const accentBg = is3D ? "bg-[#ff8800]" : isAe ? "bg-[#9999ff]" : "bg-[#9861d8]";
    const accentBorder = is3D ? "border-[#ff8800]" : isAe ? "border-[#9999ff]" : "border-[#9861d8]";
    const highlightBg = is3D ? "bg-[#286090]" : isAe ? "bg-[#453784]" : "bg-[#59427b]";

    // State for mock UI
    const [selectedProj, setSelectedProj] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState({});

    const toggleFolder = (subId) => {
        setExpandedFolders(prev => ({ ...prev, [subId]: !prev[subId] }));
    };

    return (
        <div className="fixed inset-2 md:inset-8 lg:inset-16 z-[10000] glass-dark rounded-lg flex flex-col overflow-hidden font-sans text-sm animate-in zoom-in-95 duration-200 shadow-2xl ring-1 ring-white/10">
            {/* Title Bar */}
            <div className="h-9 bg-[#111]/80 backdrop-blur flex items-center justify-between px-3 border-b border-white/10 select-none">
                <div className="flex items-center gap-3">
                    <img src={appIcon} className="w-5 h-5 object-contain drop-shadow-sm" alt={appName} />
                    <span className="text-[#ccc] text-xs font-semibold tracking-wide">{appName} - {appTitle}</span>
                </div>
                <div className="flex items-center gap-1 text-[#aaa]">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 hover:text-white rounded transition-colors"><Minus size={14}/></button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 hover:text-white rounded transition-colors"><Square size={12}/></button>
                    <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
                        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
                        className="w-12 h-12 md:w-8 md:h-8 flex items-center justify-center hover:bg-red-500 hover:text-white text-[#aaa] hover:opacity-100 rounded transition-colors z-[100]"
                    >
                        <X size={20} className="md:w-3.5 md:h-3.5" />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden bg-black/40 backdrop-blur-2xl">
                {/* Viewport (Center) */}
                <div className="flex-1 border-r border-white/10 flex flex-col relative overflow-hidden bg-[#1e1e1e]/60">
                    {/* Viewport Header */}
                    <div className="h-8 bg-[#2d2d2d]/60 border-b border-white/10 flex items-center px-3 gap-4 text-[#aaa] text-xs">
                        <span className="font-semibold text-white">{is3D ? "Object Mode" : isAe ? "Composition" : "Program Monitor"}</span>
                        <span className="px-2 py-0.5 bg-black/20 rounded">View</span>
                        <span className="px-2 py-0.5 bg-black/20 rounded">Select</span>
                        <span className="px-2 py-0.5 bg-black/20 rounded">{is3D ? "Add" : isAe ? "Layer" : "Sequence"}</span>
                    </div>
                    
                    {/* Viewport Content (Project Grid) */}
                    <div className="flex-1 p-6 overflow-y-auto relative">
                        {/* Grid overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-10" 
                            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
                        />
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 relative z-10">
                            {category.subcategories.flatMap(sub => 
                                sub.projects.map(proj => (
                                    <div 
                                        key={proj.id} 
                                        onClick={() => onViewCaseStudy(proj, sub)}
                                        onMouseEnter={() => setSelectedProj(proj.id)}
                                        onMouseLeave={() => setSelectedProj(null)}
                                        className={`w-64 bg-[#1e1e1e]/80 border-2 rounded shadow-lg cursor-pointer transition-all duration-200 overflow-hidden backdrop-blur-md ${selectedProj === proj.id ? `${accentBorder} scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]` : "border-white/10"}`}
                                    >
                                        <div className="h-36 bg-black relative overflow-hidden">
                                            <img src={proj.src} alt={proj.title} className="w-full h-full object-cover opacity-80" />
                                            {/* Play button overlay for video/motion projects */}
                                            {!is3D && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center">
                                                        <Play size={16} fill="white" className="text-white ml-1" />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur text-xs text-white rounded font-semibold border border-white/10">
                                                {sub.name}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="text-white font-bold text-sm truncate">{proj.title}</h4>
                                            <p className="text-[#888] text-xs mt-1 truncate">{proj.subtitle}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Outliner (Right Panel) */}
                <div className="hidden md:flex w-72 bg-[#1a1a1a]/60 flex-col text-xs text-[#ccc]">
                    <div className="h-8 bg-[#2d2d2d]/60 border-b border-white/10 flex items-center px-3 font-semibold text-white">
                        {is3D ? "Outliner" : "Project Bin"}
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        <div className="flex items-center gap-1 py-1 px-1 mb-1 font-bold text-white">
                            <Hash size={14} className={accentColor} /> {is3D ? "Scene Collection" : "Master Sequence"}
                        </div>
                        <div className="pl-4 flex flex-col gap-1">
                            {category.subcategories.map(sub => (
                                <div key={sub.id}>
                                    <div 
                                        className="flex items-center gap-2 py-1 px-1 hover:bg-white/10 rounded cursor-pointer select-none"
                                        onClick={() => toggleFolder(sub.id)}
                                    >
                                        {expandedFolders[sub.id] === false ? <ChevronRight size={14}/> : <ChevronDown size={14}/>}
                                        {is3D ? (
                                            <div className="w-3 h-3 bg-gray-400 rounded-sm" />
                                        ) : (
                                            <Folder size={14} className="text-[#e2b963] fill-[#e2b963]" />
                                        )}
                                        <span className="font-semibold text-white">{sub.name}</span>
                                    </div>
                                    {expandedFolders[sub.id] !== false && (
                                        <div className="pl-6 flex flex-col gap-0.5 mt-1">
                                            {sub.projects.map(proj => (
                                                <div 
                                                    key={proj.id} 
                                                    onClick={() => onViewCaseStudy(proj, sub)}
                                                    onMouseEnter={() => setSelectedProj(proj.id)}
                                                    className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer truncate ${selectedProj === proj.id ? `${highlightBg} text-white` : "hover:bg-white/10 text-[#aaa]"}`}
                                                >
                                                    {is3D ? (
                                                        <div className={`w-2 h-2 rounded-full ${accentBg}`} />
                                                    ) : (
                                                        proj.isVertical ? <Video size={14} className="text-[#9861d8]" /> : <ImageIcon size={14} className="text-[#3b82f6]" />
                                                    )}
                                                    {proj.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Properties placeholder */}
                    <div className="h-1/3 bg-[#1e1e1e]/60 border-t border-white/10 flex flex-col">
                        <div className="h-8 bg-[#2d2d2d]/60 border-b border-white/10 flex items-center px-3 font-semibold text-white">
                            {is3D ? "Properties" : "Effect Controls"}
                        </div>
                        <div className="p-4 text-[#888] italic flex items-center justify-center h-full text-center">
                            Select an item in the {is3D ? "Outliner" : "Project Bin"} to view details.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
