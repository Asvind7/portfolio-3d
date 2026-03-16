"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// ─── Tool icons ───────────────────────────────────────────────────────────────
const toolIcons = {
    Blender: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#EA7600" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm4.187 8.125c1.171 0 2.125.954 2.125 2.125s-.954 2.125-2.125 2.125s-2.125-.954-2.125-2.125s.954-2.125 2.125-2.125z" />
            <path fill="#222" d="M12 10.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5z" />
        </svg>
    ),
    Photoshop: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
            <rect width="20" height="20" x="2" y="2" fill="#001E36" rx="2" />
            <path fill="#31A8FF" d="M22 4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4zM8.5 15.5v-7h3c1.4 0 2.2.8 2.2 2s-.8 2-2.2 2H10v3H8.5z" />
        </svg>
    ),
    "After Effects": (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
            <rect width="20" height="20" x="2" y="2" fill="#00005B" rx="2" />
            <path fill="#D291FF" d="M22 4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4zM10 16H8.5l3-8h1.5l3 8h-1.5l-.6-1.5h-2.8l-.6 1.5z" />
        </svg>
    ),
    "Premiere Pro": "🎞️",
    "Substance Painter": "🎨",
};

const processSteps = [
    { name: "Concept Idea", icon: "💡", description: "Initial idea and design goal — what story does this project tell?" },
    { name: "Wireframe", icon: "📐", description: "Layout planning and scene composition to define the visual structure." },
    { name: "Sketch", icon: "✏️", description: "Early visual sketches that explore shape, form, and proportion." },
    { name: "Storyboard", icon: "🎬", description: "Animation sequence planning — mapping out timing and camera movement." },
    { name: "Modeling", icon: "🧊", description: "3D modeling process in Blender — building every mesh from scratch." },
    { name: "Animation", icon: "▶️", description: "Animating the final scene with rigging, keyframes, and physics." },
];

// ─── Fade up hook ─────────────────────────────────────────────────────────────
function useFadeUp(delay = 0) {
    const ref = useRef(null);
    const [v, setV] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setV(true); },
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return { ref, style: { opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` } };
}

// ─── Section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
    <span className="text-xs tracking-[0.3em] uppercase font-semibold" style={{ color: "#00FFA8" }}>
        {children}
    </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ProjectDetail = ({ project, categoryLabel, onBack }) => {
    const [mounted, setMounted] = useState(false);
    const [activeGallery, setActiveGallery] = useState(null);

    // Slide-up entrance
    useEffect(() => {
        requestAnimationFrame(() => setMounted(true));
        window.scrollTo({ top: 0, behavior: "instant" });
        document.body.style.overflow = "auto";
    }, []);

    const heroFade = useFadeUp(0);
    const overFade = useFadeUp(100);
    const procFade = useFadeUp(0);
    const toolsFade = useFadeUp(0);
    const gallFade = useFadeUp(0);

    const galleryItems = [
        { src: project.src, label: "Final Render" },
        { src: "/projects/final_render_2.png", label: "Alternate Angle" },
        { src: "/projects/process_sketch.png", label: "Process Sketch" },
    ];

    return (
        <>
            {/* Full-page slide-up overlay */}
            <div
                className="fixed inset-0 z-[9998] overflow-y-auto"
                style={{
                    background: "linear-gradient(180deg, #030712 0%, #020b18 100%)",
                    transform: mounted ? "translateY(0)" : "translateY(80px)",
                    opacity: mounted ? 1 : 0,
                    transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
                }}
            >
                {/* Ambient glow */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, rgba(0,255,168,0.04) 0%, transparent 70%)" }} />

                <div className="max-w-[1100px] mx-auto px-6 pt-24 pb-32 flex flex-col gap-20">

                    {/* ── Back button + breadcrumb ── */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:gap-3"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "#00FFA8"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
                                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                            </svg>
                            Return to Projects
                        </button>
                        <span className="text-white/15 text-sm">›</span>
                        <span className="text-white/30 text-sm">{categoryLabel}</span>
                        <span className="text-white/15 text-sm">›</span>
                        <span className="text-sm" style={{ color: "#00FFA8" }}>{project.title}</span>
                    </div>

                    {/* ── Title ── */}
                    <div className="flex flex-col gap-3">
                        <SectionLabel>Project</SectionLabel>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-none">
                            {project.title}
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span
                                className="text-sm px-3 py-1 rounded-full font-medium"
                                style={{ background: "rgba(0,255,168,0.1)", color: "#00FFA8", border: "1px solid rgba(0,255,168,0.25)" }}
                            >
                                {project.type}
                            </span>
                            <span className="text-white/25 text-sm">·</span>
                            <span className="text-white/35 text-sm font-mono">2024</span>
                        </div>
                    </div>

                    {/* ── Hero Visual ── */}
                    <div ref={heroFade.ref} style={heroFade.style} className="flex flex-col gap-4">
                        <SectionLabel>Final Result</SectionLabel>
                        <div
                            className="relative w-full rounded-2xl overflow-hidden border"
                            style={{ aspectRatio: "16/9", borderColor: "rgba(0,255,168,0.12)" }}
                        >
                            <Image src={project.src} alt={project.title} fill className="object-cover" />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(3,7,18,0.5) 100%)" }} />
                        </div>
                    </div>

                    {/* ── Overview ── */}
                    <div ref={overFade.ref} style={overFade.style} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        <div className="flex flex-col gap-4">
                            <SectionLabel>Project Overview</SectionLabel>
                            <p className="text-[#9FB3C8] text-base leading-relaxed">
                                {project.description || "A fully realized 3D project exploring form, texture, and motion. Every element was crafted from scratch — from initial concept sketches through to the final rendered output."}
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <SectionLabel>Objective</SectionLabel>
                            <p className="text-[#9FB3C8] text-base leading-relaxed">
                                To push the boundaries of stylized 3D rendering while maintaining a clean, professional presentation suitable for a portfolio showcase.
                            </p>
                        </div>
                    </div>

                    {/* ── Creative Process ── */}
                    <div className="flex flex-col gap-8">
                        <div ref={procFade.ref} style={procFade.style} className="flex flex-col gap-2">
                            <SectionLabel>Creative Process</SectionLabel>
                            <h2 className="text-3xl font-black text-white">How it was made</h2>
                        </div>

                        {/* Process sketch image */}
                        <div className="relative w-full rounded-2xl overflow-hidden border" style={{ aspectRatio: "16/7", borderColor: "rgba(255,255,255,0.06)" }}>
                            <Image src="/projects/process_sketch.png" alt="Process" fill className="object-cover opacity-80" />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(3,7,18,0.3), transparent)" }} />
                        </div>

                        {/* Steps timeline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {processSteps.map((step, i) => {
                                const fade = { ref: useRef(null), style: { opacity: 1, transform: "none" } };
                                return (
                                    <ProcessCard key={step.name} step={step} index={i} />
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Tools Used ── */}
                    <div ref={toolsFade.ref} style={toolsFade.style} className="flex flex-col gap-6">
                        <SectionLabel>Tools Used</SectionLabel>
                        <div className="flex flex-wrap gap-3">
                            {(project.tools || ["Blender", "After Effects", "Premiere Pro", "Photoshop"]).map((tool) => (
                                <div
                                    key={tool}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        borderColor: "rgba(0,255,168,0.15)",
                                    }}
                                >
                                    <span className="text-xl">{toolIcons[tool] || "🔧"}</span>
                                    <span className="text-white/80 text-sm font-medium">{tool}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Final Result Gallery ── */}
                    <div ref={gallFade.ref} style={gallFade.style} className="flex flex-col gap-6">
                        <SectionLabel>Gallery</SectionLabel>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {galleryItems.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveGallery(i)}
                                    className="relative rounded-2xl overflow-hidden border group transition-all duration-300 hover:-translate-y-1"
                                    style={{
                                        aspectRatio: "4/3",
                                        borderColor: "rgba(0,255,168,0.12)",
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0,255,168,0.4)"}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(0,255,168,0.12)"}
                                >
                                    <Image src={item.src} alt={item.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 transition-opacity duration-300" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(3,7,18,0.8) 100%)" }} />
                                    <span className="absolute bottom-3 left-3 text-xs text-white/70 font-medium">
                                        {item.label}
                                    </span>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,255,168,0.5)" }}>
                                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="#00FFA8" strokeWidth={2}>
                                                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Gallery lightbox */}
            {activeGallery !== null && (
                <div
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                    style={{ background: "rgba(3,7,18,0.95)", backdropFilter: "blur(20px)" }}
                    onClick={() => setActiveGallery(null)}
                >
                    <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(0,255,168,0.2)" }} onClick={(e) => e.stopPropagation()}>
                        <Image src={galleryItems[activeGallery].src} alt={galleryItems[activeGallery].label} width={1200} height={800} className="w-full h-auto object-cover" />
                        <button
                            onClick={() => setActiveGallery(null)}
                            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
                            style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

// ─── Process card ─────────────────────────────────────────────────────────────
const ProcessCard = ({ step, index }) => {
    const [hovered, setHovered] = useState(false);
    const fade = useFadeUp(index * 80);
    return (
        <div
            ref={fade.ref}
            style={{
                ...fade.style,
                borderColor: hovered ? "rgba(0,255,168,0.35)" : "rgba(255,255,255,0.06)",
                boxShadow: hovered ? "0 0 20px rgba(0,255,168,0.07)" : "none",
                transform: fade.style.transform + (hovered ? " translateY(-3px)" : ""),
            }}
            className="flex flex-col gap-3 p-5 rounded-xl border bg-white/[0.02] transition-all duration-300"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="flex items-center gap-3">
                <span className="text-2xl">{step.icon}</span>
                <div className="flex items-center gap-2">
                    <span className="text-white/20 text-xs font-mono">{String(index + 1).padStart(2, "0")}</span>
                    <h4 className="text-white font-bold text-sm">{step.name}</h4>
                </div>
            </div>
            <p className="text-[#9FB3C8] text-xs leading-relaxed">{step.description}</p>
        </div>
    );
};

export default ProjectDetail;
