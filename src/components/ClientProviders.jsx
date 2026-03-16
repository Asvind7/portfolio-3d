"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";

export default function ClientProviders({ children }) {
    const [mounted, setMounted] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Hydration guard
    if (!mounted) return <div className="bg-[#030712] min-h-screen" />;

    return (
        <>
            {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
            <div 
                className="transition-opacity duration-1000"
                style={{ opacity: loaded ? 1 : 0 }}
            >
                {children}
            </div>
        </>
    );
}
