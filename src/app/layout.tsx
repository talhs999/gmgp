import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/ui/FloatingButtons";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: {
    default: "GMGP Premium Meats | Quality Australian Butcher Shop",
    template: "%s | GMGP Premium Meats",
  },
  description:
    "Shop premium quality Australian meats online. Beef, Lamb, Chicken, Wagyu & more. Fresh cuts delivered to your door every Saturday.",
  keywords: ["premium meat", "Australian butcher", "online butcher", "wagyu beef", "lamb", "chicken"],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "GMGP Premium Meats",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingButtons />
        </AuthProvider>
      </body>
    </html>
  );
}
