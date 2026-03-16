import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import CustomCursor from "@/components/CustomCursor";
import ClientProviders from "@/components/ClientProviders";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-accent selection:text-background pb-20 md:pb-0`}
      >
        <BackgroundCanvas />
        <CustomCursor />
        <ClientProviders>
          <Navbar />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
