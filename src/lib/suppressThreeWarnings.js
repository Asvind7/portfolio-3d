// Suppress known @react-three/fiber / Three.js dev warnings at module-evaluation
// time — must run BEFORE any Canvas is mounted (not inside a React hook).
if (typeof window !== "undefined" && !window.__threeWarnSuppressed) {
    window.__threeWarnSuppressed = true;
    const _orig = console.warn;
    console.warn = (...args) => {
        const msg = typeof args[0] === "string" ? args[0] : "";
        // THREE.Clock deprecated in r168+ — harmless, caused by r3f internals
        if (msg.includes("THREE.Clock")) return;
        // WebGL context loss is logged by Three.js; we handle recovery ourselves
        if (msg.includes("Context Lost")) return;
        _orig.apply(console, args);
    };
}

/**
 * Call inside Canvas `onCreated` to enable automatic WebGL context recovery.
 * Calling e.preventDefault() on contextlost tells the browser we want
 * the context restored, which fires the contextrestored event afterward.
 *
 * @param {import('@react-three/fiber').RootState} state - r3f root state
 */
export function handleContextLoss(state) {
    const canvas = state.gl.domElement;
    canvas.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
    });
    canvas.addEventListener("webglcontextrestored", () => {
        state.gl.setSize(state.size.width, state.size.height);
    });
}
