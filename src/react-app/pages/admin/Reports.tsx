import { Link } from 'react-router';
import { ArrowLeft, BarChart3, Download } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

const reports = [
  { title: 'Monthly Occupancy Report', desc: 'Room utilization across all hostels', date: 'Jun 2025' },
  { title: 'Complaint Resolution Summary', desc: 'Resolution times and department breakdown', date: 'Jun 2025' },
  { title: 'Fee Collection Report', desc: 'Revenue, outstanding dues, and recovery rate', date: 'Jun 2025' },
  { title: 'Leave Analytics', desc: 'Leave patterns and approval metrics', date: 'May 2025' },
];

export default function AdminReports() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav portal="Admin Portal" userName="Dr. Rajesh Kumar" avatar="RK" homeHref="/admin/dashboard" dark
        links={[{ label: 'Campus Map', href: '/student/room?view=admin' }, { label: 'Rooms', href: '/admin/rooms' }, { label: 'Reports', href: '/admin/reports' }]} />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-[#1B4F72] font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <h1 className="text-2xl font-extrabold text-[#071B34]">Reports & Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <div key={r.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#F5F7FA] rounded-xl flex items-center justify-center"><BarChart3 className="w-5 h-5 text-[#1B4F72]" /></div>
                <div>
                  <h3 className="font-semibold text-[#071B34] text-sm">{r.title}</h3>
                  <p className="text-xs text-[#374151] mt-0.5">{r.desc}</p>
                  <p className="text-xs text-[#374151] mt-1">{r.date}</p>
                </div>
              </div>
              <button className="p-2 text-[#1B4F72] hover:bg-[#F5F7FA] rounded-lg"><Download className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
