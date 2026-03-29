import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "LawyerConnect — When Attorneys Compete, You Win",
    template: "%s | LawyerConnect",
  },
  description:
    "Compare attorney fees, ratings, and results. The transparent legal marketplace where attorneys compete for your case — saving you thousands.",
  keywords: ["attorney", "lawyer", "legal marketplace", "compare attorneys", "contingency fee", "personal injury lawyer"],
  openGraph: {
    title: "LawyerConnect — When Attorneys Compete, You Win",
    description: "Compare attorney fees, ratings, and results. The transparent legal marketplace.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
