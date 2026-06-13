import { useState } from 'react';
import { Link } from 'react-router';
import {
  IndianRupee, CreditCard, Clock, CheckCircle2, AlertCircle,
  ArrowLeft, Download, BrainCircuit, TrendingUp, Calendar,
} from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

interface Payment {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
}

const payments: Payment[] = [
  { id: 'PAY-024', description: 'Hostel Fee — Semester 2', amount: 8000, date: '01 May 2025', status: 'paid' },
  { id: 'PAY-021', description: 'Mess Fee — April', amount: 3500, date: '01 Apr 2025', status: 'paid' },
  { id: 'PAY-018', description: 'Hostel Fee — Semester 1', amount: 8000, date: '15 Jan 2025', status: 'paid' },
  { id: 'PAY-027', description: 'Mess Fee — June', amount: 3500, date: 'Due 30 Jun', status: 'pending' },
  { id: 'PAY-028', description: 'Late Fee — May Mess', amount: 1000, date: 'Due 30 Jun', status: 'overdue' },
];

const statusStyles = {
  paid: { label: 'Paid', class: 'bg-green-100 text-green-700' },
  pending: { label: 'Pending', class: 'bg-amber-100 text-amber-700' },
  overdue: { label: 'Overdue', class: 'bg-rose-100 text-rose-700' },
};

const monthlyTrend = [8000, 3500, 0, 8000, 3500, 4500];

export default function StudentFees() {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const totalPaid = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const outstanding = payments.filter((p) => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);
  const maxTrend = Math.max(...monthlyTrend, 1);

  return (
    <div className="min-h-screen bg-gray-50 page-enter">
      <PortalNav
        portal="Fee Management"
        userName="Aryan Sharma"
        userMeta="CS21B047"
        avatar="AS"
        homeHref="/student/dashboard"
        links={[
          { label: 'Dashboard', href: '/student/dashboard' },
          { label: 'Profile', href: '/student/profile' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div>
          <Link to="/student/dashboard" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mb-2 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Fee Management</h1>
          <p className="text-gray-500 text-sm mt-1">Payment history, outstanding dues, and billing timeline</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-indigo-200 text-sm">Total Paid</p>
            <p className="text-3xl font-extrabold mt-1">₹{totalPaid.toLocaleString()}</p>
            <p className="text-indigo-200 text-xs mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 3 payments this semester</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
            <p className="text-gray-500 text-sm">Outstanding</p>
            <p className="text-3xl font-extrabold text-rose-600 mt-1">₹{outstanding.toLocaleString()}</p>
            <p className="text-rose-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Due by 30 Jun 2025</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm">Next Due Date</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">30 Jun</p>
            <p className="text-gray-400 text-xs mt-2 flex items-center gap-1"><Calendar className="w-3 h-3" /> Mess + late fee</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Payment History</h2>
              <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="all">All Time</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div className="divide-y divide-gray-50">
              {payments.map((p) => (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.status === 'paid' ? 'bg-green-50' : 'bg-amber-50'}`}>
                      {p.status === 'paid' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Clock className="w-5 h-5 text-amber-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{p.description}</p>
                      <p className="text-xs text-gray-400">{p.id} · {p.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{p.amount.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[p.status].class}`}>{statusStyles[p.status].label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Fee Analytics</h2>
              <div className="flex items-end gap-2 h-32">
                {monthlyTrend.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-md transition-all" style={{ height: `${(v / maxTrend) * 100}%`, minHeight: v ? '4px' : '2px' }} />
                    <span className="text-[10px] text-gray-400">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-200 transition-shadow">
              <CreditCard className="w-5 h-5" /> Pay ₹{outstanding.toLocaleString()} Now
            </button>

            <button className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Download Receipt
            </button>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
              <BrainCircuit className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-indigo-800">AI Payment Reminder</p>
                <p className="text-xs text-indigo-600 mt-0.5">Pay before 25 Jun to avoid additional late fees. Set up auto-reminder?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
