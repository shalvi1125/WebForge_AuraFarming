import { Link } from 'react-router';
import { BedDouble, Users, BarChart3, AlertCircle, BrainCircuit, Map } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav
        portal="Admin Portal"
        userName="Dr. Rajesh Kumar"
        userMeta="Campus Administrator"
        avatar="RK"
        homeHref="/admin/dashboard"
        dark
        links={[
          { label: 'Campus Map', href: '/student/room' },
          { label: 'Rooms', href: '/admin/rooms' },
          { label: 'Students', href: '/admin/students' },
          { label: 'Reports', href: '/admin/reports' },
        ]}
      />

      <section className="gradient-mesh-hero">
        <div className="gradient-mesh-content max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#4CC9F0] live-indicator" />
            <p className="text-[#4CC9F0] text-xs uppercase tracking-widest font-bold">Campus Overview · Live</p>
          </div>
          <h1 className="text-4xl lg:text-5xl font-semibold text-[#F8FAFC] tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-[#D1DEE6] font-medium">All Hostels · 4,820 students · 176 rooms</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/10">
            {[
              ['4,820', 'Total Students'],
              ['91%', 'Occupancy'],
              ['14', 'Active Complaints'],
              ['₹12.4L', 'Fees Due'],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-bold text-[#F8FAFC]">{v}</p>
                <p className="text-xs text-[#D1DEE6] mt-1 uppercase tracking-wider font-medium">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Rooms', href: '/admin/rooms', icon: BedDouble, desc: 'Occupancy & allocation' },
            { label: 'Students', href: '/admin/students', icon: Users, desc: 'Student records' },
            { label: 'Reports', href: '/admin/reports', icon: BarChart3, desc: 'Analytics & exports' },
            { label: 'Complaints', href: '/warden/complaints', icon: AlertCircle, desc: 'Campus complaint view' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.href}
                className="surface-panel rounded-2xl p-6 elevate-hover flex flex-col gap-3">
                <div className="w-10 h-10 bg-[#F5F7FA] rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#1B4F72]" />
                </div>
                <div>
                  <p className="font-semibold text-[#071B34]">{item.label}</p>
                  <p className="text-xs text-[#374151] mt-0.5">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="surface-panel rounded-2xl p-6 flex items-start gap-3">
          <BrainCircuit className="w-5 h-5 text-[#1B4F72] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#071B34] text-sm">AI Campus Insights</p>
            <p className="text-sm text-[#374151] mt-1">Block B will reach 98% capacity by August. 6 rooms in maintenance queue. Wi-Fi is the top complaint category this week.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
