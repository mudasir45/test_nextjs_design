import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeInit } from "@/components/theme-init";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "iMergix — Your entire freelance life, in one place",
  description:
    "Replace 4–6 disconnected tools with a single personal workspace. Goals, tasks, projects, clients, and invoicing — built for freelancers, by a freelancer.",
  openGraph: {
    title: "iMergix — Your entire freelance life, in one place",
    description:
      "All-in-one workspace for solo freelancers, small agencies, and early-stage startups.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeInit>{children}</ThemeInit>
      </body>
    </html>
  );
}
