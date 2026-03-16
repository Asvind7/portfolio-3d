"use client";

import { useEffect, useRef, useState } from "react";

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState("loading"); // "loading" | "done" | "hidden"
    const rafId = useRef(null);
    const progressRef = useRef(0);

    useEffect(() => {
        // Use requestAnimationFrame instead of setInterval for smoother and more
        // RAM-friendly animation. Only commit to React state every ~2 frames to
        // halve the number of React re-renders on the loading screen.
        const TARGET_DURATION = 2000; // 2 seconds total
        const startTime = performance.now();
        let lastCommittedProgress = 0;

        const tick = (now) => {
            const elapsed = now - startTime;
            const raw = Math.min(elapsed / TARGET_DURATION, 1);

            // Ease-out curve: faster at start, slower near end
            const eased = 1 - Math.pow(1 - raw, 2.5);
            const newPct = Math.floor(eased * 100);

            progressRef.current = newPct;

            // Only trigger a React state update if progress moved by ≥2
            // — halves render count without visible difference
            if (newPct - lastCommittedProgress >= 2) {
                setProgress(newPct);
                lastCommittedProgress = newPct;
            }

            if (raw < 1) {
                rafId.current = requestAnimationFrame(tick);
            } else {
                setProgress(100);
                // Brief pause at 100% before fading out
                setTimeout(() => {
                    setPhase("done");
                    setTimeout(() => {
                        setPhase("hidden");
                        onComplete?.();
                    }, 600);
                }, 300);
            }
        };

        rafId.current = requestAnimationFrame(tick);

        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, []);

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
                                width: `${progress}%`,
                                background: "linear-gradient(90deg, #10b981, #34d399)",
                                boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
                                transition: "width 0.05s linear",
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-slate-500 text-xs font-mono font-bold">
                        <span>Initializing...</span>
                        <span>{progress}%</span>
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
