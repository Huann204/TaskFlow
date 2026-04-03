import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "TaskFlow AI — Work smarter, not harder",
  description:
    "TaskFlow AI is an AI-powered task and productivity management platform. Auto-generate tasks, get smart deadline suggestions, and track your productivity with beautiful analytics.",
  openGraph: {
    title: "TaskFlow AI — Work smarter, not harder",
    description:
      "AI-powered productivity platform for students, freelancers, and startup teams.",
    type: "website",
    siteName: "TaskFlow AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} dark`}>
      <body className="font-sans bg-[#0A0A0F] text-[#F8FAFC] antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
