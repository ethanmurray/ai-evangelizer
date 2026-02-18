import type { Metadata } from "next";
import { Inter, Special_Elite } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Cult of AI",
  description: "Adjust your tinfoil hat and join us",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const visualTheme = process.env.NEXT_PUBLIC_VISUAL_THEME || "conspiracy-board";

  return (
    <html lang="en" data-visual-theme={visualTheme}>
      <body className={`${inter.variable} ${specialElite.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
