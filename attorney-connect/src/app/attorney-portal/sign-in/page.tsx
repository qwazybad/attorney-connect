import { SignIn } from "@clerk/nextjs";
import { Scale } from "lucide-react";
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
      {/* Main panel */}
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

        <div className="flex flex-col items-center w-full max-w-[400px]">
          <div className="mb-8 text-center w-full">
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
                card: "bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl w-full",
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
