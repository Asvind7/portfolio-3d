"use client";

import React, { useEffect, useState, useRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const CustomCursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [isPointer, setIsPointer] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(true); // default hidden until checked
    const rafId = useRef(null);

    useEffect(() => {
        // Detect touch/coarse pointer — skip cursor entirely
        const isTouch = window.matchMedia("(pointer: coarse)").matches;
        setIsTouchDevice(isTouch);
        if (isTouch) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Move inner dot instantly (no RAF overhead per event)
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            }
        };

        // RAF loop only for the trailing ring
        const render = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            }
            rafId.current = requestAnimationFrame(render);
        };
        rafId.current = requestAnimationFrame(render);

        const onMouseOver = (e) => {
            const target = e.target;
            const isClickable =
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                window.getComputedStyle(target).cursor === "pointer";
            setIsPointer(isClickable);
        };

        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("mouseover", onMouseOver);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseover", onMouseOver);
            // Always cancel the RAF loop on cleanup to prevent memory leaks
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, []);

    // Return null immediately for touch devices — no DOM overhead
    if (isTouchDevice) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[99999] mix-blend-difference">
            {/* Trailing ring */}
            <div
                ref={ringRef}
                className="fixed top-0 left-0 flex items-center justify-center will-change-transform"
                style={{ width: 0, height: 0 }}
            >
                <div
                    className={cn(
                        "absolute rounded-full transition-all duration-300 ease-out border-2",
                        isPointer
                            ? "w-[60px] h-[60px] bg-[#10b981] border-[#10b981]"
                            : "w-[40px] h-[40px] border-[#10b981] bg-transparent opacity-60"
                    )}
                />
            </div>

            {/* Inner dot */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 flex items-center justify-center will-change-transform"
                style={{ width: 0, height: 0 }}
            >
                <div
                    className={cn(
                        "absolute rounded-full bg-[#10b981] transition-all duration-200",
                        isPointer ? "w-0 h-0 opacity-0" : "w-1.5 h-1.5 opacity-100"
                    )}
                />
            </div>
        </div>
    );
};

export default CustomCursor;
