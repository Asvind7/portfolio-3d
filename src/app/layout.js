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
  title: "Asvind V.A | Futuristic Portfolio",
  description: "Futuristic portfolio website of Asvind V.A, Frontend Developer and 3D Artist",
};

import Script from "next/script";
import ClientBackgroundCanvas from "@/components/ClientBackgroundCanvas";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
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
      </head>
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
