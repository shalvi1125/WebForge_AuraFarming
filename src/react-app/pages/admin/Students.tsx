import { Link } from 'react-router';
import { Users, ArrowLeft } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

export default function AdminStudents() {
  return (
    <div className="min-h-screen bg-gray-50 page-enter">
      <PortalNav portal="Admin Portal" portalColor="text-purple-600" userName="Dr. Rajesh Kumar" avatar="RK" homeHref="/admin/dashboard" />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Student Records</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ l: 'Total Students', v: '4,820' }, { l: 'Active', v: '4,712' }, { l: 'On Leave', v: '86' }, { l: 'New Admissions', v: '124' }].map((s) => (
            <div key={s.l} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><p className="text-xs text-gray-500">{s.l}</p><p className="text-2xl font-extrabold text-indigo-600 mt-1">{s.v}</p></div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Full student directory with search, filters, and bulk operations</p>
        </div>
      </div>
    </div>
  );
}
