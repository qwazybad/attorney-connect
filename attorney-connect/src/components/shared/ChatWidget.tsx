"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Scale, Loader2 } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  matchedIds?: string[];
}

interface AttorneySnippet {
  id: string;
  name: string;
  firm: string;
  state?: string;
  city?: string;
  billing_type: string;
  fee_percent?: number;
  hourly_rate?: number;
  flat_fee?: number;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! Tell me what legal help you need and I'll match you with the right attorney. For example: \"I was in a car accident\" or \"I need help setting up a trust\".",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attorneys, setAttorneys] = useState<Record<string, AttorneySnippet>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchAttorneySnippets(ids: string[]) {
    const missing = ids.filter((id) => !attorneys[id]);
    if (missing.length === 0) return;
    try {
      const res = await fetch(`/api/attorneys?ids=${missing.join(",")}`);
      const { data } = await res.json();
      if (Array.isArray(data)) {
        const map: Record<string, AttorneySnippet> = {};
        data.forEach((a: AttorneySnippet) => { map[a.id] = a; });
        setAttorneys((prev) => ({ ...prev, ...map }));
      }
    } catch {}
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.text ?? "Sorry, I had trouble responding. Please try again.",
        matchedIds: data.matchedIds ?? [],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (data.matchedIds?.length) {
        fetchAttorneySnippets(data.matchedIds);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating button + label */}
      <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 transition-all duration-200 ${open ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"}`}>
        <div className="bg-white text-gray-800 text-xs font-semibold px-3 py-2 rounded-xl shadow-md border border-gray-200 whitespace-nowrap">
          Find Your Attorney
        </div>
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          aria-label="Open legal assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Chat panel */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 ${
          open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
        style={{ height: "520px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-blue-500 rounded-t-2xl">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Legal Match Assistant</p>
            <p className="text-blue-100 text-xs">Powered by AI · Free to use</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[85%] space-y-2">
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Attorney cards */}
                {msg.matchedIds && msg.matchedIds.length > 0 && (
                  <div className="space-y-2">
                    {msg.matchedIds.map((id) => {
                      const a = attorneys[id];
                      if (!a) return null;
                      const fee =
                        a.billing_type === "contingency"
                          ? `${a.fee_percent ?? 33}% contingency`
                          : a.billing_type === "hourly"
                          ? `$${a.hourly_rate}/hr`
                          : `$${a.flat_fee} flat`;
                      const location = [a.city, a.state].filter(Boolean).join(", ");
                      return (
                        <Link
                          key={id}
                          href={`/attorney/${id}`}
                          className="block bg-white border border-gray-200 rounded-xl px-3 py-2.5 hover:border-blue-300 hover:shadow-sm transition-all"
                        >
                          <p className="font-bold text-gray-900 text-sm">{a.name}</p>
                          {a.firm && <p className="text-gray-500 text-xs">{a.firm}</p>}
                          <div className="flex items-center gap-2 mt-1">
                            {location && <span className="text-xs text-gray-400">{location}</span>}
                            <span className="text-xs font-semibold text-blue-600">{fee}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Describe your legal situation..."
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-8 h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
