"use client";

import { useEffect, useRef, useState } from "react";

// Skill icons using inline SVGs (no external deps)
const icons = {
    "3D Art": (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth={1.5}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    ),
    "Video Editing": (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth={1.5}>
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
    ),
    "Graphic Design": (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
    ),
    "Motion Design": (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth={1.5}>
            <path d="M5 3l14 9-14 9V3z" />
        </svg>
    ),
};

const skills = [
    {
        title: "3D Art",
        software: ["Blender"],
        description: "Creating immersive 3D models, environments and animations with Blender.",
    },
    {
        title: "Video Editing",
        software: ["Premiere Pro", "After Effects"],
        description: "Crafting compelling video stories with professional-grade editing tools.",
    },
    {
        title: "Graphic Design",
        software: ["Photoshop"],
        description: "Designing striking visuals and brand assets with pixel-perfect precision.",
    },
    {
        title: "Motion Design",
        software: ["After Effects"],
        description: "Bringing static designs to life through fluid motion and animation.",
    },
];

// Fade-up animation hook using IntersectionObserver
function useFadeUp(delay = 0) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return {
        ref,
        style: {
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        },
    };
}


const SkillCard = ({ skill, index }) => {
    const fade = useFadeUp(index * 100);
    const [hovered, setHovered] = useState(false);

    return (
        <div
            ref={fade.ref}
            style={{
                ...fade.style,
                borderColor: hovered ? "var(--accent)" : "var(--card-border)",
                boxShadow: hovered
                    ? "0 0 30px var(--accent-glow), 0 8px 32px rgba(0,0,0,0.1)"
                    : "none",
                transform: fade.style.transform + (hovered ? " translateY(-6px)" : ""),
            }}
            className="group relative flex flex-col gap-2 md:gap-4 p-4 md:p-6 rounded-2xl border bg-card-bg backdrop-blur-sm cursor-default transition-all duration-300 aspect-square md:aspect-auto justify-between md:justify-start"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Top accent line */}
            <div
                className="absolute top-0 left-6 right-6 h-[1.5px] rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100"
                style={{
                    background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                }}
            />

            {/* Icon */}
            <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{
                    background: hovered
                        ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                        : "color-mix(in srgb, var(--accent) 6%, transparent)",
                    color: "var(--accent)",
                }}
            >
                <div className="scale-90 md:scale-100">
                    {icons[skill.title]}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-foreground font-black text-lg tracking-tight leading-tight">{skill.title}</h3>

            {/* Description */}
            <p className="hidden md:block text-muted-text/80 text-sm leading-relaxed flex-1 font-medium">{skill.description}</p>

            {/* Software tags */}
            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-card-border">
                {skill.software.map((sw) => (
                    <span
                        key={sw}
                        className="text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider"
                        style={{
                            background: "color-mix(in srgb, var(--accent) 8%, transparent)",
                            color: "var(--accent)",
                            border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                        }}
                    >
                        {sw}
                    </span>
                ))}
            </div>
        </div>
    );
};

const About = () => {
    const headingFade = useFadeUp(0);
    const descFade = useFadeUp(150);

    return (
        <section
            id="about"
            className="relative z-10 py-32 px-6"
            style={{ scrollMarginTop: "80px" }}
        >
            <div className="max-w-[1100px] mx-auto flex flex-col items-center gap-16">

                {/* Heading */}
                <div className="flex flex-col items-center gap-5 text-center">
                    <div ref={headingFade.ref} style={headingFade.style} className="flex flex-col items-center gap-3">
                        <span
                            className="text-xs tracking-[0.3em] uppercase font-black"
                            style={{ color: "var(--accent)" }}
                        >
                            Who I Am
                        </span>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-foreground leading-tight">
                            About{" "}
                            <span
                                style={{
                                    background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Me
                            </span>
                        </h2>
                    </div>

                    <p
                        ref={descFade.ref}
                        style={{ ...descFade.style, color: "var(--muted-text)", maxWidth: "650px" }}
                        className="text-base md:text-lg leading-relaxed text-center font-medium"
                    >
                        I am a creative digital artist passionate about crafting immersive visual experiences.
                        My work blends <strong className="text-foreground tracking-tight">3D Art</strong>,{" "}
                        <strong className="text-foreground tracking-tight">Video Editing</strong>,{" "}
                        <strong className="text-foreground tracking-tight">Graphic Design</strong>, and{" "}
                        <strong className="text-foreground tracking-tight">Motion Design</strong> to build engaging content
                        and interactive visuals. With a background in <strong className="text-foreground tracking-tight">Information Technology</strong>, I combine technical logic with creative artistry to deliver professional-grade results.
                    </p>
                </div>

                {/* Skills Grid */}
                <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {skills.map((skill, i) => (
                        <SkillCard key={skill.title} skill={skill} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
