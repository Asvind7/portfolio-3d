"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { User, Loader2, Wifi, Battery, Monitor } from "lucide-react";

const LoadingScreen = ({ onComplete }) => {
    // Drei's progress hook tracks the DefaultLoadingManager (all GLTF, Texture, etc. loads)
    const { progress: actualProgress, active } = useProgress();
    const [displayProgress, setDisplayProgress] = useState(0);
    const [phase, setPhase] = useState("loading"); // "loading" | "done" | "hidden"
    const [currentTip, setCurrentTip] = useState("");
    const rafId = useRef(null);
    const startTime = useRef(performance.now());
    
    const tips = [
        "Tip: Click the desktop icons or Taskbar apps to open your Projects and Resume.",
        "Hint: Open the Start Menu to view my pinned skills and proficiencies.",
        "Tip: Double-click a window's title bar to maximize it to full screen.",
        "Hint: The 3D character on the desktop reacts dynamically to your mouse movements!",
        "Tip: Check out the Featured Projects widget on the left for quick 3D previews.",
        "Hint: Every icon in the Taskbar is fully active—try clicking them!"
    ];

    useEffect(() => {
        setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
        const tipTimer = setInterval(() => {
            setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
        }, 3000);
        return () => clearInterval(tipTimer);
    }, []);

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
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0f172a] font-sans"
            style={{
                backgroundImage: 'radial-gradient(circle at center, rgba(139,92,246,0.15) 0%, rgba(15,23,42,1) 100%)',
                opacity: phase === "done" ? 0 : 1,
                transition: "opacity 0.6s ease",
                pointerEvents: phase === "done" ? "none" : "all",
            }}
        >
            {/* Windows 11 Lock Screen Style - Dark Mode */}
            <div className="relative z-10 flex flex-col items-center gap-6 mt-[-10vh] animate-in slide-in-from-bottom-4 fade-in duration-700">
                
                {/* Profile Picture */}
                <div className="w-48 h-48 rounded-full shadow-[0_0_50px_rgba(139,92,246,0.2)] overflow-hidden bg-black/40 flex items-center justify-center border-2 border-white/10 backdrop-blur-md">
                    <img 
                        src="/pfp.jpeg" 
                        alt="Asvind V.A" 
                        className="w-full h-full object-cover scale-110"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center text-white/20 bg-black/40">
                        <User size={80} />
                    </div>
                </div>

                <div className="text-center flex flex-col items-center">
                    <h1 className="text-3xl font-medium text-white mb-6 tracking-wide drop-shadow-lg">
                        Asvind V.A
                    </h1>
                    
                    {displayProgress < 100 ? (
                        <div className="flex flex-col items-center gap-4">
                            <button className="px-8 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-md transition-colors text-sm font-semibold mb-2 shadow-lg">
                                Sign in
                            </button>
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                                <span className="text-white/80 text-sm font-medium">Welcome</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                                <span className="text-white/80 text-sm font-medium">Signing in...</span>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Random Tips & Hints */}
                <div className="mt-8 text-white/40 text-xs tracking-wide animate-pulse max-w-xs text-center min-h-[40px] px-4">
                    {currentTip}
                </div>
            </div>
            
            {/* Bottom Right System Tray Icons */}
            <div className="absolute bottom-6 right-8 flex gap-4 text-white/80 drop-shadow-md">
               <Wifi size={20} />
               <Battery size={20} />
               <Monitor size={20} />
            </div>
        </div>
    );
};

export default LoadingScreen;
