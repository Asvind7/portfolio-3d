"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";
const ACCENT_COLOR = "#10b981";

// Throttled mouse state — only update every 32ms to reduce React renders
const useThrottledMouse = () => {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    useEffect(() => {
        let lastUpdate = 0;
        const handleMouseMove = (event) => {
            const now = performance.now();
            if (now - lastUpdate < 32) return; // ~30fps throttle
            lastUpdate = now;
            setMouse({
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1,
            });
        };
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);
    return mouse;
};

// Per instance: uses ref-based animation instead of React state for better perf
const InstanceItem = ({ position, rotation, scale, speed, mouse }) => {
    const ref = useRef();
    const initialPos = useRef(new THREE.Vector3(...position));

    useFrame(() => {
        const t = performance.now() / 1000;
        const idleX = Math.sin(t * speed) * 1.5;
        const idleY = Math.cos(t * speed) * 1.5;

        const targetX = initialPos.current.x + idleX;
        const targetY = initialPos.current.y + idleY;

        const mx = mouse.x * 35;
        const my = mouse.y * 25;

        const dx = targetX - mx;
        const dy = targetY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let interactionX = 0;
        let interactionY = 0;

        const threshold = 3.0;
        if (dist < threshold) {
            const power = (1 - dist / threshold) * 6;
            interactionX = (dx / dist) * power;
            interactionY = (dy / dist) * power;
        }

        ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX + interactionX, 0.08);
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY + interactionY, 0.08);
        ref.current.rotation.x += 0.004;
        ref.current.rotation.y += 0.004;
    });

    return (
        <Instance
            ref={ref}
            position={position}
            rotation={rotation}
            scale={scale}
        />
    );
};

// Adaptive particle layer — counts change based on device tier
const InteractiveMeshLayer = ({ tier }) => {
    // low: 80 particles, mid: 180, high: 350
    const count = tier === "low" ? 80 : tier === "mid" ? 180 : 350;
    const range = 50;
    const mouse = useThrottledMouse();

    const particles = useMemo(() => {
        return Array.from({ length: count }, () => ({
            position: [
                THREE.MathUtils.randFloatSpread(range),
                THREE.MathUtils.randFloatSpread(range),
                THREE.MathUtils.randFloatSpread(10),
            ],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
            scale: Math.random() * 0.1 + 0.05,
            speed: Math.random() * 0.4 + 0.1,
        }));
    }, [count]);

    return (
        <Instances range={count}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                color={ACCENT_COLOR}
                wireframe
                transparent
                opacity={0.08}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
            {particles.map((data, i) => (
                <InstanceItem key={i} {...data} mouse={mouse} />
            ))}
        </Instances>
    );
};

// Static CSS-only background for low-end devices (no WebGL)
const StaticBackground = ({ isDark }) => (
    <div className="fixed inset-0 -z-30 pointer-events-none" style={{ backgroundColor: "var(--background)" }}>
        <div
            className="absolute inset-0"
            style={{
                background: isDark
                    ? "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.05) 0%, transparent 50%)"
                    : "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.04) 0%, transparent 60%)",
            }}
        />
    </div>
);

const BackgroundCanvas = () => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const tier = "high"; // Reverted optimization: hardcoded to high

    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="fixed inset-0 -z-30 bg-[#030816]" />;

    const isDark = resolvedTheme === "dark";

    // On low-end devices skip WebGL background entirely — saves ~80MB RAM
    if (tier === "low") {
        return <StaticBackground isDark={isDark} />;
    }

    // Anti-alias only on high-tier devices
    const glSettings = {
        antialias: tier === "high",
        alpha: false,
        powerPreference: "default",
        // Limit pixel ratio to max 1.5 to reduce GPU fill-rate
        ...(tier === "mid" && { precision: "mediump" }),
    };

    return (
        <div className="fixed inset-0 -z-30 pointer-events-none" style={{ backgroundColor: "var(--background)" }}>
            <div
                className="absolute inset-0 transition-opacity duration-1000"
                style={{
                    opacity: isDark ? 0.6 : 0.15,
                    background: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(52,211,153,0.08) 0%, transparent 50%)",
                }}
            />

            <Canvas
                camera={{ position: [0, 0, 25], fov: 45 }}
                gl={glSettings}
                dpr={Math.min(window.devicePixelRatio, tier === "mid" ? 1.0 : 1.5)}
                frameloop="always"
            >
                <fog attach="fog" args={[isDark ? "#030816" : "#ffffff", 25, 50]} />
                <ambientLight intensity={isDark ? 1.0 : 2.0} />
                {tier === "high" && <pointLight position={[10, 10, 10]} intensity={1.5} color={ACCENT_COLOR} />}
                <InteractiveMeshLayer tier={tier} />
            </Canvas>
        </div>
    );
};

export default BackgroundCanvas;
