import { Link } from 'react-router';
import { BedDouble, Users, BarChart3, AlertCircle, BrainCircuit, Map, Calendar, IndianRupee, Megaphone } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';
import { getStatusCounts, useComplaints } from '@/react-app/lib/complaints';
import { formatShortDate, getFeeSummary, useAnnouncements, useFees } from '@/react-app/lib/studentState';
import { useWardenLeaveRequests, useWardenStudents } from '@/react-app/lib/wardenState';

const ADMIN = { name: 'Dr. Rajesh Kumar', meta: 'Campus Administrator', avatar: 'RK' };

function percent(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

export default function AdminDashboard() {
  const { complaints } = useComplaints();
  const { leaveRequests } = useWardenLeaveRequests();
  const { students } = useWardenStudents();
  const { payments } = useFees();
  const { announcements } = useAnnouncements();
  const complaintCounts = getStatusCounts(complaints);
  const { totalPaid, outstanding } = getFeeSummary(payments);
  const totalFees = totalPaid + outstanding;
  const feeCollectionPercent = percent(totalPaid, totalFees);
  const pendingLeave = leaveRequests.filter((request) => request.status === 'Pending');
  const approvedLeave = leaveRequests.filter((request) => request.status === 'Approved');
  const totalCapacity = students.reduce((sum, student) => sum + student.roomCapacity, 0);
  const occupiedBeds = students.reduce((sum, student) => sum + student.occupiedBeds, 0);
  const occupancyPercent = percent(occupiedBeds, totalCapacity);
  const uniqueRooms = new Set(students.map((student) => student.room));
  const occupiedRooms = new Set(students.filter((student) => student.occupiedBeds > 0).map((student) => student.room));
  const roomUtilizationPercent = percent(occupiedRooms.size, uniqueRooms.size);
  const activeComplaintCount = complaintCounts.open + complaintCounts.inProgress;

  const complaintChart = [
    { label: 'Open', value: complaintCounts.open, color: 'bg-rose-500' },
    { label: 'In Progress', value: complaintCounts.inProgress, color: 'bg-amber-500' },
    { label: 'Resolved', value: complaintCounts.resolved, color: 'bg-green-500' },
  ];
  const maxComplaintValue = Math.max(1, ...complaintChart.map((item) => item.value));
  const leaveChart = [
    { label: 'Pending', value: pendingLeave.length, color: 'bg-amber-500' },
    { label: 'Approved', value: approvedLeave.length, color: 'bg-green-500' },
    { label: 'Rejected', value: leaveRequests.filter((request) => request.status === 'Rejected').length, color: 'bg-rose-500' },
    { label: 'Cancelled', value: leaveRequests.filter((request) => request.status === 'Cancelled').length, color: 'bg-gray-400' },
  ];
  const maxLeaveValue = Math.max(1, ...leaveChart.map((item) => item.value));

  const recentActivity = [
    ...complaints.slice(0, 3).map((complaint) => ({ icon: AlertCircle, text: `Complaint ${complaint.id} is ${complaint.status}`, sub: `${complaint.student} - Room ${complaint.room}` })),
    ...leaveRequests.slice(0, 2).map((request) => ({ icon: Calendar, text: `Leave ${request.id} is ${request.status}`, sub: `${request.student} - ${formatShortDate(request.fromDate)} to ${formatShortDate(request.toDate)}` })),
    ...(payments[0] ? [{ icon: IndianRupee, text: `Latest fee record: ${payments[0].description}`, sub: `${payments[0].status} - Rs. ${payments[0].amount.toLocaleString()}` }] : []),
    ...(announcements[0] ? [{ icon: Megaphone, text: `Latest notice: ${announcements[0].title}`, sub: announcements[0].date }] : []),
  ].slice(0, 6);

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav
        portal="Admin Portal"
        userName={ADMIN.name}
        userMeta={ADMIN.meta}
        avatar={ADMIN.avatar}
        homeHref="/admin/dashboard"
        dark
        links={[
          { label: 'Campus Map', href: '/admin/room' },
          { label: 'Rooms', href: '/admin/rooms' },
          { label: 'Students', href: '/admin/students' },
          { label: 'Reports', href: '/admin/reports' },
        ]}
      />

      <section className="gradient-mesh-hero">
        <div className="gradient-mesh-content max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#4CC9F0] live-indicator" />
            <p className="text-[#4CC9F0] text-xs uppercase tracking-widest font-bold">Campus Overview - Live</p>
          </div>
          <h1 className="text-4xl lg:text-5xl font-semibold text-[#F8FAFC] tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-[#D1DEE6] font-medium">{students.length} students - {uniqueRooms.size} tracked rooms - {announcements.length} announcements</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/10">
            {[
              [String(students.length), 'Total Students'],
              [`${occupancyPercent}%`, 'Hostel Occupancy'],
              [String(activeComplaintCount), 'Open Complaints'],
              [`${feeCollectionPercent}%`, 'Fee Collection'],
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
            { label: 'Rooms', href: '/admin/rooms', icon: BedDouble, value: `${roomUtilizationPercent}%`, desc: 'Room utilization' },
            { label: 'Students', href: '/admin/students', icon: Users, value: String(students.length), desc: 'Student records' },
            { label: 'Reports', href: '/admin/reports', icon: BarChart3, value: `${approvedLeave.length}/${leaveRequests.length}`, desc: 'Leave approval rate' },
            { label: 'Complaints', href: '/admin/dashboard#complaint-overview', icon: AlertCircle, value: String(complaintCounts.total), desc: 'Campus complaint view' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.href}
                className="surface-panel rounded-2xl p-6 elevate-hover flex flex-col gap-3">
                <div className="w-10 h-10 bg-[#F5F7FA] rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#1B4F72]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#071B34]">{item.value}</p>
                  <p className="font-semibold text-[#071B34] mt-1">{item.label}</p>
                  <p className="text-xs text-[#374151] mt-0.5">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div id="complaint-overview" className="surface-panel rounded-2xl p-6">
            <p className="font-semibold text-[#071B34] text-sm mb-4">Complaint Overview</p>
            <div className="space-y-4">
              {complaintChart.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#374151]">{item.label}</span>
                    <span className="font-semibold text-[#071B34]">{item.value}</span>
                  </div>
                  <div className="h-2 bg-[#071B34]/8 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percent(item.value, maxComplaintValue)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel rounded-2xl p-6">
            <p className="font-semibold text-[#071B34] text-sm mb-4">Leave Workflow</p>
            <div className="space-y-4">
              {leaveChart.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#374151]">{item.label}</span>
                    <span className="font-semibold text-[#071B34]">{item.value}</span>
                  </div>
                  <div className="h-2 bg-[#071B34]/8 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percent(item.value, maxLeaveValue)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="surface-panel rounded-2xl p-6">
            <p className="font-semibold text-[#071B34] text-sm mb-4">Financial Snapshot</p>
            <p className="text-3xl font-extrabold text-[#071B34]">{feeCollectionPercent}%</p>
            <p className="text-xs text-[#374151] mt-1">Rs. {totalPaid.toLocaleString()} collected of Rs. {totalFees.toLocaleString()}</p>
            <div className="h-2 bg-[#071B34]/8 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-[#4CC9F0] rounded-full" style={{ width: `${feeCollectionPercent}%` }} />
            </div>
          </div>

          <div className="surface-panel rounded-2xl p-6">
            <p className="font-semibold text-[#071B34] text-sm mb-4">Recent Activity</p>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={`${activity.text}-${index}`} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-[#1B4F72] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-[#071B34]">{activity.text}</p>
                      <p className="text-xs text-[#374151]">{activity.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="surface-panel rounded-2xl p-6 flex items-start gap-3">
            <BrainCircuit className="w-5 h-5 text-[#1B4F72] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#071B34] text-sm">AI Campus Insights</p>
              <p className="text-sm text-[#374151] mt-1">
                {activeComplaintCount} active complaint{activeComplaintCount === 1 ? '' : 's'}, {pendingLeave.length} pending leave request{pendingLeave.length === 1 ? '' : 's'}, and {outstanding ? `Rs. ${outstanding.toLocaleString()} outstanding fees` : 'no outstanding fee balance'}.
              </p>
              <Link to="/admin/room" className="inline-flex items-center gap-1 text-sm text-[#1B4F72] font-semibold mt-3 hover:text-[#4CC9F0]">
                Open operations map <Map className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
