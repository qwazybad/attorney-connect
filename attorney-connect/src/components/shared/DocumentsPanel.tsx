"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, FileText, Trash2, Download, Clock, Shield } from "lucide-react";

type Doc = {
  id: string;
  name: string;
  url: string;
  uploaded_by: string;
  created_at: string;
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["pdf"].includes(ext ?? "")) return "PDF";
  if (["doc", "docx"].includes(ext ?? "")) return "DOC";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext ?? "")) return "IMG";
  if (["xls", "xlsx", "csv"].includes(ext ?? "")) return "XLS";
  return "FILE";
}

export function DocumentsPanel({
  attorneyId,
  leadId,
  canUpload = true,
  canDelete = false,
}: {
  attorneyId?: string | null;
  leadId?: string | null;
  canUpload?: boolean;
  canDelete?: boolean;
}) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (leadId) params.set("lead_id", leadId);
    else if (attorneyId) params.set("attorney_id", attorneyId);
    fetch(`/api/documents?${params}`)
      .then((r) => r.json())
      .then((j) => { setDocs(j.data ?? []); setLoading(false); });
  }, [attorneyId, leadId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { setUploadError("File must be under 20MB"); return; }
    setUploadError("");
    setUploading(true);

    const form = new FormData();
    form.append("file", file);
    if (leadId) form.append("lead_id", leadId);
    if (attorneyId) form.append("attorney_id", attorneyId);

    const res = await fetch("/api/documents", { method: "POST", body: form });
    const json = await res.json();
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";

    if (!res.ok) { setUploadError(json.error ?? "Upload failed"); return; }
    setDocs((prev) => [json.data, ...prev]);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setDeletingId(null);
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      {canUpload && (
        <div>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.csv,.txt"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl px-5 py-4 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-all disabled:opacity-50 w-full justify-center"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading…" : "Click to upload a document"}
          </button>
          {uploadError && <p className="text-xs text-red-500 mt-1.5">{uploadError}</p>}
          <p className="text-xs text-gray-400 mt-1.5 text-center">PDF, Word, Excel, images — max 20MB</p>
        </div>
      )}

      {/* Document list */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : docs.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
          <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400 italic">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors group">
              {/* File type badge */}
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-extrabold text-blue-500 tracking-tight">{fileIcon(doc.name)}</span>
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />{fmt(doc.created_at)}
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${doc.uploaded_by === "admin" ? "text-blue-500" : "text-emerald-500"}`}>
                    <Shield className="w-3 h-3" />
                    {doc.uploaded_by === "admin" ? "Sent by AttorneyCompete" : "Uploaded by attorney"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`/api/documents/${doc.id}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                {canDelete && (
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
