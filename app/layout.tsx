import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistem Manajemen Servis Kendaraan - BKN",
  description: "Sistem Manajemen Servis Kendaraan Operasional PusbangSDM BKN",
  icons: {
    icon: "/logo-bkn.png",
    apple: "/logo-bkn.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}
      >
        {children}
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  );
}
