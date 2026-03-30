"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome =
    pathname?.startsWith("/attorney-portal") ||
    pathname?.startsWith("/join") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/pitch") ||
    pathname?.startsWith("/maintenance");

  return (
    <>
      {!hideChrome && <Header />}
      <main>{children}</main>
      {!hideChrome && <Footer />}
    </>
  );
}
