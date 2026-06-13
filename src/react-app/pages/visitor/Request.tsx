import { useState } from 'react';
import { Link } from 'react-router';
import {
  UserCheck, QrCode, Clock, CheckCircle2, Shield, ArrowLeft,
  Plus, BrainCircuit, Users, Calendar, Download, Eye,
} from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

interface Visitor {
  id: string;
  name: string;
  relation: string;
  date: string;
  time: string;
  status: 'approved' | 'pending' | 'completed';
  passId?: string;
}

const visitors: Visitor[] = [
  { id: 'V-042', name: 'Rahul Sharma', relation: 'Brother', date: '14 Jun', time: '2:00 PM', status: 'approved', passId: 'HQ-2025-042' },
  { id: 'V-039', name: 'Mrs. Sunita Sharma', relation: 'Mother', date: '08 Jun', time: '10:00 AM', status: 'completed', passId: 'HQ-2025-039' },
  { id: 'V-041', name: 'Amit Patel', relation: 'Friend', date: '16 Jun', time: '4:00 PM', status: 'pending' },
];

const statusStyles = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-gray-100 text-gray-600',
};

export default function VisitorRequest() {
  const [showForm, setShowForm] = useState(false);
  const [showPass, setShowPass] = useState<string | null>('HQ-2025-042');

  return (
    <div className="min-h-screen bg-gray-50 page-enter">
      <PortalNav
        portal="Visitor Management"
        userName="Aryan Sharma"
        userMeta="Room 204 · Block B"
        avatar="AS"
        homeHref="/student/dashboard"
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link to="/student/dashboard" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mb-2 font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900">Visitor Management</h1>
            <p className="text-gray-500 text-sm mt-1">Register visitors, generate QR passes, and track visit history</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md">
            <Plus className="w-4 h-4" /> New Visitor Request
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'This Month', value: '3', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Approved', value: '2', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pending', value: '1', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Security Score', value: '100%', icon: Shield, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                  </div>
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg p-6 animate-fade-up">
            <h2 className="font-semibold text-gray-800 mb-4">Register Visitor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Visitor Name', 'Relation', 'Visit Date', 'Expected Time', 'Phone Number', 'Purpose'].map((label) => (
                <div key={label}>
                  <label className="text-xs text-gray-500 font-medium">{label}</label>
                  <input type={label.includes('Date') ? 'date' : label.includes('Time') ? 'time' : 'text'}
                    className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none" />
                </div>
              ))}
            </div>
            <button className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold">Submit Request</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Visitor History</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {visitors.map((v) => (
                <div key={v.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{v.name}</p>
                      <p className="text-xs text-gray-400">{v.id} · {v.relation} · {v.date} at {v.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[v.status]}`}>{v.status}</span>
                    {v.passId && (
                      <button onClick={() => setShowPass(v.passId!)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {showPass && (
              <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-xl overflow-hidden animate-fade-up">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-4 text-center">
                  <p className="text-indigo-200 text-xs">HostelIQ Visitor Pass</p>
                  <p className="text-white font-bold text-lg">{showPass}</p>
                </div>
                <div className="p-6 flex flex-col items-center">
                  <div className="w-40 h-40 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 mb-4">
                    <QrCode className="w-24 h-24 text-gray-800" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">Rahul Sharma</p>
                  <p className="text-xs text-gray-500">Visiting: Aryan Sharma · Room 204</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> 14 Jun 2025 · 2:00 PM</p>
                  <button className="mt-4 flex items-center gap-2 text-indigo-600 text-sm font-medium hover:text-indigo-800">
                    <Download className="w-4 h-4" /> Download Pass
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" /> Security Dashboard
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Today's Visitors</span><span className="font-medium">2</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Active Passes</span><span className="font-medium text-green-600">1</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Gate Status</span><span className="font-medium text-green-600">Secure</span></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <p className="text-white font-semibold text-sm">AI Visit Analytics</p>
              </div>
              <p className="text-indigo-200 text-xs">Peak visitor hours: 2–5 PM on weekends. Pre-register 24h ahead for faster gate clearance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
