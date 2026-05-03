import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers/Providers";

export const metadata: Metadata = {
  title: "Leapfrog Connect | Bridging Education & Employment",
  description: "Bridges education and employment in Nepal. Students take courses, earn verified badges, and get hired by companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full antialiased font-main">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
