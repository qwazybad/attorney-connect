import { SignUp } from "@clerk/nextjs";
import { Scale } from "lucide-react";
import Link from "next/link";
import ParticleNetwork from "@/components/shared/ParticleNetwork";

export const metadata = {
  title: "Sign Up — Attorney Portal",
  description: "Create your AttorneyCompete attorney account.",
};

export default function AttorneySignUpPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <ParticleNetwork />
      <div className="orb orb-blue animate-glow-pulse w-[500px] h-[500px] -top-32 -left-32 opacity-60" />
      <div className="orb orb-purple animate-glow-pulse w-[400px] h-[400px] bottom-0 right-0 opacity-50" style={{ animationDelay: "1.5s" }} />
      <div className="absolute inset-0 dot-grid opacity-40" />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
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
            Create Your Account
          </h1>
          <p className="text-gray-400 text-sm">
            Set up your attorney portal to manage leads and CRM integrations.
          </p>
        </div>

        <SignUp
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
              alertText: "text-red-400",
            },
          }}
        />

        <p className="text-gray-500 text-xs text-center">
          Already have an account?{" "}
          <Link href="/attorney-portal/sign-in" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
