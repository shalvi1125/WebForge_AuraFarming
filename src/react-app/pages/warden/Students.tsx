import { Link } from 'react-router';
import { Users, ArrowLeft, Search, BrainCircuit } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

const students = [
  { name: 'Aryan Sharma', roll: 'CS21B047', room: '204', year: '3rd', status: 'Active' },
  { name: 'Rohit Verma', roll: 'EC21B032', room: '211', year: '3rd', status: 'Active' },
  { name: 'Sneha Patil', roll: 'ME21B018', room: '208', year: '2nd', status: 'On Leave' },
  { name: 'Karan Joshi', roll: 'CS21B051', room: '215', year: '3rd', status: 'Active' },
  { name: 'Priya Singh', roll: 'IT21B029', room: '202', year: '2nd', status: 'Active' },
];

export default function WardenStudents() {
  return (
    <div className="min-h-screen bg-gray-50 page-enter">
      <PortalNav portal="Warden Portal" portalColor="text-emerald-600" userName="Dr. Priya Mehta" userMeta="Tagore Hostel" avatar="PM" homeHref="/warden/dashboard" />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/warden/dashboard" className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Students</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input placeholder="Search students..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase"><th className="px-6 py-3">Name</th><th className="px-6 py-3">Roll No</th><th className="px-6 py-3">Room</th><th className="px-6 py-3">Year</th><th className="px-6 py-3">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((s) => (
                <tr key={s.roll} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{s.name}</td>
                  <td className="px-6 py-4 text-gray-500">{s.roll}</td>
                  <td className="px-6 py-4">{s.room}</td>
                  <td className="px-6 py-4">{s.year}</td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-start gap-3 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <BrainCircuit className="w-5 h-5 text-indigo-600 shrink-0" />
          <p className="text-sm text-indigo-700">AI Insight: 3 students have overlapping leave requests for 14–17 Jun. Review capacity impact.</p>
        </div>
      </div>
    </div>
  );
}
