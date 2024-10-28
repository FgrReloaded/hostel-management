import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import {Lato} from "next/font/google";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"]
})


export const metadata: Metadata = {
  title: "SBP Bhawan",
  description: "SBP Bhawan Hostel Management System",
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
          <Suspense fallback={<span className="loader"></span>}>
            {children}
          </Suspense>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
