"use client";

import { useState } from "react";
import {
  Users,
  FileCheck,
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import { ATTORNEYS } from "@/lib/data";

type Tab = "overview" | "attorneys" | "cases" | "billing";

const MOCK_CASES = [
  { id: "C001", client: "John Martinez", attorney: "Sarah Chen", area: "Car Accident", status: "Active", value: "$280K est.", submitted: "Mar 20" },
  { id: "C002", client: "Patricia Lee", attorney: "Marcus Williams", area: "Medical Malpractice", status: "Settled", value: "$1.2M", submitted: "Feb 14" },
  { id: "C003", client: "Robert Davis", attorney: "Jennifer Ramirez", area: "Employment", status: "Active", value: "$95K est.", submitted: "Mar 22" },
  { id: "C004", client: "Maria Santos", attorney: "David Park", area: "Slip & Fall", status: "Pending", value: "$60K est.", submitted: "Mar 24" },
  { id: "C005", client: "Thomas Brown", attorney: "Amanda Foster", area: "Product Liability", status: "Settled", value: "$420K", submitted: "Jan 8" },
  { id: "C006", client: "Angela White", attorney: "Lisa Nguyen", area: "Car Accident", status: "Active", value: "$180K est.", submitted: "Mar 19" },
];

const MOCK_INVOICES = [
  { id: "INV-2401", firm: "Chen & Associates", case: "Martinez v. Driver", amount: "$7,000", dueDate: "Apr 15", status: "Pending" },
  { id: "INV-2399", firm: "Williams Law Group", case: "Lee v. Hospital", amount: "$36,000", dueDate: "Mar 30", status: "Paid" },
  { id: "INV-2395", firm: "Ramirez & Partners", case: "Davis v. Corp", amount: "$2,850", dueDate: "Apr 1", status: "Overdue" },
  { id: "INV-2388", firm: "Foster Trial Lawyers", case: "Brown v. Manufacturer", amount: "$12,600", dueDate: "Mar 10", status: "Paid" },
];

const PENDING_ATTORNEYS = [
  { name: "Kevin O'Brien", firm: "O'Brien Law", submitted: "Mar 24", state: "Massachusetts", area: "Personal Injury" },
  { name: "Diana Flores", firm: "Flores Legal Group", submitted: "Mar 23", state: "Colorado", area: "Employment" },
  { name: "James Wu", firm: "Wu & Huang LLP", submitted: "Mar 22", state: "California", area: "Medical Malpractice" },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");

  const statusColor: Record<string, string> = {
    Active: "bg-accent-100 text-accent-600",
    Settled: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Paid: "bg-green-100 text-green-800",
    Overdue: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header bar */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg">LawyerConnect Admin</h1>
          <p className="text-gray-400 text-xs">Internal dashboard · Not visible to consumers</p>
        </div>
        <div className="text-xs text-gray-400">
          Logged in as: <span className="text-white font-medium">admin@lawyerconnect.com</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-8 w-fit">
          {(["overview", "attorneys", "cases", "billing"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`capitalize px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === t ? "bg-accent-500 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="space-y-8">
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Active Attorneys", value: "2,847", change: "+23 this week", color: "text-accent-500", bg: "bg-accent-50" },
                { icon: FileCheck, label: "Total Cases", value: "48,293", change: "+312 this month", color: "text-green-600", bg: "bg-green-50" },
                { icon: DollarSign, label: "Invoiced (MTD)", value: "$284,100", change: "8 pending", color: "text-purple-600", bg: "bg-purple-50" },
                { icon: Clock, label: "Pending Applications", value: "14", change: "3 require action", color: "text-amber-600", bg: "bg-amber-50" },
              ].map(({ icon: Icon, label, value, change, color, bg }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                  <p className="text-xs text-gray-400 mt-1">{change}</p>
                </div>
              ))}
            </div>

            {/* Pending attorney approvals */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h2 className="font-bold text-gray-900">Pending Attorney Approvals</h2>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                    {PENDING_ATTORNEYS.length}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {PENDING_ATTORNEYS.map((att) => (
                  <div key={att.name} className="flex items-center justify-between p-5">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{att.name}</p>
                      <p className="text-xs text-gray-500">{att.firm} · {att.state} · {att.area}</p>
                      <p className="text-xs text-gray-400">Applied {att.submitted}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                        <Eye className="w-3.5 h-3.5" /> Review
                      </button>
                      <button className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue chart placeholder */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Revenue Overview</h2>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { month: "Jan", amount: 48200 },
                  { month: "Feb", amount: 61400 },
                  { month: "Mar", amount: 79800 },
                  { month: "Apr (proj)", amount: 92000 },
                ].map(({ month, amount }) => (
                  <div key={month} className="text-center">
                    <div className="bg-gray-50 rounded-lg p-3 mb-2 flex items-end justify-center" style={{ height: "80px" }}>
                      <div
                        className="w-8 bg-accent-500 rounded-t"
                        style={{ height: `${(amount / 92000) * 60}px` }}
                      />
                    </div>
                    <p className="text-xs font-bold text-gray-900">${(amount / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-gray-400">{month}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ATTORNEYS TAB */}
        {tab === "attorneys" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-3">
              <h2 className="font-bold text-gray-900">Attorney Management</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search attorneys..."
                    className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 w-48"
                  />
                </div>
                <button className="flex items-center gap-1.5 text-xs font-semibold border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
                  <Filter className="w-3.5 h-3.5" /> Filter
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Attorney", "Firm", "Location", "Fee %", "Rating", "Cases", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ATTORNEYS.filter((a) =>
                    search === "" ||
                    a.name.toLowerCase().includes(search.toLowerCase()) ||
                    a.firm.toLowerCase().includes(search.toLowerCase())
                  ).map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{a.name}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.firm}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.city}, {a.state}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-900">{a.feePercent}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">{a.rating}</span>
                        <span className="text-gray-400 text-xs ml-1">({a.reviewCount})</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{a.totalCases}</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button className="text-xs text-accent-500 hover:underline font-medium">View</button>
                          <button className="text-xs text-gray-400 hover:underline">Edit</button>
                          <button className="text-xs text-red-400 hover:underline">Suspend</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CASES TAB */}
        {tab === "cases" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Case Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Case ID", "Client", "Attorney", "Practice Area", "Est. Value", "Status", "Submitted", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_CASES.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{c.client}</td>
                      <td className="px-4 py-3 text-accent-500 font-medium">{c.attorney}</td>
                      <td className="px-4 py-3 text-gray-600">{c.area}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{c.value}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[c.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{c.submitted}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-accent-500 hover:underline font-medium">View</button>
                          {c.status === "Settled" && (
                            <button className="text-xs text-green-600 hover:underline font-medium">Invoice</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BILLING TAB */}
        {tab === "billing" && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Total Invoiced (YTD)", value: "$284,100", color: "text-gray-900" },
                { label: "Collected", value: "$248,600", color: "text-green-600" },
                { label: "Outstanding", value: "$35,500", color: "text-red-500" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</p>
                  <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Invoices table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Invoices</h2>
                <button className="text-xs font-semibold bg-accent-500 text-white px-3 py-1.5 rounded-lg hover:bg-accent-600 transition-colors">
                  + New Invoice
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Invoice #", "Law Firm", "Case", "Amount", "Due Date", "Status", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {MOCK_INVOICES.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{inv.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{inv.firm}</td>
                        <td className="px-4 py-3 text-gray-600">{inv.case}</td>
                        <td className="px-4 py-3 font-bold text-gray-900">{inv.amount}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{inv.dueDate}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[inv.status] ?? "bg-gray-100 text-gray-700"}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="text-xs text-accent-500 hover:underline">View</button>
                            {inv.status === "Pending" && (
                              <button className="text-xs text-green-600 hover:underline">Mark Paid</button>
                            )}
                            {inv.status === "Overdue" && (
                              <button className="text-xs text-red-500 hover:underline">Send Reminder</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
