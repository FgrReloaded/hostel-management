import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { Lato } from "next/font/google";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"]
})


export const metadata: Metadata = {
  title: "SavitriBaiPhule Bhawan",
  description: "Savitribaiphule Bhawan Hostel Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={lato.style}>
        <SessionProvider>
          <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><span className="loader"></span></div>}>
            {children}
          </Suspense>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
