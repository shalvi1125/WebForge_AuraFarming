// Placeholder – admin dashboard (Phase 2)
import { Link } from 'react-router';
import { BedDouble, Users, FileText } from 'lucide-react';
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-purple-900">HostelIQ – Admin Portal</span>
          <Link to="/" className="text-purple-600 hover:text-purple-800 text-sm">← Home</Link>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Rooms', icon: BedDouble, href: '/admin/rooms' },
          { label: 'Students', icon: Users, href: '/admin/students' },
          { label: 'Reports', icon: FileText, href: '/admin/reports' },
        ].map((item) => (
          <Link key={item.label} to={item.href}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all flex flex-col items-center space-y-3">
            <item.icon className="w-10 h-10 text-purple-500" />
            <span className="font-semibold text-gray-800">{item.label}</span>
            <span className="text-xs text-gray-400">Coming in Phase 2</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
