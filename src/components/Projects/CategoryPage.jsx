"use client";

import React from "react";
import { useFadeUp, GreenLabel } from "./Shared";
import { SubcategoryPanel } from "./SubcategoryPanel";
import { Home, ArrowLeft } from "lucide-react";

export const CategoryPage = ({ category, onSelectSub, onBack, onBackToHome }) => {
    const fadeTitle = useFadeUp(0);
    const fadeDesc = useFadeUp(100);

    return (
        <div className="flex flex-col gap-1">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="group flex items-center gap-2 px-4 py-2 bg-card-bg border border-card-border rounded-xl text-xs font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-all">
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Back
                    </button>
                    <span className="text-muted-text/30">/</span>
                    <span style={{ color: "var(--accent)" }} className="text-xs font-black uppercase tracking-widest">{category.label}</span>
                </div>
                <button onClick={onBackToHome} className="p-2 border border-card-border rounded-xl hover:bg-card-bg hover:text-accent transition-colors hidden sm:block" title="Reload Gallery">
                    <Home size={18}/>
                </button>
            </div>

            <div className="flex flex-col gap-1"
                style={{ opacity: fadeDesc.style.opacity, transform: fadeDesc.style.transform, transition: fadeDesc.style.transition }}>
                <div className="flex items-center gap-2">
                    <GreenLabel>Discipline</GreenLabel>
                    <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight">{category.label}</h2>
                </div>
                <p className="text-muted-text text-[11px] md:text-xs leading-relaxed max-w-xl opacity-70 italic">{category.description}</p>
            </div>

            {/* Subcategory Grid - Adjusted for horizontal cards */}
            <div className="flex flex-col gap-3">
                {category.subcategories.map((sub, i) => (
                    <SubcategoryPanel key={sub.id} sub={sub} index={i} onSelect={onSelectSub} />
                ))}
            </div>
        </div>
    );
};
