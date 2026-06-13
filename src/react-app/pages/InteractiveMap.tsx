import { useSearchParams } from 'react-router';
import { BrainCircuit, Map, AlertCircle } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';
import HostelOperationsMap, { type MapView } from '@/react-app/components/HostelOperationsMap';
import HostelBlueprint from '@/react-app/components/HostelBlueprint';

const nearbyAlerts = [
  { room: '206', text: 'Critical electrical issue — avoid corridor west wing', severity: 'critical' },
  { room: '205', text: 'Maintenance in progress — plumbing repair until 16 Jun', severity: 'maintenance' },
];

export default function RoomAllocation() {
  const [params] = useSearchParams();
  const view = (params.get('view') as MapView) || 'student';

  const portalMeta = {
    student: { portal: 'Smart Hostel Operations Map', meta: 'Room 204 · Block B', home: '/student/dashboard' },
    warden: { portal: 'Block Operations Map', meta: 'Tagore Hostel · Block B', home: '/warden/dashboard' },
    admin: { portal: 'Campus Operations Map', meta: 'All Hostels · Live View', home: '/admin/dashboard' },
  }[view];

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter relative">
      <HostelBlueprint className="blueprint-decor w-[500px] h-[380px] -right-20 top-40 hidden lg:block" />

      <PortalNav
        portal={portalMeta.portal}
        userName={view === 'student' ? 'Aryan Sharma' : view === 'warden' ? 'Dr. Priya Mehta' : 'Dr. Rajesh Kumar'}
        userMeta={portalMeta.meta}
        avatar={view === 'student' ? 'AS' : view === 'warden' ? 'PM' : 'RK'}
        homeHref={portalMeta.home}
        dark={view !== 'student'}
        links={
          view === 'student'
            ? [{ label: 'Complaints', href: '/student/complaints' }, { label: 'Leave', href: '/student/leave' }, { label: 'Room Map', href: '/student/room' }]
            : view === 'warden'
            ? [{ label: 'Operations Map', href: '/student/room?view=warden' }, { label: 'Complaints', href: '/warden/complaints' }, { label: 'Students', href: '/warden/students' }]
            : [{ label: 'Campus Map', href: '/student/room?view=admin' }, { label: 'Rooms', href: '/admin/rooms' }, { label: 'Reports', href: '/admin/reports' }]
        }
      />

      <section className="gradient-mesh-hero relative">
        <div className="glow-orb w-[450px] h-[450px] bg-[#4CC9F0]/12 -top-16 -right-16" />
        <div className="gradient-mesh-content max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="flex items-center gap-2 mb-3">
            <Map className="w-4 h-4 text-[#4CC9F0]" />
            <p className="text-[#4CC9F0] text-xs uppercase tracking-widest font-semibold">Signature Feature</p>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4CC9F0] live-indicator" />
          </div>
          <h1 className="text-3xl lg:text-5xl font-semibold text-[#F8FAFC] tracking-tight mb-3">Smart Hostel Operations Map</h1>
          <p className="text-[#D1DEE6] max-w-2xl text-sm lg:text-base">
            {view === 'student'
              ? 'Your floor plan with live room status, nearby alerts, and AI recommendations.'
              : view === 'warden'
              ? 'Full block visibility — complaint tracking, priority alerts, and occupancy intelligence.'
              : 'Campus-wide hostel map with cross-block analytics, heatmaps, and AI forecasting.'}
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-[#D1DEE6]"><BrainCircuit className="w-4 h-4 text-[#4CC9F0]" /> AI Engine Active</div>
            {view === 'student' && (
              <div className="flex flex-wrap gap-3">
                {nearbyAlerts.map((a) => (
                  <span key={a.room} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 text-[#F8FAFC] border border-white/10 flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 text-[#4CC9F0]" /> R{a.room}: {a.text.slice(0, 40)}…
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-12">
        <HostelOperationsMap view={view} studentRoomId="204" />
      </div>
    </div>
  );
}
