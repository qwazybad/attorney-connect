"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/attorney-portal");

  return (
    <>
      {!isPortal && <Header />}
      <main>{children}</main>
      {!isPortal && <Footer />}
    </>
  );
}
