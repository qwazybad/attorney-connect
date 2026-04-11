import Link from "next/link";
import { Scale } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-navy-900 flex items-center justify-center">
                <Scale className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="font-extrabold text-[17px] text-navy-900 tracking-tight">
                Attorney<span className="text-accent-500">Compete</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              The transparent legal marketplace where attorneys compete for your case — so you win.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Consumers",
              links: [
                { href: "/compare", label: "Compare Attorneys" },
                { href: "/compare?sort=lowest-fee", label: "Find Low Fees" },
                { href: "/#how-it-works", label: "How It Works" },
              ],
            },
            {
              title: "Attorneys",
              links: [
                { href: "/for-attorneys", label: "Partner With Us" },
                { href: "/join", label: "Apply Now" },
                { href: "/for-attorneys#pricing", label: "Pricing Model" },
                { href: "/attorney-portal/sign-in", label: "Attorney Login" },
              ],
            },
            {
              title: "Practice Areas",
              links: [
                { href: "/compare?area=personal-injury", label: "Personal Injury" },
                { href: "/compare?area=car-accident", label: "Car Accidents" },
                { href: "/compare?area=medical-malpractice", label: "Medical Malpractice" },
                { href: "/compare?area=employment", label: "Employment Law" },
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy-900 hover:translate-x-0.5 transition-all duration-150">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} AttorneyCompete, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            {["Privacy Policy", "Terms of Use", "Attorney Disclaimer"].map((label) => (
              <Link key={label} href="#" className="hover:text-gray-600 transition-colors">{label}</Link>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[11px] text-gray-400 leading-relaxed">
          AttorneyCompete is a legal marketplace, not a law firm. We do not provide legal advice.
          Contacting an attorney through this platform does not create an attorney-client relationship.
          Attorney fees and results shown are representative. Past results do not guarantee future outcomes.
        </p>
      </div>
    </footer>
  );
}
