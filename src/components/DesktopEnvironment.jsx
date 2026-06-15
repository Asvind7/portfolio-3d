"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Taskbar from "./Taskbar";
import { User, Mail, FolderOpen, HelpCircle } from "lucide-react";
import { CaseStudy } from "./Projects/CaseStudy";
import Projects from "./Projects";
import CardStackWidget from "./CardStackWidget";
import ProjectWidget from "./ProjectWidget";
import TipsWidget from "./TipsWidget";
import { motion } from "framer-motion";

// Dynamically import the 3D scene so it only loads on the client
const CharacterScene = dynamic(() => import("./HomeCharacter"), { ssr: false });

// Desktop Icon Component
const DesktopIcon = ({ icon: Icon, imgSrc, label, onClick }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div 
            className="flex flex-col items-center justify-center p-2 rounded cursor-pointer transition-all w-24 h-24 group select-none"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onDoubleClick={onClick}
            onClick={onClick}
        >
            <div className={`p-2 rounded-xl transition-all ${hovered ? "bg-white/10 border border-white/20 shadow-lg group-hover:-rotate-3" : "bg-transparent border border-transparent"}`}>
                {imgSrc ? (
                    <img src={imgSrc} alt={label} className="w-12 h-12 object-contain drop-shadow-md" />
                ) : (
                    <Icon size={48} className="text-violet-400 drop-shadow-md" />
                )}
            </div>
            <span className={`mt-1 text-xs text-center px-2 py-0.5 rounded ${hovered ? "bg-violet-600 text-white font-bold" : "text-white/90 drop-shadow-md"}`} style={{ textShadow: hovered ? "none" : "0 1px 3px rgba(0,0,0,0.8)" }}>
                {label}
            </span>
        </div>
    );
};

const DesktopEnvironment = () => {
    // Window manager state
    const [openWindows, setOpenWindows] = useState([]);
    const [activeWindow, setActiveWindow] = useState(null);
    const [activeCaseStudy, setActiveCaseStudy] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [activeMobilePage, setActiveMobilePage] = useState(1);
    const mobileScrollRef = useRef(null);

    useEffect(() => {
        // Set initial mobile state and add resize listener
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Automatically scroll to the middle (Home) screen on mobile load
        if (mobileScrollRef.current && window.innerWidth < 768) {
            mobileScrollRef.current.scrollLeft = window.innerWidth;
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMobileScroll = (e) => {
        if (!e.target) return;
        const scrollLeft = e.target.scrollLeft;
        const width = e.target.clientWidth;
        if (width > 0) {
            const pageIndex = Math.round(scrollLeft / width);
            if (pageIndex !== activeMobilePage && pageIndex >= 0 && pageIndex <= 2) {
                setActiveMobilePage(pageIndex);
            }
        }
    };

    const handleCaseStudyNav = (direction) => {
        if (!activeCaseStudy) return;
        
        const cat = projectsData[activeCaseStudy.categoryId];
        if (!cat) return;

        const allProjects = [];
        cat.subcategories.forEach(sub => {
            sub.projects.forEach(proj => {
                allProjects.push({ project: proj, subcategory: sub });
            });
        });

        const currentIndex = allProjects.findIndex(p => p.project.id === activeCaseStudy.project.id);
        if (currentIndex === -1) return;

        let nextIndex = currentIndex + direction;
        if (nextIndex >= allProjects.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = allProjects.length - 1;

        const nextItem = allProjects[nextIndex];
        setActiveCaseStudy({
            project: nextItem.project,
            categoryLabel: activeCaseStudy.categoryLabel,
            categoryId: activeCaseStudy.categoryId,
            subcategoryName: nextItem.subcategory.name
        });
    };

    const openWindow = (appId) => {
        if (!openWindows.includes(appId)) {
            setOpenWindows([...openWindows, appId]);
        }
        setActiveWindow(appId);
    };

    const closeWindow = (appId) => {
        setOpenWindows(prev => prev.filter(id => id !== appId));
        setActiveWindow(prev => prev === appId ? null : prev);
    };

    const toggleWindow = (appId) => {
        if (!openWindows.includes(appId)) {
            openWindow(appId);
        } else if (activeWindow === appId) {
            setActiveWindow(null);
        } else {
            setActiveWindow(appId);
        }
    };

    return (
        <div className="w-full h-full flex flex-col relative z-10 overflow-hidden">
            
            {/* Shared Background: Static Image Wallpaper with Blur and Opacity */}
            <div className="absolute inset-0 -z-10 bg-[#05050a]">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 blur-md scale-105"
                    style={{ backgroundImage: 'url("/wallpaper.jpg")' }}
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Shared Background: "About Me" Text & Character */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end overflow-hidden pb-12">
                <div className="absolute flex flex-col items-center text-center opacity-80 select-none z-0 bottom-32 md:bottom-24">
                    <h1 className="text-7xl md:text-[12rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white/60 to-transparent uppercase tracking-tighter drop-shadow-2xl">
                        ASVIND<br/>V.A
                    </h1>
                    <h2 className="text-xs md:text-2xl text-emerald-400 font-semibold tracking-[0.2em] md:tracking-[0.3em] uppercase mt-4 drop-shadow-lg px-4 text-center">3D Artist & Motion Designer</h2>
                </div>
                
                {!isMobile && (
                    <div className="relative w-[650px] h-[650px] pointer-events-auto z-10 drop-shadow-[0_0_80px_rgba(139,92,246,0.3)]">
                        <CharacterScene />
                    </div>
                )}
            </div>

            {/* ================= DESKTOP VIEW (md:flex) ================= */}
            <div className="hidden md:flex flex-1 relative p-4 flex-col gap-4 content-start flex-wrap z-20">
                {/* Desktop Icons */}
                <DesktopIcon icon={User} label="Resume.pdf" onClick={() => openWindow("about")} />
                <DesktopIcon imgSrc="/icons/blender.png" label="Blender 3D" onClick={() => openWindow("blender")} />
                <DesktopIcon imgSrc="/icons/premiere-pro.png" label="Premiere Pro" onClick={() => openWindow("premiere")} />
                <DesktopIcon imgSrc="/icons/after-effects.png" label="After Effects" onClick={() => openWindow("ae")} />
                <DesktopIcon icon={Mail} label="Contact_Form.exe" onClick={() => openWindow("contact")} />

                {/* Left Side Widgets */}
                <div className="absolute top-8 left-28 z-[100] flex flex-col gap-5 pointer-events-none">
                    <div className="pointer-events-auto w-52 glass-dark rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 border border-white/10 transition-all duration-300 hover:scale-105 rotate-0 hover:-rotate-2 group">
                        <h3 className="text-white font-bold text-[10px] mb-2 text-center opacity-70 group-hover:opacity-100 transition-opacity">Highlights</h3>
                        <CardStackWidget />
                    </div>

                    <div className="pointer-events-auto w-52 glass-dark rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 border border-white/10 transition-all duration-300 hover:scale-105 rotate-0 hover:rotate-2 group">
                        <h3 className="text-white font-bold text-[10px] mb-2 text-center opacity-70 group-hover:opacity-100 transition-opacity">Featured Projects</h3>
                        <ProjectWidget 
                            onProjectClick={(proj, sub, catId) => {
                                setActiveCaseStudy({
                                    project: proj,
                                    categoryLabel: projectsData[catId]?.label || "Project",
                                    categoryId: catId,
                                    subcategoryName: sub.name
                                });
                            }} 
                        />
                    </div>
                </div>

                {/* Top Center Tips Widget */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
                    <div className="pointer-events-auto w-[650px] h-14 glass-dark rounded-full shadow-xl hover:shadow-2xl hover:border-emerald-500/30 border border-white/10 transition-all duration-300 hover:scale-[1.02] rotate-0 hover:-rotate-1 group">
                        <TipsWidget />
                    </div>
                </div>

                {/* Desktop Widgets (Right Side) */}
                <div className="absolute top-8 right-8 flex flex-col gap-5 pointer-events-none z-[100]">
                    <div className="pointer-events-auto w-52 glass-dark rounded-2xl p-5 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 border border-white/10 transition-all duration-300 hover:scale-105 rotate-0 hover:rotate-2 group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0">
                                <img src="/pfp.jpeg" alt="Profile" className="w-full h-full object-cover scale-110" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm leading-tight">Asvind V.A</h3>
                                <p className="text-emerald-400 text-[10px] uppercase tracking-wider font-semibold">Motion Designer</p>
                            </div>
                        </div>
                        <p className="text-white/80 text-[11px] leading-relaxed mb-3">
                            Specializing in 3D product animation, motion graphics, and immersive web experiences.
                        </p>
                        <div className="flex gap-2 text-xs">
                            <button onClick={() => toggleWindow("about")} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-1.5 rounded-lg transition-colors font-medium">Resume</button>
                            <button onClick={() => toggleWindow("contact")} className="flex-1 bg-emerald-500/80 hover:bg-emerald-500 text-white py-1.5 rounded-lg transition-colors font-medium">Contact</button>
                        </div>
                    </div>

                    <div className="pointer-events-auto w-52 glass-dark rounded-2xl p-5 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 border border-white/10 transition-all duration-300 hover:scale-105 rotate-0 hover:-rotate-1 group">
                        <h3 className="text-white font-bold text-xs mb-3 flex items-center justify-between opacity-80 group-hover:opacity-100">
                            <span>Top Skills</span>
                            <span className="text-[10px] text-white/50 font-normal">View All ↗</span>
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] text-white/80 bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="flex items-center gap-2 font-medium">
                                    <img src="/icons/blender.png" className="w-3 h-3 object-contain" alt="Blender" />
                                    Blender 3D
                                </span>
                                <span className="font-bold text-emerald-400">15+ Projects</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-white/80 bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="flex items-center gap-2 font-medium">
                                    <img src="/icons/after-effects.png" className="w-3 h-3 object-contain" alt="After Effects" />
                                    After Effects
                                </span>
                                <span className="font-bold text-emerald-400">5+ Motion Graphics</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-white/80 bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="flex items-center gap-2 font-medium">
                                    <img src="/icons/premiere-pro.png" className="w-3 h-3 object-contain" alt="Premiere Pro" />
                                    Premiere Pro
                                </span>
                                <span className="font-bold text-emerald-400">20+ Videos Edited</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-white/80 bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="flex items-center gap-2 font-medium">
                                    <span className="w-3 text-center">🤝</span>
                                    Freelance
                                </span>
                                <span className="font-bold text-emerald-400">3+ Real Clients</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= MOBILE VIEW (md:hidden) ================= */}
            <div ref={mobileScrollRef} className="md:hidden flex-1 flex overflow-x-auto snap-x snap-mandatory overflow-y-hidden hide-scrollbar z-20 pb-16 scroll-smooth">
                
                {/* Screen 1 (Left Swipe): Projects */}
                <div className="w-screen h-full shrink-0 snap-center flex flex-col items-center justify-center gap-6 p-6 pt-12">
                    <div className="pointer-events-auto w-full max-w-[300px] glass-dark rounded-2xl p-4 shadow-xl border border-white/10">
                        <h3 className="text-white font-bold text-[10px] mb-2 text-center opacity-80">Highlights</h3>
                        <CardStackWidget />
                    </div>

                    <div className="pointer-events-auto w-full max-w-[300px] glass-dark rounded-2xl p-4 shadow-xl border border-white/10">
                        <h3 className="text-white font-bold text-[10px] mb-2 text-center opacity-80">Featured Projects</h3>
                        <ProjectWidget 
                            onProjectClick={(proj, sub, catId) => {
                                setActiveCaseStudy({
                                    project: proj,
                                    categoryLabel: projectsData[catId]?.label || "Project",
                                    categoryId: catId,
                                    subcategoryName: sub.name
                                });
                            }} 
                        />
                    </div>
                </div>

                {/* Screen 2 (Center Swipe): Home Apps */}
                <div className="w-screen h-full shrink-0 snap-center relative p-4 pt-10 flex flex-col items-center">
                    <div className="pointer-events-auto w-[90%] max-w-[350px] h-12 glass-dark rounded-full shadow-xl border border-white/10 flex items-center justify-center overflow-hidden mb-4">
                        <TipsWidget />
                    </div>

                    {isMobile && (
                        <div className="pointer-events-auto w-[90%] max-w-[350px] h-[250px] glass-dark rounded-3xl shadow-xl border border-white/10 flex items-center justify-center overflow-hidden relative mb-6">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10 pointer-events-none" />
                            <div className="w-[300px] h-[300px] mt-10">
                                <CharacterScene />
                            </div>
                            <div className="absolute bottom-4 left-5 z-20 pointer-events-none">
                                <h2 className="text-white font-black text-xl drop-shadow-md">ASVIND V.A</h2>
                                <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] drop-shadow-md">3D Artist & Motion</p>
                            </div>
                        </div>
                    )}

                    <div className="w-[90%] max-w-[350px] grid grid-cols-4 gap-y-6 justify-items-center z-30">
                        <DesktopIcon icon={FolderOpen} label="Projects" onClick={() => openWindow("projects")} />
                        <DesktopIcon icon={User} label="Resume" onClick={() => openWindow("about")} />
                        <DesktopIcon imgSrc="/icons/blender.png" label="Blender" onClick={() => openWindow("blender")} />
                        <DesktopIcon imgSrc="/icons/premiere-pro.png" label="Premiere" onClick={() => openWindow("premiere")} />
                        <DesktopIcon imgSrc="/icons/after-effects.png" label="After FX" onClick={() => openWindow("ae")} />
                        <DesktopIcon icon={Mail} label="Contact" onClick={() => openWindow("contact")} />
                    </div>
                </div>

                {/* Screen 3 (Right Swipe): Info & Skills */}
                <div className="w-screen h-full shrink-0 snap-center flex flex-col items-center justify-center gap-6 p-6 pt-12">
                    <div className="pointer-events-auto w-full max-w-[300px] glass-dark rounded-2xl p-5 shadow-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0">
                                <img src="/pfp.jpeg" alt="Profile" className="w-full h-full object-cover scale-110" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm leading-tight">Asvind V.A</h3>
                                <p className="text-emerald-400 text-[10px] uppercase tracking-wider font-semibold">Motion Designer</p>
                            </div>
                        </div>
                        <p className="text-white/80 text-[11px] leading-relaxed mb-3">
                            Specializing in 3D product animation, motion graphics, and immersive web experiences.
                        </p>
                        <div className="flex gap-2 text-xs">
                            <button onClick={() => toggleWindow("about")} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-1.5 rounded-lg font-medium">Resume</button>
                            <button onClick={() => toggleWindow("contact")} className="flex-1 bg-emerald-500/80 hover:bg-emerald-500 text-white py-1.5 rounded-lg font-medium">Contact</button>
                        </div>
                    </div>

                    <div className="pointer-events-auto w-full max-w-[300px] glass-dark rounded-2xl p-5 shadow-xl border border-white/10">
                        <h3 className="text-white font-bold text-xs mb-3 flex items-center justify-between opacity-80">
                            <span>Top Skills</span>
                            <span className="text-[10px] text-white/50 font-normal">View All ↗</span>
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] text-white/80 bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="flex items-center gap-2 font-medium">
                                    <img src="/icons/blender.png" className="w-3 h-3 object-contain" /> Blender 3D
                                </span>
                                <span className="font-bold text-emerald-400">15+ Projects</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-white/80 bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="flex items-center gap-2 font-medium">
                                    <img src="/icons/after-effects.png" className="w-3 h-3 object-contain" /> After Effects
                                </span>
                                <span className="font-bold text-emerald-400">5+ Motion</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-white/80 bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="flex items-center gap-2 font-medium">
                                    <img src="/icons/premiere-pro.png" className="w-3 h-3 object-contain" /> Premiere
                                </span>
                                <span className="font-bold text-emerald-400">20+ Videos</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-white/80 bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="flex items-center gap-2 font-medium">
                                    <span className="w-3 text-center">🤝</span> Freelance
                                </span>
                                <span className="font-bold text-emerald-400">3+ Clients</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Pagination Dots */}
            <div className="md:hidden absolute bottom-[80px] left-1/2 -translate-x-1/2 flex gap-3 z-[100] pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-white/20 shadow-md"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-md shadow-emerald-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-white/20 shadow-md"></div>
            </div>

            {/* Render Open Windows */}
            {openWindows.includes("projects") && (
                <WindowFrame 
                    id="projects" 
                    title="Projects Explorer" 
                    icon={FolderOpen}
                    isActive={activeWindow === "projects"} 
                    onClose={() => closeWindow("projects")} 
                    onFocus={() => focusWindow("projects")}
                >
                    <Projects />
                </WindowFrame>
            )}

            {openWindows.includes("about") && (
                <WindowFrame 
                    title="Resume.pdf" 
                    icon={User} 
                    isActive={activeWindow === "about"}
                    onFocus={() => setActiveWindow("about")}
                    onClose={() => closeWindow("about")}
                >
                    <AboutContent />
                </WindowFrame>
            )}

            {openWindows.includes("contact") && (
                <WindowFrame 
                    title="Contact_Form.exe" 
                    icon={Mail} 
                    isActive={activeWindow === "contact"}
                    onFocus={() => setActiveWindow("contact")}
                    onClose={() => closeWindow("contact")}
                >
                    <ContactContent />
                </WindowFrame>
            )}

            {/* Actual Blender/Premiere/AE windows */}
            {openWindows.includes("blender") && (
                <div onClick={() => setActiveWindow("blender")} className={activeWindow === "blender" ? "z-[1010]" : "z-[1000]"}>
                    <CategoryPage 
                        category={projectsData["3d"]} 
                        type="blender"
                        onViewCaseStudy={(proj, sub) => setActiveCaseStudy({ project: proj, categoryLabel: "3D Art", categoryId: "3d", subcategoryName: sub.name })}
                        onClose={() => closeWindow("blender")} 
                    />
                </div>
            )}

            {openWindows.includes("premiere") && (
                <div onClick={() => setActiveWindow("premiere")} className={activeWindow === "premiere" ? "z-[1010]" : "z-[1000]"}>
                    <CategoryPage 
                        category={projectsData["motion"]} 
                        type="premiere"
                        onViewCaseStudy={(proj, sub) => setActiveCaseStudy({ project: proj, categoryLabel: "Motion Graphics", categoryId: "motion", subcategoryName: sub.name })}
                        onClose={() => closeWindow("premiere")} 
                    />
                </div>
            )}

            {openWindows.includes("ae") && (
                <div onClick={() => setActiveWindow("ae")} className={activeWindow === "ae" ? "z-[1010]" : "z-[1000]"}>
                    <CategoryPage 
                        category={projectsData["motion"]} 
                        type="ae"
                        onViewCaseStudy={(proj, sub) => setActiveCaseStudy({ project: proj, categoryLabel: "Motion Graphics", categoryId: "motion", subcategoryName: sub.name })}
                        onClose={() => closeWindow("ae")} 
                    />
                </div>
            )}

            {/* Case Study Fullscreen Overlay */}
            {activeCaseStudy && (
                <div className="absolute inset-0 z-[20000]">
                    <CaseStudy 
                        project={activeCaseStudy.project} 
                        categoryLabel={activeCaseStudy.categoryLabel}
                        subcategoryName={activeCaseStudy.subcategoryName}
                        onBack={() => setActiveCaseStudy(null)}
                        onBackToHome={() => setActiveCaseStudy(null)}
                        onNext={() => handleCaseStudyNav(1)}
                        onPrev={() => handleCaseStudyNav(-1)}
                    />
                </div>
            )}

            {/* Taskbar */}
            <Taskbar 
                openWindows={openWindows} 
                activeWindow={activeWindow} 
                toggleWindow={toggleWindow} 
                openWindow={openWindow}
            />
        </div>
    );
};

export default DesktopEnvironment;

// Basic Window Frame Component
import { X, Minus, Square } from "lucide-react";

const WindowFrame = ({ title, icon: Icon, imgSrc, isActive, onFocus, onClose, children, isFull }) => {
    return (
        <div 
            onClick={onFocus}
            className={`absolute flex flex-col rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-200 glass-dark
                ${isActive ? "z-[1010] ring-1 ring-violet-500/50 drop-shadow-[0_0_30px_rgba(139,92,246,0.2)]" : "z-[1000]"}
                ${isFull ? "inset-4 md:inset-10" : "inset-x-2 top-4 bottom-24 md:inset-auto md:top-20 md:left-20 md:w-[800px] md:h-[600px] md:max-w-[90vw] md:max-h-[80vh]"}
            `}
        >
            {/* Title Bar */}
            <div className="h-9 bg-[#111] flex items-center justify-between px-3 border-b border-[#333] select-none cursor-move">
                <div className="flex items-center gap-3">
                    {imgSrc ? (
                        <img src={imgSrc} className="w-4 h-4 object-contain" />
                    ) : Icon ? (
                        <Icon size={16} className="text-accent" />
                    ) : null}
                    <span className="text-[#ccc] text-xs font-semibold tracking-wide">{title}</span>
                </div>
                <div className="flex items-center gap-1 text-[#aaa]">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-[#333] hover:text-white rounded transition-colors"><Minus size={14}/></button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-[#333] hover:text-white rounded transition-colors"><Square size={12}/></button>
                    <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
                        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
                        className="w-12 h-12 md:w-8 md:h-8 flex items-center justify-center hover:bg-red-500 hover:text-white text-[#aaa] hover:opacity-100 rounded transition-colors z-[100]"
                    >
                        <X size={20} className="md:w-3.5 md:h-3.5" />
                    </button>
                </div>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-card-bg backdrop-blur-xl relative">
                {children}
            </div>
        </div>
    );
};

// Extracted Content Components for About/Contact
import About from "./About";
import Contact from "./Contact";
import { CategoryPage } from "./Projects/CategoryPage";
import { projectsData } from "@/lib/projectsData";

const AboutContent = () => (
    <div className="w-full h-full flex flex-col bg-[#e5e5e5]">
        {/* Mock PDF Viewer Toolbar */}
        <div className="h-10 bg-[#f3f4f6] border-b border-[#d1d5db] flex items-center justify-between px-4 select-none shrink-0">
            <div className="flex items-center gap-4 text-gray-600 text-sm">
                <span className="font-semibold text-gray-800">Resume.pdf</span>
                <span className="text-gray-400">|</span>
                <span>1 / 1</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
                <button className="hover:bg-gray-200 p-1.5 rounded transition-colors" title="Zoom Out">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span className="text-sm font-medium">100%</span>
                <button className="hover:bg-gray-200 p-1.5 rounded transition-colors" title="Zoom In">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span className="text-gray-400 mx-1">|</span>
                <a href="/Asvind_VA_CV.pdf" download className="hover:bg-gray-200 p-1.5 rounded transition-colors flex items-center gap-1" title="Download">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </a>
            </div>
        </div>
        
        {/* PDF Document Container */}
        <div className="flex-1 overflow-auto flex justify-center py-8">
            <iframe 
                src="/Asvind_VA_CV.pdf#toolbar=0&navpanes=0&scrollbar=0" 
                className="w-full max-w-[800px] h-[1050px] bg-white shadow-2xl border border-gray-300"
                title="Resume"
            />
        </div>
    </div>
);

const ContactContent = () => (
    <div className="p-0">
        <Contact />
    </div>
);
