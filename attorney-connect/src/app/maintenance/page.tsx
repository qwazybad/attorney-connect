import { Scale } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-30" />
      <div className="orb w-[500px] h-[500px] bg-blue-600/15 top-0 left-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
            <Scale className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            Attorney<span className="text-blue-400">Compete</span>
          </span>
        </div>

        <div className="text-6xl mb-6">🔧</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          We'll Be Right Back
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          AttorneyCompete is currently undergoing scheduled maintenance. We're working hard to improve the platform and will be back shortly.
        </p>
        <div className="glass rounded-2xl px-6 py-4 inline-block">
          <p className="text-blue-300 text-sm font-semibold">
            Questions? Email us at{" "}
            <a href="mailto:support@attorneycompete.com" className="text-blue-400 hover:underline">
              support@attorneycompete.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
