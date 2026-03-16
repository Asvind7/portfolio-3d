"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from "@react-three/drei";

const MODEL_CONFIGS = {
    astranaut: {
        url: "/projects/character/astranaut.glb",
        cameraPos: [0, 1.2, 3.5],
        target: [0, 0.8, 0],
        scale: 1,
    },
    asvind: {
        url: "/projects/character/asvind.glb",
        cameraPos: [0, 1.2, 3.5],
        target: [0, 0.8, 0],
        scale: 1,
    },
    miles: {
        url: "/projects/character/miles_character.glb",
        cameraPos: [0, 1.2, 3.5],
        target: [0, 0.8, 0],
        scale: 1,
    },
};

function Model({ url, scale }) {
    const { scene } = useGLTF(url);
    return (
        <Center>
            <primitive object={scene} scale={scale} />
        </Center>
    );
}

function SceneContent({ modelKey }) {
    const config = MODEL_CONFIGS[modelKey] || MODEL_CONFIGS.astranaut;

    return (
        <>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#00FFA8" />
            <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" />
            <Environment preset="city" />
            <Suspense fallback={null}>
                <Model url={config.url} scale={config.scale} />
            </Suspense>
            <ContactShadows
                position={[0, -1.5, 0]}
                opacity={0.4}
                scale={10}
                blur={2}
                far={4}
            />
            <OrbitControls
                target={config.target}
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
            />
        </>
    );
}

function CapturePageInner() {
    const searchParams = useSearchParams();
    const modelKey = searchParams.get("model") || "astranaut";
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Signal that the scene is set up after a delay for model loading
        const timer = setTimeout(() => {
            setReady(true);
            window.__MODEL_READY__ = true;
        }, 4000);
        return () => clearTimeout(timer);
    }, [modelKey]);

    return (
        <div
            id="capture-root"
            style={{
                width: "800px",
                height: "800px",
                background: "transparent",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Canvas
                id="model-canvas"
                camera={{
                    position: MODEL_CONFIGS[modelKey]?.cameraPos || [0, 1.2, 3.5],
                    fov: 45,
                    near: 0.1,
                    far: 100,
                }}
                gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
                style={{ width: "800px", height: "800px", background: "transparent" }}
            >
                <SceneContent modelKey={modelKey} />
            </Canvas>
            {ready && (
                <div
                    id="ready-signal"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "1px",
                        height: "1px",
                        opacity: 0,
                    }}
                />
            )}
        </div>
    );
}

export default function CapturePage() {
    return (
        <Suspense fallback={<div style={{ width: 800, height: 800, background: "#000" }} />}>
            <CapturePageInner />
        </Suspense>
    );
}
