import type { Metadata } from "next";
import { Inter, Special_Elite } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import { ThemeSyncer } from "@/components/ThemeSyncer";

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

const themeScript = `
(function() {
  try {
    var pref = localStorage.getItem('cult_of_ai_theme_pref');
    var map = { cult: 'conspiracy-board', corporate: 'clean' };
    if (pref && map[pref]) {
      document.documentElement.setAttribute('data-visual-theme', map[pref]);
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const visualTheme = process.env.NEXT_PUBLIC_VISUAL_THEME || "conspiracy-board";

  return (
    <html lang="en" data-visual-theme={visualTheme}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${specialElite.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <ThemeSyncer />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
