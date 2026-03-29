import Link from "next/link";
import { Scale } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                <Scale className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="font-extrabold text-[17px] text-white tracking-tight">
                Attorney<span className="text-gradient-blue">Compete</span>
              </span>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
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
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-gray-300 hover:text-white transition-colors duration-150">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-300">
            &copy; {new Date().getFullYear()} AttorneyCompete, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-300">
            {["Privacy Policy", "Terms of Use", "Attorney Disclaimer"].map((label) => (
              <Link key={label} href="#" className="hover:text-gray-400 transition-colors">{label}</Link>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[11px] text-gray-300 leading-relaxed">
          AttorneyCompete is a legal marketplace, not a law firm. We do not provide legal advice.
          Contacting an attorney through this platform does not create an attorney-client relationship.
          Attorney fees and results shown are representative. Past results do not guarantee future outcomes.
        </p>
      </div>
    </footer>
  );
}
