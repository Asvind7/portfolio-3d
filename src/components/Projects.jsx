"use client";

import React, { useState, useEffect, useRef } from "react";
import { projectsData } from "@/lib/projectsData";
import { GreenLabel } from "./Projects/Shared";
import { CategoryCard } from "./Projects/CategorySelection";
import { CategoryPage } from "./Projects/CategoryPage";
import { ProjectsGrid } from "./Projects/ProjectsGrid";
import { ProjectCarousel } from "./Projects/ProjectCarousel";
import { CaseStudy } from "./Projects/CaseStudy";
import dynamic from "next/dynamic";

const ProjectCharacter = dynamic(() => import("@/components/ProjectCharacter"), { ssr: false });

const Projects = () => {
    const [level, setLevel] = useState(1);
    const [selCategory, setSelCategory] = useState(null);
    const [selSub, setSelSub] = useState(null);
    const [selProject, setSelProject] = useState(null);
    const [isExitingCaseStudy, setIsExitingCaseStudy] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const headingRef = useRef(null);
    const [headingVisible, setHeadingVisible] = useState(false);
    useEffect(() => {
        const el = headingRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeadingVisible(true); }, { threshold: 0.2 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const goTo = (lvl) => setLevel(lvl);

    useEffect(() => {
        if (level === 4) {
            document.body.style.overflow = "hidden";
            const navs = document.querySelectorAll("nav");
            navs.forEach(nav => {
                if (!nav.getAttribute('class')?.includes('z-[10015]')) {
                    nav.style.opacity = "0";
                    nav.style.pointerEvents = "none";
                }
            });
        } else {
            document.body.style.overflow = "auto";
            const navs = document.querySelectorAll("nav");
            navs.forEach(nav => {
                nav.style.opacity = "1";
                nav.style.pointerEvents = "all";
            });
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [level]);

    const handleBackFromCaseStudy = () => {
        setIsExitingCaseStudy(true);
        setTimeout(() => {
            setIsExitingCaseStudy(false);
            goTo(3);
        }, 500);
    };

    const handleBackToHomeFromCaseStudy = () => {
        setIsExitingCaseStudy(true);
        setTimeout(() => {
            setIsExitingCaseStudy(false);
            setLevel(1);
            setSelCategory(null);
            setSelSub(null);
            setSelProject(null);
        }, 500);
    };

    const getNavState = () => {
        if (!selSub || !selProject || !selCategory) return null;
        let subIndex = selCategory.subcategories.findIndex(s => s.name === selSub.name);
        if (subIndex === -1 && selProject.subcategoryName) {
            subIndex = selCategory.subcategories.findIndex(s => s.name === selProject.subcategoryName);
        }
        const currentSub = selCategory.subcategories[subIndex] || selSub;
        const pIndex = currentSub.projects.findIndex(p => p.id === selProject.id);
        const hasNextProject = pIndex < currentSub.projects.length - 1;
        const hasPrevProject = pIndex > 0;
        const hasNextSection = subIndex !== -1 && subIndex < selCategory.subcategories.length - 1;
        return { currentSub, pIndex, subIndex, hasNextProject, hasPrevProject, hasNextSection };
    };

    const handleNextProject = () => {
        const state = getNavState();
        if (!state) return;
        if (state.hasNextProject) {
            setSelProject(state.currentSub.projects[state.pIndex + 1]);
        } else if (state.hasNextSection) {
            const nextSub = selCategory.subcategories[state.subIndex + 1];
            setSelSub(nextSub);
            setSelProject(nextSub.projects[0]);
        }
    };

    const handlePrevProject = () => {
        const state = getNavState();
        if (!state) return;
        if (state.hasPrevProject) {
            setSelProject(state.currentSub.projects[state.pIndex - 1]);
        } else if (state.subIndex > 0) {
            const prevSub = selCategory.subcategories[state.subIndex - 1];
            setSelSub(prevSub);
            setSelProject(prevSub.projects[prevSub.projects.length - 1]);
        }
    };

    return (
        <>
            <section 
                id="projects" 
                className={`relative py-6 md:py-16 px-4 md:px-6 transition-all duration-500 ${level === 4 ? "z-[10001]" : "z-10 bg-transparent"}`} 
                style={{ 
                    scrollMarginTop: "20px", 
                    backgroundColor: level === 4 ? "var(--background)" : "transparent",
                }}
            >
                <div className="max-w-[1100px] mx-auto">
                    {(level === 1 || level === 2) && (
                        <div className={`flex flex-col ${level === 1 ? "gap-6" : "gap-4 md:gap-6"}`}>
                            {level === 1 && (
                                <div ref={headingRef} className="flex flex-col items-center gap-2 text-center mb-2"
                                    style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
                                    <GreenLabel>My Work</GreenLabel>
                                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                                        My <span style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Projects</span>
                                    </h2>
                                    <p className="text-muted-text text-sm md:text-base max-w-md opacity-80">Explore my creative work across 3D art, motion graphics, and video editing.</p>
                                </div>
                            )}

                            <div className={`flex flex-col lg:flex-row items-start ${level === 1 ? "gap-4 lg:gap-8" : "gap-0"}`}>
                                <div className="flex flex-col items-center justify-center flex-shrink-0 w-full lg:w-[400px] xl:w-[500px] relative z-20 h-[300px] sm:h-[400px] lg:h-full lg:sticky lg:top-32">
                                    <div className="relative w-full h-full lg:h-[550px]">
                                        <ProjectCharacter activeCategory={hoveredCategory || selCategory} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6 w-full lg:flex-1">
                                    {level === 1 && (
                                        <div className="flex flex-col gap-3 w-full">
                                            {Object.values(projectsData).map((cat, i) => (
                                                <CategoryCard
                                                    key={cat.id}
                                                    cat={cat}
                                                    delay={i * 100}
                                                    onClick={() => {
                                                        setSelCategory(cat);
                                                        goTo(2);
                                                    }}
                                                    onMouseEnter={() => setHoveredCategory(cat)}
                                                    onMouseLeave={() => setHoveredCategory(null)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    
                                    {level === 2 && selCategory && (
                                        <CategoryPage 
                                            category={selCategory}
                                            onSelectSub={(sub) => { setSelSub(sub); goTo(3); }}
                                            onBack={() => goTo(1)}
                                            onBackToHome={() => goTo(1)} 
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {level === 3 && selSub && selCategory && (
                        selSub.isAll ? (
                            <ProjectsGrid subcategory={selSub} categoryLabel={selCategory.label}
                                onViewCaseStudy={(proj) => { setSelProject(proj); goTo(4); }}
                                onBack={() => goTo(1)}
                                onBackToHome={() => goTo(1)} />
                        ) : (
                            <ProjectCarousel subcategory={selSub} categoryLabel={selCategory.label}
                                onViewCaseStudy={(proj) => { setSelProject(proj); goTo(4); }}
                                onBack={() => goTo(2)}
                                onBackToHome={() => goTo(1)} />
                        )
                    )}
                </div>
            </section>

            {level === 4 && selProject && selCategory && selSub && (
                <CaseStudy 
                    project={selProject} 
                    categoryLabel={selCategory.label} 
                    subcategoryName={selSub.name}
                    isExiting={isExitingCaseStudy}
                    onBack={handleBackFromCaseStudy} 
                    onBackToHome={handleBackToHomeFromCaseStudy}
                    onNext={handleNextProject}
                    onPrev={handlePrevProject}
                    navState={getNavState()}
                />
            )}
        </>
    );
};

export default Projects;
