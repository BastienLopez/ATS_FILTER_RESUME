import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { PageShell } from "@/components/layout/page-shell";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "ATS Filter Resume | Analyse ATS de CV",
  description:
    "Analysez la compatibilite ATS de votre CV, comprenez les blocages et recevez des recommandations concretes.",
  metadataBase: new URL("https://ats-filter-resume.local"),
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "ATS Filter Resume",
    description:
      "Score ATS, correspondance offre d'emploi, risques de rejet automatise et plan d'optimisation priorise.",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-ink)]" suppressHydrationWarning>
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
