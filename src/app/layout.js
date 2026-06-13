import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
// BackgroundCanvas is dynamically imported below to prevent Three.js from blocking the main thread
import CustomCursor from "@/components/CustomCursor";
import ClientProviders from "@/components/ClientProviders";
import SuppressWarnings from "@/components/SuppressWarnings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://asvind-portfolio-3d-sand.vercel.app"),
  title: "Asvind V.A | Futuristic Portfolio",
  description: "Futuristic portfolio website of Asvind V.A, Frontend Developer and 3D Artist",
  keywords: ["Asvind V.A", "Frontend Developer", "3D Artist", "Blender", "React Three Fiber", "Motion Graphics"],
  authors: [{ name: "Asvind V.A" }],
  creator: "Asvind V.A",
  openGraph: {
    title: "Asvind V.A | Futuristic Portfolio",
    description: "Futuristic portfolio website of Asvind V.A, Frontend Developer and 3D Artist",
    url: "https://asvind-portfolio-3d-sand.vercel.app",
    siteName: "Asvind V.A Portfolio",
    images: [
      {
        url: "/projects/character/miles/miles_thumb.png",
        width: 800,
        height: 600,
        alt: "Asvind V.A Portfolio Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asvind V.A | Futuristic Portfolio",
    description: "Futuristic portfolio website of Asvind V.A, Frontend Developer and 3D Artist",
    images: ["/projects/character/miles/miles_thumb.png"],
  },
};

import Script from "next/script";
import ClientBackgroundCanvas from "@/components/ClientBackgroundCanvas";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-TZYH5NVRQW" 
          strategy="lazyOnload" 
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-TZYH5NVRQW');
          `}
        </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-accent selection:text-background pb-20 md:pb-0`}
      >
        <SuppressWarnings />
        <ClientBackgroundCanvas />
        <CustomCursor />
        <ClientProviders>
          <Navbar />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
