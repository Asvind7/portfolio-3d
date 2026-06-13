"use client";

import dynamic from "next/dynamic";

const BackgroundCanvas = dynamic(() => import("./BackgroundCanvas"), { ssr: false });

export default function ClientBackgroundCanvas() {
    return <BackgroundCanvas />;
}
