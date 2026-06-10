import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "DataMind — AI-Powered Business Intelligence",
  description: "Connect your database, ask questions in plain English, get instant insights. No SQL required.",
  keywords: ["business intelligence", "AI", "database", "analytics", "SQL", "data visualization"],
  openGraph: {
    title: "DataMind — AI Business Intelligence",
    description: "Ask questions about your data in plain English",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#060608",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
