import type { Metadata } from "next";
import { Inter, Special_Elite } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import { ThemeSyncer } from "@/components/ThemeSyncer";
import { ToastContainer } from "@/components/ui/ToastContainer";

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
    var dark = localStorage.getItem('cult_of_ai_dark_mode');
    var isDark = dark === null ? true : dark === 'true';
    var conspiracy = { cult:1, scifi:1, retro:1, nerdy:1, pirate:1, medieval:1 };
    var visual;
    if (pref === 'noir') {
      visual = isDark ? 'noir' : 'noir-light';
    } else if (conspiracy[pref]) {
      visual = isDark ? 'conspiracy-board' : 'conspiracy-board-light';
    } else if (pref) {
      visual = isDark ? 'clean-dark' : 'clean';
    }
    if (visual) {
      document.documentElement.setAttribute('data-visual-theme', visual);
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
    <html lang="en" data-visual-theme={visualTheme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${specialElite.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <ToastContainer>
              <ThemeSyncer />
              {children}
            </ToastContainer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
