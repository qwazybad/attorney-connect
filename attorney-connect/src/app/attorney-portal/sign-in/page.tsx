import { SignIn } from "@clerk/nextjs";
import { Scale, Shield, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Sign In — Attorney Portal",
  description: "Sign in to your AttorneyCompete attorney portal.",
};

export default function AttorneySignInPage() {
  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      style={{ background: "linear-gradient(135deg, #EAF0FB 0%, #F0EEF8 40%, #F5F0EC 100%)" }}
    >
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-gray-900 p-12 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-20" />
        <div className="orb w-[400px] h-[400px] bg-blue-600/20 -top-20 -left-20" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Attorney<span className="text-blue-400">Compete</span>
            </span>
          </Link>

          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug mb-4">
            Your portal.<br />Your leads.<br />Your practice.
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed mb-10">
            Manage your profile, respond to leads, and track your ranking — all from one place.
          </p>

          <div className="space-y-4">
            {[
              { icon: Shield, text: "Bar-verified attorney profile" },
              { icon: CheckCircle, text: "Real-time lead notifications" },
              { icon: Lock, text: "Founding rate locked in your account" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-gray-100 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-gray-600 text-xs">
          © {new Date().getFullYear()} AttorneyCompete
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Mobile logo */}
        <Link href="/" className="flex lg:hidden items-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-gray-900">
            Attorney<span className="text-blue-500">Compete</span>
          </span>
        </Link>

        <div className="flex flex-col items-center w-full max-w-md">
          <div className="mb-8 text-center w-full max-w-[400px]">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
              Attorney Portal
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to manage your profile and leads.
            </p>
          </div>

          <SignIn
            routing="hash"
            fallbackRedirectUrl="/attorney-portal"
            signUpUrl="/join"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl",
                headerTitle: "text-gray-900 font-bold",
                headerSubtitle: "text-gray-500",
                socialButtonsBlockButton:
                  "bg-gray-50 border border-gray-200 text-gray-800 hover:bg-gray-100 transition-colors",
                socialButtonsBlockButtonText: "text-gray-800 font-medium",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-400",
                formFieldLabel: "text-gray-700 font-medium text-sm",
                formFieldInput:
                  "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                formButtonPrimary:
                  "bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors",
                footerActionLink: "text-blue-500 hover:text-blue-600",
                identityPreviewText: "text-gray-700",
                identityPreviewEditButton: "text-blue-500",
                alertText: "text-red-500",
                formResendCodeLink: "text-blue-500",
              },
            }}
          />

          <p className="text-gray-500 text-xs text-center mt-6">
            Not a partner yet?{" "}
            <Link href="/join" className="text-blue-500 hover:text-blue-600 font-semibold transition-colors">
              Apply to join
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
