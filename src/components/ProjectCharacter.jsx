"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, Environment, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

const ACCENT_COLOR = "#10b981";

const SceneModel = ({
    isVisible = true,
    position = [0, 0, 0],
    scale = 1,
    activeCategory,
    mouse,
    isMobile,
    isHovered,
    interactionTrigger
}) => {
    const { scene, animations } = useGLTF("/models/scene.glb");
    const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const modelRef = useRef();
    const groupRef = useRef();
    const { actions } = useAnimations(animations, modelRef);

    // Activity Tracking
    const [isSceneActive, setIsSceneActive] = useState(false);
    const activityTimeout = useRef(null);
    const hasStartupTriggered = useRef(false);

    // 1. Foundation & Startup Effect
    useEffect(() => {
        if (!actions || !isVisible) return;
        
        // Persistent idle pose (foundation)
        if (actions["nil"]) {
            actions["nil"].setLoop(THREE.LoopRepeat, Infinity).play();
        }

        // MOBILE STARTUP: Play rotate and 3d ONCE then stay on nil
        if (isMobile && !hasStartupTriggered.current) {
            hasStartupTriggered.current = true;
            if (actions["rotate"]) {
                actions["rotate"].reset().setLoop(THREE.LoopOnce).play();
            }
            if (actions["3d"]) {
                actions["3d"].reset().setLoop(THREE.LoopOnce).play();
            }
        }

        // Stop baked_animation which was the previous default
        if (actions["baked_animation"]) actions["baked_animation"].fadeOut(0.5);
    }, [actions, isMobile, isVisible]);

    // 2. DESKTOP ONLY INTERACTION: Move & Touch
    // Disabled on phone as per user request
    useEffect(() => {
        if (!actions || !isVisible || isMobile) return;
        
        // On desktop, we only trigger if hovered
        if (!isHovered) return;

        const rotateAnim = actions["rotate"];
        const d3Anim = actions["3d"];

        setIsSceneActive(true);
        if (rotateAnim) {
            if (!rotateAnim.isRunning()) rotateAnim.reset();
            rotateAnim.setLoop(THREE.LoopRepeat, Infinity).setEffectiveWeight(1).fadeIn(0.4).play();
        }
        if (d3Anim) {
            if (!d3Anim.isRunning()) d3Anim.reset();
            d3Anim.setLoop(THREE.LoopRepeat, Infinity).setEffectiveWeight(1).fadeIn(0.4).play();
        }

        if (activityTimeout.current) clearTimeout(activityTimeout.current);
        activityTimeout.current = setTimeout(() => {
            setIsSceneActive(false);
            if (rotateAnim) rotateAnim.fadeOut(1.2);
            if (d3Anim) d3Anim.fadeOut(1.2);
        }, 1500);

        return () => {
            if (activityTimeout.current) clearTimeout(activityTimeout.current);
        };
    }, [actions, mouse, interactionTrigger, isHovered, isMobile, isVisible]);

    // Handle desktop-only fade out on leave
    useEffect(() => {
        if (!actions || isMobile) return;
        if (!isHovered) {
            setIsSceneActive(false);
            if (actions["rotate"]) actions["rotate"].fadeOut(0.8);
            if (actions["3d"]) actions["3d"].fadeOut(0.8);
        }
    }, [actions, isHovered, isMobile]);

    // 3. Category Triggers (Stays active on both)
    useEffect(() => {
        if (!actions || !isVisible || !activeCategory) return;
        
        const name = activeCategory.id === "3d" ? "3dart" : activeCategory.id === "motion" ? "3dart1" : null;
        if (name && actions[name]) {
            actions[name].reset().setLoop(THREE.LoopOnce).fadeIn(0.3).play();
        }
    }, [actions, activeCategory, isVisible]);

    useFrame((state) => {
        if (!isVisible) return;
        const t = state.clock.getElapsedTime();
        
        if (modelRef.current) {
            modelRef.current.position.y = position[1] + Math.sin(t * 0.4) * 0.03;
            modelRef.current.position.x = position[0];
            modelRef.current.position.z = position[2];
            
            const baseRotation = Math.PI - 0.3;
            const lookAtStrength = (isHovered || isSceneActive) ? 0.25 : 0.05;
            const targetRotationY = baseRotation + (mouse.x * lookAtStrength);
            modelRef.current.rotation.y = THREE.MathUtils.lerp(
                modelRef.current.rotation.y,
                targetRotationY,
                0.1
            );

            const targetRotationX = mouse.y * 0.05;
            modelRef.current.rotation.x = THREE.MathUtils.lerp(
                modelRef.current.rotation.x,
                targetRotationX,
                0.1
            );
        }

        if (groupRef.current) {
            const tiltAmount = isSceneActive ? 0.08 : 0;
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, tiltAmount, 0.05);
        }
    });

    return (
        <group ref={groupRef}>
            <primitive ref={modelRef} object={clonedScene} scale={scale} position={position} />
        </group>
    );
};

const ProjectCharacter = ({ activeCategory }) => {
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef();
    const [isVisible, setIsVisible] = useState(true);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [interactionTrigger, setInteractionTrigger] = useState(0);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);

        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
        if (containerRef.current) observer.observe(containerRef.current);
        
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            setMouse({ x, y });
        };
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", checkMobile);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleInteraction = () => {
        setInteractionTrigger(Date.now());
    };

    if (!mounted) return null;

    return (
        <div 
            ref={containerRef} 
            className="w-full h-full relative flex items-center justify-center cursor-pointer touch-none"
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
            onPointerDown={handleInteraction}
        >
            <Canvas camera={{ fov: 25, position: [15, 12, 15], near: 0.1, far: 1000 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} dpr={[1, 2]} onCreated={({ camera }) => camera.lookAt(0, 0, 0)}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
                    <pointLight position={[-10, 5, -10]} intensity={2} color={ACCENT_COLOR} />
                    <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
                    
                    <SceneModel 
                        isVisible={isVisible} 
                        position={[-3.5, -3.2, 0]} 
                        scale={1.25} 
                        activeCategory={activeCategory} 
                        mouse={mouse} 
                        isMobile={isMobile} 
                        isHovered={isHovered}
                        interactionTrigger={interactionTrigger}
                    />
                    
                    <ContactShadows opacity={0.4} scale={12} blur={2.8} far={1.5} resolution={256} color={ACCENT_COLOR} />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
};

useGLTF.preload("/models/scene.glb");
export default ProjectCharacter;
