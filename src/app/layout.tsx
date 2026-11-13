import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bghit nekhdem | Scanner d'Offres d'Emploi IA à partir de votre CV",
  description:
    "Bghit nekhdem scanne en temps réel LinkedIn, Rekrute, Emploi.ma et Emploi-Public pour vous proposer uniquement les offres d'emploi adaptées à votre CV.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F4F2EE] dark:bg-[#000000] text-[#191919] dark:text-[#E9E9E9] transition-colors">
        {children}
      </body>
    </html>
  );
}
