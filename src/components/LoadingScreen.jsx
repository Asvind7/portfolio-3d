"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";

const LoadingScreen = ({ onComplete }) => {
    // Drei's progress hook tracks the DefaultLoadingManager (all GLTF, Texture, etc. loads)
    const { progress: actualProgress, active } = useProgress();
    const [displayProgress, setDisplayProgress] = useState(0);
    const [phase, setPhase] = useState("loading"); // "loading" | "done" | "hidden"
    const rafId = useRef(null);
    const startTime = useRef(performance.now());
    
    // Minimum time to show the loading screen for aesthetic brand consistency
    const MIN_TIME = 2500; 
    
    useEffect(() => {
        const tick = () => {
            const elapsed = performance.now() - startTime.current;
            const timeWeight = Math.min(elapsed / MIN_TIME, 1);
            
            // Actual asset progress scaled to 0-1
            const assetWeight = actualProgress / 100;
            
            // Display progress is the MINIMUM of time weight and asset weight
            // This ensures we wait for BOTH assets AND the animation time
            const targetWeight = active ? Math.min(timeWeight, assetWeight) : timeWeight;
            const newPct = Math.floor(targetWeight * 100);

            setDisplayProgress(prev => {
                if (newPct > prev) return newPct;
                return prev;
            });

            if (newPct < 100 || active || elapsed < MIN_TIME) {
                rafId.current = requestAnimationFrame(tick);
            } else {
                setDisplayProgress(100);
                setTimeout(() => {
                    setPhase("done");
                    setTimeout(() => {
                        setPhase("hidden");
                        onComplete?.();
                    }, 800);
                }, 400);
            }
        };

        rafId.current = requestAnimationFrame(tick);
        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [actualProgress, active, onComplete]);

    if (phase === "hidden") return null;

    return (
        <div
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030712]"
            style={{
                opacity: phase === "done" ? 0 : 1,
                transition: "opacity 0.6s ease",
                pointerEvents: phase === "done" ? "none" : "all",
            }}
        >
            {/* Animated background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
                        animation: "pulse 2s ease-in-out infinite",
                    }}
                />
            </div>

            {/* Logo / Name */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                <div className="text-center">
                    <h1
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-2"
                        style={{
                            background: "linear-gradient(135deg, #10b981, #34d399)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        ASVIND V.A
                    </h1>
                    <p className="text-slate-500 text-sm tracking-[0.3em] uppercase font-bold">
                        Portfolio
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-64 md:w-80 flex flex-col gap-2">
                    <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${displayProgress}%`,
                                background: "linear-gradient(90deg, #10b981, #34d399)",
                                boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
                                transition: "width 0.05s linear",
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-slate-500 text-xs font-mono font-bold">
                        <span>Initializing...</span>
                        <span>{displayProgress}%</span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
                    50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
