"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Scale, ArrowLeft, FolderOpen } from "lucide-react";
import { DocumentsPanel } from "@/components/shared/DocumentsPanel";
import type { Attorney } from "@/lib/supabase";

export default function AttorneyDocumentsPage() {
  const { user, isLoaded } = useUser();
  const [attorney, setAttorney] = useState<Attorney | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;
    fetch(`/api/attorney/profile?id=${user.id}`)
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) setAttorney(data as Attorney);
        setLoading(false);
      });
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/attorney-portal" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
              <Scale className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-extrabold text-[17px] tracking-tight text-gray-900 hidden sm:block">
              Attorney<span className="text-blue-500">Compete</span>
            </span>
          </Link>
          <Link href="/attorney-portal" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Documents</h1>
          <p className="text-sm text-gray-500 mt-1">Onboarding agreements, signed contracts, and files shared by AttorneyCompete.</p>
        </div>

        {attorney ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <FolderOpen className="w-5 h-5 text-gray-400" />
              <div>
                <h2 className="text-sm font-bold text-gray-900">All Documents</h2>
                <p className="text-xs text-gray-400 mt-0.5">Files sent to you by AttorneyCompete or uploaded by you.</p>
              </div>
            </div>
            <DocumentsPanel attorneyId={attorney.id} canUpload canDelete={false} />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
            <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No documents yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
