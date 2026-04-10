"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, SignIn } from "@clerk/nextjs";
import { CheckCircle, MapPin, Scale, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

type ProfilePreview = {
  id: string;
  name: string | null;
  firm: string | null;
  city: string | null;
  state: string | null;
  practice_areas: string[] | null;
  billing_type: string | null;
  fee_percent: number | null;
  hourly_rate: number | null;
  claimed: boolean;
};

export default function ClaimPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [profile, setProfile] = useState<ProfilePreview | null>(null);
  const [loadError, setLoadError] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimError, setClaimError] = useState("");

  // Load profile preview from token
  useEffect(() => {
    fetch(`/api/claim?token=${token}`)
      .then((r) => r.json())
      .then(({ data, error }) => {
        if (error || !data) setLoadError(error ?? "Invalid link");
        else setProfile(data);
      })
      .catch(() => setLoadError("Failed to load profile"));
  }, [token]);

  // Once user is signed in, auto-claim
  useEffect(() => {
    if (!user || !profile || profile.claimed || claimed || claiming) return;
    handleClaim();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile]);

  async function handleClaim() {
    setClaiming(true); setClaimError("");
    const res = await fetch(`/api/claim?token=${token}`, { method: "POST" });
    const json = await res.json();
    setClaiming(false);
    if (res.ok) {
      setClaimed(true);
      setTimeout(() => router.push("/attorney-portal"), 2500);
    } else if (json.error === "already_claimed") {
      setClaimError("This profile has already been claimed. If this is yours, sign in to your portal.");
    } else if (json.error === "account_exists") {
      setClaimError("Your account is already linked to a different profile. Contact support@attorneycompete.com for help.");
    } else {
      setClaimError(json.error ?? "Something went wrong. Please try again.");
    }
  }

  // ── Loading token ──
  if (!profile && !loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  // ── Invalid token ──
  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link not found</h1>
          <p className="text-gray-500 text-sm mb-6">This claim link is invalid or has expired. Contact us at support@attorneycompete.com if you need help.</p>
          <Link href="/" className="text-blue-500 hover:underline text-sm font-semibold">Go to homepage</Link>
        </div>
      </div>
    );
  }

  // ── Already claimed ──
  if (profile?.claimed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Profile already claimed</h1>
          <p className="text-gray-500 text-sm mb-6">This profile has already been claimed. Sign in to your portal to manage it.</p>
          <Link href="/attorney-portal" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">Go to Portal</Link>
        </div>
      </div>
    );
  }

  // ── Claimed successfully ──
  if (claimed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Profile claimed!</h1>
          <p className="text-gray-500 text-sm mb-2">Redirecting you to your portal…</p>
          <Loader2 className="w-4 h-4 text-blue-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  const feeLabel = profile?.billing_type === "hourly"
    ? `$${profile.hourly_rate}/hr`
    : profile?.billing_type === "contingency"
      ? `${profile.fee_percent}% contingency`
      : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-2xl font-extrabold"><span className="text-gray-900">Attorney</span><span className="text-blue-500">Compete</span></span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Is this your profile?</h1>
          <p className="text-gray-500 text-sm mt-2">Claim it to update your fees, add your photo, and start receiving leads.</p>
        </div>

        {/* Profile preview card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Scale className="w-7 h-7 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-gray-900 text-lg leading-tight">{profile?.name ?? "—"}</p>
              <p className="text-gray-500 text-sm">{profile?.firm ?? "—"}</p>
              {(profile?.city || profile?.state) && (
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <MapPin className="w-3 h-3" />
                  {[profile.city, profile.state].filter(Boolean).join(", ")}
                </p>
              )}
              {feeLabel && (
                <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">
                  {feeLabel}
                </span>
              )}
            </div>
          </div>
          {(profile?.practice_areas?.length ?? 0) > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile!.practice_areas!.slice(0, 5).map((a) => (
                <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
              ))}
              {(profile!.practice_areas!.length > 5) && (
                <span className="text-xs text-gray-400">+{profile!.practice_areas!.length - 5} more</span>
              )}
            </div>
          )}
        </div>

        {/* Auth / claim */}
        {!isLoaded ? (
          <div className="flex justify-center"><Loader2 className="w-5 h-5 text-blue-400 animate-spin" /></div>
        ) : !user ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 text-center">
              <p className="text-sm font-semibold text-blue-800">First time here? Click <span className="underline">Sign up</span> at the bottom of the form.</p>
              <p className="text-xs text-blue-600 mt-0.5">Already have an account? Sign in with your email.</p>
            </div>
            <SignIn
              routing="hash"
              fallbackRedirectUrl={`/claim/${token}`}
              appearance={{ elements: { rootBox: "w-full", card: "shadow-none border-0 rounded-none" } }}
            />
          </div>
        ) : (
          <div className="text-center">
            {claimError ? (
              <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-4">
                <p className="text-sm text-red-600 font-medium">{claimError}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">Signed in as <span className="font-semibold text-gray-700">{user.primaryEmailAddress?.emailAddress}</span></p>
            )}
            {!claimError && (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {claiming ? <><Loader2 className="w-4 h-4 animate-spin" />Claiming…</> : "Yes, this is my profile — Claim it"}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
