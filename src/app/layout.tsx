import type { Metadata } from "next";
import { Cormorant_Garamond, Google_Sans_Flex } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Google Sans Flex - fonte oficial do Google (open source)
const googleSans = Google_Sans_Flex({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "WF Semijoias | Semijoias Artesanais Premium",
    template: "%s | WF Semijoias",
  },
  description:
    "Semijoias artesanais feitas à mão com pedras brasileiras premium. Design exclusivo para mulheres empoderadas. Qualidade e sofisticação em cada peça.",
  icons: {
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
  keywords: [
    "semijoias",
    "joias artesanais",
    "pedras brasileiras",
    "brincos",
    "colares",
    "anéis",
    "pulseiras",
    "joias premium",
    "presente feminino",
  ],
  authors: [{ name: "WF Semijoias" }],
  creator: "WF Semijoias",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "WF Semijoias",
    title: "WF Semijoias | Semijoias Artesanais Premium",
    description:
      "Semijoias artesanais feitas à mão com pedras brasileiras premium.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WF Semijoias | Semijoias Artesanais Premium",
    description:
      "Semijoias artesanais feitas à mão com pedras brasileiras premium.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${googleSans.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
