import Footer from "@/components/Footer";
import HeaderNav from "@/components/HeaderNav";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tigerkennhomes.com"),
  keywords: [
    "TigerKenn Homes",
    "TigerKennhomes",
    "TigerKenn",
    "Tiger kenn",
    "Tiger kenn homes",
    "homes",
    "affordable houses",
    "Best real estate consultant",
    "Luxury homes for sale",
    "Affordable real estate listings",
    "Buy homes in Nigeria",
    "Buy homes in Enugu",
    "Buy homes in Anambra",
    "Buy homes in Imo",
    "Buy homes in Ebonyi",
    "Buy homes in Abia",
    "buy properties",
    "Estate consultant",
    "Residential properties",
    "Modern homes for sale",
    "Real estate investment opportunities",
    "Luxury home listings",
    "Property management services",
    "Real estate agents near me",
    "Home buying tips",
    "Sell your home fast",
    "New construction homes",
    "Family homes for sale",
    "Apartments for rent",
    "Property for sale near me",
    "Affordable housing solutions",
    "Luxury real estate",
    "High-end homes",
    "Real estate services",
  ],
  title: {
    default: "Tigerkenn Homes",
    template: "%s | Tigerkenn Homes",
  },
  description:
    "We are dedicated to providing comprehensive solutions for all your housing and construction needs.",
  openGraph: {
    title: "Tigerkenn Homes | Founded on the principles of integrity, quality and innovation.",
    description:
      "We are dedicated to providing comprehensive solutions for all your housing and construction needs.",
    type: "website",
    locale: "en_US",
    url: "https://tigerkennhomes.com/",
    siteName: "Tigerkenn Homes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange>
          <HeaderNav />
          <main>{children}</main>
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
