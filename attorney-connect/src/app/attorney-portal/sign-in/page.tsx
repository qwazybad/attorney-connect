import { SignIn } from "@clerk/nextjs";
import { Scale } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Sign In — Attorney Portal",
  description: "Sign in to your AttorneyCompete attorney portal.",
};

export default function AttorneySignInPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-blue animate-glow-pulse w-[500px] h-[500px] -top-32 -left-32 opacity-40" />
      <div className="orb orb-purple animate-glow-pulse w-[400px] h-[400px] bottom-0 right-0 opacity-30" style={{ animationDelay: "1.5s" }} />
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Attorney<span className="text-gradient-blue">Compete</span>
          </span>
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Attorney Portal
          </h1>
          <p className="text-gray-400 text-sm">
            Sign in to manage your profile, leads, and CRM integrations.
          </p>
        </div>

        {/* Clerk SignIn component */}
        <SignIn
          routing="hash"
          forceRedirectUrl="/attorney-portal"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-gray-800 border border-gray-700 shadow-2xl rounded-2xl",
              headerTitle: "text-white font-bold",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton:
                "bg-gray-700 border border-gray-600 text-white hover:bg-gray-600 transition-colors",
              socialButtonsBlockButtonText: "text-white font-medium",
              dividerLine: "bg-gray-600",
              dividerText: "text-gray-400",
              formFieldLabel: "text-gray-300 font-medium text-sm",
              formFieldInput:
                "bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
              formButtonPrimary:
                "bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors",
              footerActionLink: "text-blue-400 hover:text-blue-300",
              identityPreviewText: "text-gray-300",
              identityPreviewEditButton: "text-blue-400",
              alertText: "text-red-400",
              formResendCodeLink: "text-blue-400",
            },
          }}
        />

        <p className="text-gray-500 text-xs text-center">
          Not a partner yet?{" "}
          <Link href="/join" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Apply to join
          </Link>
        </p>
      </div>
    </div>
  );
}
