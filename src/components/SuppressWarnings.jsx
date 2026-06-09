"use client";

import { useEffect } from "react";

export default function SuppressWarnings() {
    useEffect(() => {
        const originalWarn = console.warn;
        console.warn = (...args) => {
            // Suppress THREE.Clock deprecation — caused by @react-three/fiber internals,
            // harmless and not shown in production builds.
            if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
            originalWarn.apply(console, args);
        };
        return () => {
            console.warn = originalWarn;
        };
    }, []);
    return null;
}
