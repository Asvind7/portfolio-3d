"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Move, RotateCw, Scale, MousePointer2, Box, Image as ImageIcon, Video, Layers, Settings, Play, Pause, SkipBack, SkipForward, Maximize2, X, ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft, ChevronDown, MonitorPlay, ArrowLeft, Home } from "lucide-react";


const CharacterScene = dynamic(() => import("@/components/CharacterScene"), { ssr: false });

const CaseStudyNavbar = ({ onBack, onHome }) => (
    <nav
        className="fixed bottom-0 left-0 right-0 w-full z-[10015] flex items-center justify-around px-2 border-t backdrop-blur-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.8)] transition-all duration-300"
        style={{
            height: "calc(62px + env(safe-area-inset-bottom, 0px))",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
            backgroundColor: "rgba(3, 7, 18, 0.97)",
            borderColor: "rgba(255, 255, 255, 0.1)",
        }}
    >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10b981]/40 to-transparent" />

        <button
            onClick={onHome}
            className="flex flex-col items-center justify-center gap-1 min-w-[64px] text-white/40 hover:text-[#10b981] active:text-[#10b981] transition-all group py-1"
            title="Return to Landing Page"
        >
            <div className="p-1.5 rounded-xl bg-white/5 group-hover:bg-[#10b981]/10 border border-white/5 group-hover:border-[#10b981]/20 flex items-center justify-center transition-all">
                <Home size={18} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.08em]">Home</span>
        </button>

        <button
            onClick={onBack}
            className="flex flex-col items-center justify-center gap-1 transition-all group active:scale-95 py-1"
            title="Exit Case Study View"
        >
            <div className="p-3 rounded-2xl bg-[#10b981]/20 shadow-[0_6px_24px_rgba(16,185,129,0.35)] border border-[#10b981]/40 flex items-center justify-center hover:bg-[#10b981]/30 transition-all">
                <X size={20} className="text-[#10b981] stroke-[3]" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#10b981] opacity-90">Close</span>
        </button>

        <Link
            href="#projects"
            onClick={onBack}
            className="flex flex-col items-center justify-center gap-1 min-w-[64px] text-white/40 hover:text-[#10b981] active:text-[#10b981] transition-all group py-1"
            title="Back to Project Gallery"
        >
            <div className="p-1.5 rounded-xl bg-white/5 group-hover:bg-[#10b981]/10 border border-white/5 group-hover:border-[#10b981]/20 flex items-center justify-center transition-all">
                <Box size={18} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.08em]">Gallery</span>
        </Link>
    </nav>
);

export const CaseStudy = ({ project, categoryLabel, subcategoryName, onBack, onBackToHome, onNext, onPrev, navState }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        requestAnimationFrame(() => setMounted(true));
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    const projectType =
        project.id?.startsWith("char") ? "character" :
            (project.id?.startsWith("anim") || project.id?.startsWith("prod")) ? "animation" :
                (project.id?.startsWith("reel") || project.id?.startsWith("soc") || project.id?.startsWith("title")) ? "motion" :
                    "generic";

    const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

    useEffect(() => {
        const handleFSChange = () => {
            setIsNativeFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFSChange);
        return () => document.removeEventListener("fullscreenchange", handleFSChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="fixed inset-0 h-[100dvh] z-[10002] flex items-center justify-center bg-black font-sans text-[#cccccc] overflow-hidden"
            style={{
                opacity: mounted ? 1 : 0,
                transition: "opacity 0.4s ease"
            }}>

            <div className="w-full h-full flex flex-col overflow-hidden relative">
                {projectType === "character" ? (
                    <BlenderUI
                        project={project}
                        subcategoryName={subcategoryName}
                        customOnBack={onBack}
                        onBackToHome={onBackToHome}
                        onNext={onNext}
                        onPrev={onPrev}
                        navState={navState}
                        toggleFullscreen={toggleFullscreen}
                        isFullscreen={isNativeFullscreen}
                    />
                ) : (
                    <VideoEditorUI
                        project={project}
                        subcategoryName={subcategoryName}
                        customOnBack={onBack}
                        onBackToHome={onBackToHome}
                        onNext={onNext}
                        onPrev={onPrev}
                        navState={navState}
                        toggleFullscreen={toggleFullscreen}
                        isFullscreen={isNativeFullscreen}
                    />
                )}

                {/* Hide navbar on desktop OR in native fullscreen */}
                {!isNativeFullscreen && (
                    <div className="lg:hidden">
                        <CaseStudyNavbar
                            onBack={onBack}
                            onHome={onBackToHome}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const BlenderUI = ({ project, customOnBack, onBackToHome, onNext, onPrev, subcategoryName, navState, toggleFullscreen, isFullscreen }) => {
    const [mode, setMode] = useState("material");
    const [outlinerExpanded, setOutlinerExpanded] = useState(true);

    return (
        <div className="w-full h-full flex flex-col overflow-hidden relative bg-[#1a1a1a]">
            {/* Top Menu Bar */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#282828] border-b border-[#111111] text-xs shrink-0">
                <div className="flex items-center gap-1">
                    <div className="w-5 h-5 flex items-center justify-center bg-[#10b981] rounded-sm mr-2 shadow-sm">
                        <Box size={12} className="text-white" />
                    </div>
                    {["File", "Edit", "Render", "Window", "Help"].map(item => (
                        <button key={item} className="px-2 py-1 hover:bg-[#3e3e3e] hover:text-[#10b981] rounded transition-colors hidden sm:block">{item}</button>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                    {["Layout", "Modeling", "UV Editing", "Shading", "Animation"].map(item => (
                        <button key={item} className={`px-3 py-1 rounded transition-colors ${item === "Layout" ? "bg-[#3e3e3e] text-white" : "hover:text-white hover:bg-[#3e3e3e]/50 text-[#888888]"}`}>
                            {item}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-[#888888] hidden xs:block">v4.0.0</span>
                    <div className="flex items-center gap-2 border-l border-[#444] pl-4">
                        <button onClick={onBackToHome} className="text-[#888] hover:text-[#10b981] hover:bg-[#3e3e3e] p-1.5 rounded transition-colors" title="Back to Home"><Home size={16} /></button>
                        <button onClick={customOnBack} className="text-white hover:bg-[#3e3e3e] px-3 py-1 rounded flex items-center gap-2 font-medium bg-[#333] transition-colors"><ArrowLeft size={14} /> Back</button>
                    </div>
                </div>
            </div>

            <div className={`flex-1 flex overflow-hidden min-h-0 ${!isFullscreen ? 'pb-[calc(62px+env(safe-area-inset-bottom,0px))] lg:pb-0' : ''}`}>
                {/* Left Toolbar */}
                <div className="w-12 bg-[#282828] border-r border-[#111111] flex flex-col items-center py-2 gap-2 shrink-0">
                    <button className="p-2 bg-[#3e3e3e] text-white rounded"><MousePointer2 size={18} /></button>
                    <button className="p-2 text-[#888] hover:text-white hover:bg-[#3e3e3e] rounded transition-colors"><Box size={18} /></button>
                    <div className="w-8 h-[1px] bg-[#333] my-1" />
                    <button className="p-2 text-[#888] hover:text-white hover:bg-[#3e3e3e] rounded transition-colors"><Move size={18} /></button>
                    <button className="p-2 text-[#888] hover:text-white hover:bg-[#3e3e3e] rounded transition-colors"><RotateCw size={18} /></button>
                    <button className="p-2 text-[#888] hover:text-white hover:bg-[#3e3e3e] rounded transition-colors"><Scale size={18} /></button>
                </div>

                {/* 3D Viewport Main Area */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
                    {/* Viewport Header */}
                    <div className="h-8 bg-[#282828] border-b border-[#111111] flex items-center justify-between px-3 text-[10px] w-full relative z-10 shrink-0">
                        <span className="text-white bg-[#3e3e3e] px-2 py-0.5 rounded shadow-sm">Collection: {subcategoryName}</span>
                        <div className="flex items-center gap-2">
                            {["clay", "material"].map((m) => (
                                <button key={m} onClick={() => setMode(m)} className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${mode === m ? "border-[#10b981] bg-[#3e3e3e]" : "border-transparent bg-[#282828]"}`}>
                                    <div className={`w-4 h-4 rounded-full ${m === 'clay' ? 'bg-[#aaa]' : 'bg-[#10b981]'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3D Scene */}
                    <div className="flex-1 relative overflow-hidden group/viewer">
                        <div className="absolute inset-0 z-0">
                            <CharacterScene mode={mode} enableControls={true} modelUrl={project?.modelUrl} textureUrl={project?.textureUrl} />
                        </div>

                        {/* Floating Arrows */}
                        <button onClick={onPrev} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/40 hover:bg-[#10b981] text-white rounded-full transition-all border border-white/10"><ChevronLeft size={24} /></button>
                        <button onClick={onNext} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/40 hover:bg-[#10b981] text-white rounded-full transition-all border border-white/10"><ChevronRight size={24} /></button>

                        {/* Mobile Info Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 z-20 lg:hidden pointer-events-none">
                            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl pointer-events-auto">
                                <h3 className="text-[#10b981] font-black text-xs uppercase tracking-tight mb-1">{project?.title}</h3>
                                <p className="text-white/60 text-[10px] leading-tight line-clamp-2 italic">{project?.overview || project?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panels (Outliner & Properties) */}
                <div className="w-[300px] xl:w-[350px] border-l border-[#111111] bg-[#282828] hidden lg:flex flex-col shrink-0">
                    <div className="flex-1 flex flex-col border-b border-[#111111] min-h-0">
                        <div className="h-8 bg-[#333] flex items-center px-3 border-b border-[#111111] text-xs font-semibold shrink-0">
                            <Layers size={14} className="mr-2" /> Outliner
                        </div>
                        <div className="flex-1 p-2 text-xs overflow-y-auto">
                            <div className="flex items-center gap-1 cursor-pointer hover:bg-[#3e3e3e] p-1 rounded" onClick={() => setOutlinerExpanded(!outlinerExpanded)}>
                                {outlinerExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                <ImageIcon size={14} className="text-[#10b981]" />
                                <span className="text-white">Scene Collection</span>
                            </div>
                            {outlinerExpanded && (
                                <div className="pl-6 flex flex-col gap-1 mt-1">
                                    <div className="flex items-center gap-1 p-1 bg-[#3e3e3e]/50 border border-[#444] rounded text-white overflow-hidden">
                                        <Box size={14} className="text-[#10b981] shrink-0" /> <span className="truncate">{project?.title}</span>
                                    </div>
                                    <div className="flex items-center gap-1 p-1 text-[#888]">
                                        <div className="w-3" /> <Box size={14} /> <span>Camera</span>
                                    </div>
                                    <div className="flex items-center gap-1 p-1 text-[#888]">
                                        <div className="w-3" /> <Box size={14} /> <span>Lights</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="h-8 bg-[#333] flex items-center px-3 border-b border-[#111111] text-xs font-semibold shrink-0">
                            <Settings size={14} className="mr-2" /> Properties
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto text-xs flex flex-col gap-4">
                            <div className="flex flex-col gap-2 bg-[#1a1a1a] p-3 rounded border border-[#333]">
                                <div className="flex items-center gap-2 text-[#10b981] font-bold text-[14px]">
                                    Box size={16}  {project?.title}
                                </div>
                            </div>
                            <div className="flex-1 border border-[#333] rounded overflow-hidden flex flex-col min-h-0">
                                <div className="bg-[#333] px-2 py-1.5 flex items-center gap-1 font-semibold text-[#eee] shrink-0 border-b border-[#111]"><ChevronDown size={14} /> Description</div>
                                <div className="p-3 text-[#ddd] text-[13px] leading-relaxed bg-[#282828] overflow-y-auto flex-1 h-full">
                                    {project?.overview || project?.description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VideoEditorUI = ({ project, customOnBack, onBackToHome, onNext, onPrev, subcategoryName, navState, toggleFullscreen, isFullscreen }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const tier = "high";
    // Only render the blurred ambient video on high-end devices — it's a 2nd full video decode stream
    const showAmbientBg = tier === "high";

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused || !isPlaying) { videoRef.current.play(); setIsPlaying(true); }
        else { videoRef.current.pause(); setIsPlaying(false); }
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden relative bg-[#141414]">
            {/* Top Menu Bar */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#1a1a1a] border-b border-[#222] text-xs shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#10b981] rounded flex items-center justify-center text-white font-bold ml-1">Pr</div>
                    <span className="font-bold hidden sm:inline">{project?.title}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onBackToHome} className="p-1.5 hover:bg-white/5 rounded text-[#888] hover:text-[#10b981]"><Home size={16} /></button>
                    <button onClick={customOnBack} className="bg-[#333] px-3 py-1 rounded flex items-center gap-2 text-white hover:bg-[#444] transition-colors font-bold"><ArrowLeft size={14} /> Back</button>
                </div>
            </div>

            <div className={`flex-1 flex flex-col min-h-0 relative ${!isFullscreen ? 'pb-[calc(62px+env(safe-area-inset-bottom,0px))] lg:pb-0' : ''}`}>
                <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden bg-black">
                    {/* Desktop Sidebar / Left Panel */}
                    <div className="w-[300px] xl:w-[350px] bg-[#1a1a1a] border-r border-[#222] hidden lg:flex flex-col shrink-0 min-h-0 overflow-hidden">
                        <div className="h-8 bg-[#252525] border-b border-[#111] flex items-center px-4 text-[10px] font-bold text-[#888] uppercase tracking-widest shrink-0">
                            Project Bin
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                            <div className="bg-[#222] p-4 rounded-lg border border-white/5 shadow-inner">
                                <div className="text-[#10b981] font-black text-xl mb-1">{project?.title}</div>
                                <div className="h-[2px] w-12 bg-[#10b981]" />
                            </div>
                            <div className="flex-1 bg-[#151515] p-4 rounded-lg border border-white/5 flex flex-col min-h-0">
                                <div className="text-[10px] font-bold text-white/30 uppercase mb-3 flex items-center gap-2">
                                    <Layers size={12} /> Metadata
                                </div>
                                <div className="text-[13px] leading-relaxed text-[#aaa] whitespace-pre-wrap overflow-y-auto flex-1">
                                    {project?.overview || project?.description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monitor Area */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className={`flex-1 relative bg-[#050505] flex min-h-0 overflow-hidden group ${project?.isVertical ? 'flex-row' : 'flex-col items-center justify-center'}`}>
                            <div className="absolute top-2 left-3 z-30 flex items-center gap-2 pointer-events-none">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Program</span>
                            </div>

                            {project?.videoUrl ? (
                                project?.isVertical ? (
                                    /* ── Vertical Video Layout: fills height, centered ── */
                                    <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
                                        <video
                                            ref={videoRef}
                                            src={project.videoUrl}
                                            autoPlay
                                            loop
                                            playsInline
                                            className="h-full w-auto max-w-full object-contain z-10 relative"
                                            onTimeUpdate={(e) => setProgress(e.target.currentTime / e.target.duration)}
                                            onPlay={() => setIsPlaying(true)}
                                            onPause={() => setIsPlaying(false)}
                                        />
                                        {/* Soft ambient blur — only on high-tier devices */}
                                        {showAmbientBg && (
                                            <video
                                                src={project.videoUrl}
                                                muted loop playsInline
                                                className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-10 scale-110 pointer-events-none"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    /* ── Standard / Landscape Video Layout ── */
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <div className="relative h-full w-full flex items-center justify-center overflow-hidden bg-black">
                                            <video
                                                ref={videoRef}
                                                src={project.videoUrl}
                                                autoPlay
                                                loop
                                                playsInline
                                                className="max-h-full max-w-full object-contain z-10"
                                                onTimeUpdate={(e) => setProgress(e.target.currentTime / e.target.duration)}
                                                onPlay={() => setIsPlaying(true)}
                                                onPause={() => setIsPlaying(false)}
                                            />
                                            {/* Ambient blur bg — only on high-tier devices */}
                                            {showAmbientBg && (
                                                <video
                                                    src={project.videoUrl}
                                                    muted loop playsInline
                                                    className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-10 scale-110 pointer-events-none"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="text-[#10b981] border-2 border-[#10b981] px-4 py-2 font-mono text-sm tracking-tighter">MEDIA OFFLINE</div>
                            )}

                            <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-[#10b981] text-white rounded-full z-20 transition-all border border-white/10 opacity-0 group-hover:opacity-100 hover:scale-110"><ChevronLeft size={28} /></button>
                            <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-[#10b981] text-white rounded-full z-20 transition-all border border-white/10 opacity-0 group-hover:opacity-100 hover:scale-110"><ChevronRight size={28} /></button>
                        </div>

                        {/* Playback Controls Bar */}
                        <div className="h-12 bg-[#101010] flex items-center justify-between px-6 shrink-0 border-t border-b border-white/5">
                            <button onClick={onPrev} className="text-white/30 hover:text-white transition-colors"><SkipBack size={18} /></button>
                            <div className="flex items-center gap-10">
                                <button onClick={onPrev} className="text-white/40 hover:text-white"><ChevronsLeft size={24} /></button>
                                <button onClick={togglePlay} className="text-[#10b981] scale-110 transition-transform active:scale-90 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                    {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
                                </button>
                                <button onClick={onNext} className="text-white/40 hover:text-white"><ChevronsRight size={24} /></button>
                            </div>
                            <button onClick={onNext} className="text-white/30 hover:text-white transition-colors"><SkipForward size={18} /></button>
                        </div>
                    </div>
                </div>

                {/* Timeline Area & Description */}
                <div className="h-[28svh] md:h-[250px] bg-[#0a0a0a] flex flex-col min-h-0 overflow-hidden shrink-0 relative">
                    <div className="h-8 bg-[#101010] border-b border-[#111] flex items-center justify-center shrink-0">
                        <span className="text-white font-mono text-[10px] tracking-widest px-2 py-0.5 rounded border border-white/10 bg-black shadow-lg">00:00:{(progress * 15).toFixed(2).replace('.', ':')}</span>
                    </div>

                    {/* Tracks - Fixed (Static) */}
                    <div className="flex shrink-0">
                        {/* Track Headers */}
                        <div className="w-[60px] md:w-[220px] border-r border-[#111] bg-black/50 p-1 flex flex-col gap-1 shrink-0 overflow-hidden">
                            {[
                                { id: "V1", label: project?.title || "Video", icon: <ImageIcon size={10} /> },
                                { id: "A1", label: "Audio", icon: <Layers size={10} /> }
                            ].map(track => (
                                <div key={track.id} className="h-10 flex items-center px-1 md:px-2 bg-white/5 border border-white/5 rounded-lg gap-2 overflow-hidden">
                                    <div className="w-4 h-4 md:w-5 md:h-5 rounded flex items-center justify-center bg-black/40 text-[#10b981] shrink-0 border border-[#10b981]/20 font-bold text-[8px]">{track.id}</div>
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-tighter truncate hidden md:block">{track.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Track Timeline Area */}
                        <div className="flex-1 relative bg-black/40 overflow-hidden h-[82px] shrink-0">
                            <div className="p-1 flex flex-col gap-1 relative h-full">
                                {/* Playhead Line - Constrained to Track Area */}
                                <div className="absolute top-0 bottom-0 w-[1.5px] bg-[#10b981] z-20 pointer-events-none" style={{ left: `${progress * 100}%` }}>
                                    <div className="absolute -top-0.5 -left-1.5 w-3 h-3 bg-[#10b981] rounded-full shadow-[0_0_15px_#10b981]" />
                                </div>

                                <div className="h-10 relative overflow-hidden">
                                    <div className="absolute left-0 right-[20%] top-1 bottom-1 bg-[#10b981]/20 border border-[#10b981]/40 rounded-md flex items-center px-3 shadow-[inset_0_0_100px_rgba(16,185,129,0.1)]">
                                        <span className="text-[9px] md:text-[10px] font-black text-[#10b981]/80 uppercase truncate">{project?.title}</span>
                                    </div>
                                </div>
                                <div className="h-10 relative overflow-hidden">
                                    <div className="absolute left-0 right-[15%] top-1 bottom-1 bg-white/5 border border-white/10 rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Description Integration */}
                    <div className="lg:hidden px-4 pt-3 pb-[calc(75px+env(safe-area-inset-bottom,0px))] flex-1 overflow-y-auto bg-[#0a0a0a]">
                        <div className="text-[9px] font-bold text-[#10b981] uppercase mb-1.5 tracking-widest flex items-center gap-2 opacity-80">
                            <Box size={12} /> info
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[10px] leading-relaxed italic text-white/40 mb-4 px-1">
                                {project?.overview || project?.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
