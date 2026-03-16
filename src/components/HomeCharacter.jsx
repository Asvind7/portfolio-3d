"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, Environment, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
const ACCENT_COLOR = "#10b981";

// Throttled mouse — 30fps cap to reduce react re-renders
const useThrottledMouse = () => {
    const mouseRef = useRef({ x: 0, y: 0 });
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        let lastUpdate = 0;
        const onMove = (e) => {
            const now = performance.now();
            if (now - lastUpdate < 32) return;
            lastUpdate = now;
            const val = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            };
            mouseRef.current = val;
            setMouse(val);
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    return mouse;
};

const Model = ({ mouse, isMobile, isVisible }) => {
    const { scene, animations } = useGLTF("/models/hero character.glb");

    const clonedScene = useMemo(() => {
        return SkeletonUtils.clone(scene);
    }, [scene]);

    const modelRef = useRef();
    const { actions } = useAnimations(animations, modelRef);

    useEffect(() => {
        if (!actions || !actions["blink"]) return;
        const mixer = actions["blink"].getMixer();

        if (isVisible) {
            actions["blink"].play();
        } else {
            mixer.stopAllAction();
        }
    }, [actions, isVisible]);

    useEffect(() => {
        const mixer = actions["wave"]?.getMixer();
        const handleFinished = (e) => {
            if (e.action.getClip().name === "wave") {
                // blink is already playing as a loop
            }
        };

        mixer?.addEventListener("finished", handleFinished);

        return () => {
            mixer?.removeEventListener("finished", handleFinished);
        };
    }, [actions]);

    const handleWave = React.useCallback(() => {
        if (actions["wave"] && !actions["wave"].isRunning() && isVisible) {
            actions["wave"]
                .reset()
                .setLoop(THREE.LoopOnce)
                .setEffectiveWeight(1)
                .fadeIn(0.3)
                .play();
        }
    }, [actions, isVisible]);

    useEffect(() => {
        if (!isMobile || !isVisible || !actions["wave"]) return;

        // One-time wave after 2 seconds
        const initialTimer = setTimeout(() => {
            if (actions["wave"] && !actions["wave"].isRunning()) {
                handleWave();
            }
        }, 2000);

        // Periodic wave (one full wave every 8 seconds)
        const interval = setInterval(() => {
            if (actions["wave"] && !actions["wave"].isRunning()) {
                handleWave();
            }
        }, 8000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [isMobile, isVisible, actions, handleWave]);

    useFrame(() => {
        if (!isVisible) return;

        const t = performance.now() / 1000;
        if (modelRef.current) {
            modelRef.current.position.y = Math.sin(t * 0.5) * 0.04;
            const targetY = -0.3 + mouse.x * 0.2;
            modelRef.current.rotation.y = THREE.MathUtils.lerp(
                modelRef.current.rotation.y,
                targetY + Math.sin(t * 0.3) * 0.08,
                0.05
            );

            // Trigger wave when cursor is near (within 0.5 distance from center)
            // Skip this on mobile as mouse position defaults to center and causes infinite loops
            if (!isMobile) {
                const dist = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
                // Trigger only when on the right side (mouse.x > 0) and reasonably near
                if (mouse.x > 0 && dist < 0.4) {
                    handleWave();
                }
            }
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={clonedScene}
            scale={isMobile ? 0.8 : 0.5}
            position={isMobile ? [0, 0, 0] : [0, -1.0, 0]}
            rotation={[0, -0.3, 0]}
            onPointerDown={handleWave}
        />
    );
};

// Adaptive lights — fewer on low-end
const Lights = ({ tier }) => (
    <>
        <ambientLight intensity={0.6} />
        <directionalLight position={[0, 5, 5]} intensity={tier === "low" ? 2.0 : 0.8} color="#ffffff" />
        {tier !== "low" && (
            <pointLight position={[-5, 5, -5]} intensity={2.0} color={ACCENT_COLOR} />
        )}
        {tier === "high" && (
            <spotLight position={[2, 10, 8]} angle={0.25} penumbra={1} intensity={1.5} color="#ffffff" />
        )}
    </>
);

const HomeCharacter = () => {
    const mouse = useThrottledMouse();
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const tier = "high";

    const containerRef = useRef();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener("resize", check);

        // Visibility observer
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.intersectionRatio >= 0.9),
            { threshold: [0, 0.9] }
        );
        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            window.removeEventListener("resize", check);
            observer.disconnect();
        };
    }, []);

    if (!mounted) return null;

    const camera = isMobile
        ? { position: [0, 2.7, 3.2], fov: 38, lookAt: [0, 2.7, 0] }
        : { position: [0, 2.5, 5.5], fov: 35, lookAt: [0, 1, 0] };

    // Adaptive DPR: cap at 1.5 for low/mid to ensure character still looks crisp, native for high
    const dpr = tier === "high" ? Math.min(window.devicePixelRatio, 2) : Math.min(window.devicePixelRatio, 1.5);

    // ContactShadows resolution: 128 for low, 192 for mid, 256 for high
    const shadowRes = tier === "low" ? 128 : tier === "mid" ? 192 : 256;

    return (
        <div ref={containerRef} className="w-full h-full relative cursor-default">
            <Canvas
                camera={{ position: camera.position, fov: camera.fov }}
                gl={{
                    antialias: true, // ensure character looks top quality on all devices without jagged edges
                    alpha: true,
                    powerPreference: "default", // removed mediump as it severely degrades material quality on phones
                }}
                dpr={dpr}
                onCreated={({ camera: cam }) => {
                    cam.lookAt(...camera.lookAt);
                }}
            >
                <Suspense fallback={null}>
                    <Lights tier={tier} />
                    <Model mouse={mouse} isMobile={isMobile} isVisible={isVisible} />

                    {/* Stage Shadow / Reflection — reduced segments on low/mid */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
                        <circleGeometry args={[1.2, tier === "low" ? 24 : 48]} />
                        <meshBasicMaterial color={ACCENT_COLOR} transparent opacity={0.08} />
                    </mesh>

                    <ContactShadows
                        opacity={0.35}
                        scale={8}
                        blur={tier === "low" ? 1.5 : 2.4}
                        far={0.8}
                        resolution={shadowRes}
                        color={ACCENT_COLOR}
                    />

                    {/* Skip Environment HDR on low-end — saves ~30MB */}
                    {tier !== "low" && <Environment preset="city" />}
                </Suspense>
            </Canvas>
        </div>
    );
};

// Pre-load the models
useGLTF.preload("/models/hero character.glb");
useGLTF.preload("/models/scene.glb");
useGLTF.preload("/projects/character/astranaut/astranaut.glb");
useGLTF.preload("/projects/character/asvind/asvind.glb");
useGLTF.preload("/projects/character/miles/miles_character.glb");

export default HomeCharacter;
