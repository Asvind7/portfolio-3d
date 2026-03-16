"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, Environment, OrbitControls, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";


function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const ACCENT_COLOR = "#10b981";

const Model = ({ mouse, isMobile, isVisible = true, mode = "material", enableControls = false, modelUrl = "/models/scene.glb", textureUrl = null }) => {
    const { scene, animations } = useGLTF(modelUrl);

    // Load texture only when needed
    const texture = useMemo(() => {
        if (!textureUrl) return null;
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin("anonymous");
        const tex = loader.load(textureUrl);
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }, [textureUrl]);

    // Clone and apply material
    const clonedScene = useMemo(() => {
        const clone = SkeletonUtils.clone(scene);
        clone.traverse((child) => {
            if (child.isMesh) {
                if (mode === "wireframe") {
                    child.material = new THREE.MeshStandardMaterial({
                        color: ACCENT_COLOR,
                        wireframe: true,
                        transparent: true,
                        opacity: 0.8,
                    });
                } else if (mode === "clay") {
                    child.material = new THREE.MeshStandardMaterial({
                        color: "#cccccc",
                        roughness: 0.8,
                        metalness: 0.1,
                    });
                } else if (mode === "material" && texture) {
                    child.material = new THREE.MeshStandardMaterial({
                        map: texture,
                        roughness: 0.5,
                        metalness: 0.1,
                    });
                }
            }
        });
        return clone;
    }, [scene, mode, texture]);

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
        if (!mixer) return;

        const handleFinished = (e) => {
            if (e.action.getClip().name === "wave") {
                // blink is already playing as a loop
            }
        };

        mixer.addEventListener("finished", handleFinished);
        return () => {
            mixer.removeEventListener("finished", handleFinished);
        };
    }, [actions]);

    const handleInteraction = React.useCallback(() => {
        if (actions["wave"] && !actions["wave"].isRunning() && isVisible) {
            actions["wave"]
                .reset()
                .setLoop(THREE.LoopOnce)
                .setEffectiveWeight(1)
                .fadeIn(0.3)
                .play();
        }
    }, [actions, isVisible]);

    useFrame(() => {
        if (!isVisible) return;

        const t = performance.now() / 1000;
        if (modelRef.current) {
            if (!enableControls) {
                modelRef.current.position.y = Math.sin(t * 0.5) * 0.04;
                const targetY = -0.3 + mouse.x * 0.2;
                modelRef.current.rotation.y = THREE.MathUtils.lerp(
                    modelRef.current.rotation.y,
                    targetY + Math.sin(t * 0.3) * 0.08,
                    0.05
                );
            }

            // Trigger wave when cursor is near (fullscreen uses cursor, small screen/home uses interval)
            const dist = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
            if (dist < 0.5) {
                handleInteraction();
            }
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={clonedScene}
            scale={isMobile ? 0.8 : 0.5}
            position={[0, 0.2, 0]}
            rotation={[0, -0.3, 0]}
            onPointerDown={handleInteraction}
        />
    );
};

// Adaptive lighting
const Lights = ({ tier }) => (
    <>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={tier === "low" ? 2.0 : 0.5} color="#ffffff" />
        {tier !== "low" && (
            <pointLight position={[-5, 5, -5]} intensity={2.5} color={ACCENT_COLOR} />
        )}
        {tier === "high" && (
            <spotLight position={[2, 10, 8]} angle={0.25} penumbra={1} intensity={1.5} color="#ffffff" />
        )}
    </>
);

const CharacterScene = ({ mode = "material", enableControls = false, modelUrl = "/models/scene.glb", textureUrl = null }) => {
    const mouseRef = useRef({ x: 5, y: 5 });
    const [mouse, setMouse] = useState({ x: 5, y: 5 });
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [autoRotate, setAutoRotate] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef();
    const controlsRef = useRef();
    const tier = "high";

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener("resize", check);

        // Visibility observer - stop when 10% is hidden
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.intersectionRatio >= 0.9),
            { threshold: [0, 0.9] }
        );
        if (containerRef.current) observer.observe(containerRef.current);

        let lastMouseUpdate = 0;
        const onMove = (e) => {
            const now = performance.now();
            if (now - lastMouseUpdate < 32) return; // throttle
            lastMouseUpdate = now;
            setMouse({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            });
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => {
            window.removeEventListener("resize", check);
            window.removeEventListener("mousemove", onMove);
            observer.disconnect();
        };
    }, []);

    const resetCamera = () => {
        if (controlsRef.current) controlsRef.current.reset();
    };

    if (!mounted) return null;

    const camera = isMobile
        ? { position: [0, 1.5, 4.5], fov: 40, lookAt: [0, 0.8, 0] }
        : { position: [0, 0.8, 5.5], fov: 35, lookAt: [0, 0.5, 0] };

    const dpr = tier === "high" ? Math.min(window.devicePixelRatio, 2) : Math.min(window.devicePixelRatio, 1.5);
    const shadowRes = tier === "low" ? 128 : tier === "mid" ? 192 : 256;

    return (
        <div ref={containerRef} className={cn("w-full h-full relative group/scene", enableControls ? "cursor-grab active:cursor-grabbing" : "cursor-default")}>
            {/* Viewer Controls Overlay */}
            {enableControls && (
                <div className="absolute top-6 left-6 z-30 flex flex-col gap-2 transition-opacity duration-300">
                    <button
                        onClick={() => setAutoRotate(!autoRotate)}
                        className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 backdrop-blur-md",
                            autoRotate ? "bg-accent border-accent text-background" : "bg-black/40 border-white/10 text-white/60 hover:border-white/20"
                        )}
                        title="Auto Rotate"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
                            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                        </svg>
                    </button>
                    <button
                        onClick={resetCamera}
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 border border-white/10 text-white/60 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
                        title="Reset Camera"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Interaction Hints */}
            {enableControls && (
                <div className="absolute bottom-24 right-8 z-30 flex flex-col items-end gap-3 opacity-0 group-hover/scene:opacity-100 transition-all duration-500 pointer-events-none">
                    <div className="flex flex-col items-end gap-4">
                        {[
                            { label: "Rotate", hint: "Left Click Drag" },
                            { label: "Pan", hint: "Right Click Drag" },
                            { label: "Zoom", hint: "Scroll Wheel" },
                        ].map(({ label, hint }) => (
                            <div key={label} className="flex flex-col items-end bg-black/20 backdrop-blur-sm p-3 rounded-2xl border border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-1">{label}</span>
                                <span className="text-[11px] font-bold text-white/50 uppercase">{hint}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Canvas
                camera={{ position: camera.position, fov: camera.fov }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "default",
                }}
                dpr={dpr}
                onCreated={({ camera: cam }) => {
                    cam.lookAt(...camera.lookAt);
                }}
            >
                <Suspense fallback={null}>
                    <Lights tier={tier} />
                    <Model
                        mouse={mouse}
                        isMobile={isMobile}
                        isVisible={isVisible} // In this view, typically main character is always visible
                        mode={mode}
                        enableControls={enableControls}
                        modelUrl={modelUrl}
                        textureUrl={textureUrl}
                    />

                    {/* Stage circle — fewer segments on low/mid */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
                        <circleGeometry args={[1.2, tier === "low" ? 24 : 48]} />
                        <meshBasicMaterial color={ACCENT_COLOR} transparent opacity={0.08} />
                    </mesh>

                    <ContactShadows
                        opacity={0.35}
                        scale={tier === "low" ? 6 : 10}
                        blur={tier === "low" ? 1.5 : 2.4}
                        far={0.8}
                        resolution={shadowRes}
                        color={ACCENT_COLOR}
                    />

                    {/* Skip expensive HDR environment on low-end */}
                    {tier !== "low" && <Environment preset="city" />}

                    {enableControls && (
                        <OrbitControls
                            ref={controlsRef}
                            target={camera.lookAt}
                            enablePan={true}
                            enableZoom={true}
                            autoRotate={autoRotate}
                            autoRotateSpeed={2}
                            minPolarAngle={Math.PI / 6}
                            maxPolarAngle={Math.PI / 1.5}
                            makeDefault
                        />
                    )}
                </Suspense>
            </Canvas>
        </div>
    );
};

// Pre-load the model
useGLTF.preload("/models/scene.glb");

export default CharacterScene;
