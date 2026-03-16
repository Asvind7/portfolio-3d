"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useFadeUp, GreenLabel, BackBtn } from "./Shared";
import { Home } from "lucide-react";

export const ProjectsGrid = ({ subcategory, categoryLabel, onViewCaseStudy, onBack, onBackToHome }) => {
    const [mounted, setMounted] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

    // Extract unique subcategories from projects
    const filterOptions = ["All", ...new Set(subcategory.projects.map(p => p.subcategoryName).filter(Boolean))];

    const filteredProjects = activeFilter === "All"
        ? subcategory.projects
        : subcategory.projects.filter(p => p.subcategoryName === activeFilter);

    return (
        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(32px)", transition: "all 0.45s ease" }} className="flex flex-col gap-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 flex-wrap text-sm">
                <button onClick={onBackToHome} className="p-2 border border-card-border rounded-full hover:bg-card-bg hover:text-accent transition-colors"><Home size={16}/></button>
                <span className="text-muted-text/30">›</span>
                <BackBtn label={categoryLabel} onClick={onBack} />
                <span className="text-muted-text/30">›</span>
                <span style={{ color: "var(--accent)" }} className="font-semibold">{subcategory.name}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-3">
                    <GreenLabel>Showcase · {categoryLabel}</GreenLabel>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground">
                        {subcategory.name}
                    </h2>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card-bg border border-card-border text-muted-text text-[10px] font-black tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    {filteredProjects.length} PROJECTS
                </div>
            </div>

            {/* Filter Menu */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {filterOptions.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => setActiveFilter(opt)}
                        className="whitespace-nowrap px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border"
                        style={{
                                background: activeFilter === opt ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "color-mix(in srgb, var(--foreground) 2%, transparent)",
                                borderColor: activeFilter === opt ? "var(--accent)" : "var(--card-border)",
                                color: activeFilter === opt ? "var(--accent)" : "var(--muted-text)"
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 min-h-[400px]">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, i) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={i}
                            onClick={() => onViewCaseStudy(project)}
                            onQuickView={undefined}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 text-foreground/20">
                        <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" stroke="currentColor" strokeWidth={1}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <span className="text-sm font-medium tracking-widest uppercase">No projects found in this category</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ProjectCard = ({ project, onClick, onQuickView, index }) => {
    const [hovered, setHovered] = useState(false);
    const fade = useFadeUp(index * 60);

    return (
        <div
            ref={fade.ref}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative overflow-hidden rounded-2xl cursor-pointer border bg-card-bg transition-all duration-500"
            style={{
                ...fade.style,
                minHeight: "320px",
                borderColor: hovered ? "color-mix(in srgb, var(--accent) 40%, transparent)" : "var(--card-border)",
                boxShadow: hovered ? "0 0 50px var(--accent-glow), 0 20px 48px rgba(0,0,0,0.15)" : "0 4px 24px rgba(0,0,0,0.05)",
                transform: fade.style.transform + (hovered ? " scale(1.015)" : "")
            }}
        >
            {/* Bg Image */}
            <div className="absolute inset-0">
                <Image
                    src={project.src}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "radial-gradient(circle at center, var(--accent-glow) 0%, transparent 70%)" }} />
            </div>

            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] transition-all duration-300"
                style={{ background: hovered ? "linear-gradient(90deg, transparent, var(--accent), transparent)" : "transparent" }} />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-7 gap-1">
                <div className="flex items-center gap-2">
                    {project.subcategoryName && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-accent text-background">
                            {project.subcategoryName}
                        </span>
                    )}
                    <span className="text-[10px] font-bold tracking-widest uppercase text-accent">{project.subtitle}</span>
                </div>
                <h3 className="text-2xl font-black text-white mt-1">{project.title}</h3>
                <p className="text-white/70 text-sm line-clamp-2 max-w-sm">{project.description}</p>

                <div className="mt-4 flex items-center justify-end gap-3 z-20 relative">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#fff] group-hover:text-accent transition-all group-hover:-translate-x-2">
                        View Details
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 transition-transform group-hover:translate-x-1" stroke="currentColor" strokeWidth={2.5}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
