import { Link } from 'react-router';
import { ArrowLeft, BarChart3, Download, AlertCircle, Calendar, IndianRupee, Users } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';
import { getStatusCounts, useComplaints } from '@/react-app/lib/complaints';
import { getFeeSummary, useFees } from '@/react-app/lib/studentState';
import { useWardenLeaveRequests, useWardenStudents } from '@/react-app/lib/wardenState';

const ADMIN = { name: 'Dr. Rajesh Kumar', avatar: 'RK' };

function percent(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

export default function AdminReports() {
  const { complaints } = useComplaints();
  const { leaveRequests } = useWardenLeaveRequests();
  const { students } = useWardenStudents();
  const { payments } = useFees();
  const complaintCounts = getStatusCounts(complaints);
  const { totalPaid, outstanding } = getFeeSummary(payments);
  const totalFees = totalPaid + outstanding;
  const feeCollectionPercent = percent(totalPaid, totalFees);
  const totalCapacity = students.reduce((sum, student) => sum + student.roomCapacity, 0);
  const occupiedBeds = students.reduce((sum, student) => sum + student.occupiedBeds, 0);
  const occupancyPercent = percent(occupiedBeds, totalCapacity);
  const pendingLeave = leaveRequests.filter((request) => request.status === 'Pending').length;
  const approvedLeave = leaveRequests.filter((request) => request.status === 'Approved').length;
  const activeComplaints = complaints.filter((complaint) => complaint.status !== 'Resolved');
  const topComplaintCategory = Object.entries(complaints.reduce<Record<string, number>>((acc, complaint) => {
    acc[complaint.category] = (acc[complaint.category] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1])[0];

  const reports = [
    {
      title: 'Occupancy Report',
      desc: `${occupiedBeds}/${totalCapacity} beds occupied across ${students.length} roster records`,
      metric: `${occupancyPercent}%`,
      icon: Users,
      lines: [
        `Students: ${students.length}`,
        `Occupied beds: ${occupiedBeds}`,
        `Total capacity: ${totalCapacity}`,
        `Occupancy: ${occupancyPercent}%`,
      ],
    },
    {
      title: 'Complaint Resolution Summary',
      desc: `${complaintCounts.resolved} resolved, ${activeComplaints.length} active`,
      metric: `${complaintCounts.resolved}/${complaintCounts.total}`,
      icon: AlertCircle,
      lines: [
        `Total complaints: ${complaintCounts.total}`,
        `Open: ${complaintCounts.open}`,
        `In progress: ${complaintCounts.inProgress}`,
        `Resolved: ${complaintCounts.resolved}`,
        `Top category: ${topComplaintCategory ? `${topComplaintCategory[0]} (${topComplaintCategory[1]})` : 'None'}`,
      ],
    },
    {
      title: 'Fee Collection Report',
      desc: `Rs. ${totalPaid.toLocaleString()} collected, Rs. ${outstanding.toLocaleString()} outstanding`,
      metric: `${feeCollectionPercent}%`,
      icon: IndianRupee,
      lines: [
        `Total paid: Rs. ${totalPaid.toLocaleString()}`,
        `Outstanding: Rs. ${outstanding.toLocaleString()}`,
        `Collection rate: ${feeCollectionPercent}%`,
      ],
    },
    {
      title: 'Leave Analytics',
      desc: `${pendingLeave} pending, ${approvedLeave} approved`,
      metric: `${leaveRequests.length}`,
      icon: Calendar,
      lines: [
        `Total leave requests: ${leaveRequests.length}`,
        `Pending: ${pendingLeave}`,
        `Approved: ${approvedLeave}`,
        `Rejected: ${leaveRequests.filter((request) => request.status === 'Rejected').length}`,
        `Cancelled: ${leaveRequests.filter((request) => request.status === 'Cancelled').length}`,
      ],
    },
  ];

  const statusChart = [
    { label: 'Open', value: complaintCounts.open, color: 'bg-rose-500' },
    { label: 'In Progress', value: complaintCounts.inProgress, color: 'bg-amber-500' },
    { label: 'Resolved', value: complaintCounts.resolved, color: 'bg-green-500' },
  ];
  const maxStatus = Math.max(1, ...statusChart.map((item) => item.value));
  const feeChart = [
    { label: 'Collected', value: totalPaid, color: 'bg-green-500' },
    { label: 'Outstanding', value: outstanding, color: 'bg-amber-500' },
  ];
  const maxFee = Math.max(1, ...feeChart.map((item) => item.value));

  function downloadReport(title: string, lines: string[]) {
    const body = [
      'HostelIQ Admin Report',
      title,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      ...lines,
    ].join('\n');
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav portal="Admin Portal" userName={ADMIN.name} avatar={ADMIN.avatar} homeHref="/admin/dashboard" dark
        links={[{ label: 'Campus Map', href: '/admin/room' }, { label: 'Rooms', href: '/admin/rooms' }, { label: 'Reports', href: '/admin/reports' }]} />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-[#1B4F72] font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <h1 className="text-2xl font-extrabold text-[#071B34]">Reports & Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#F5F7FA] rounded-xl flex items-center justify-center"><Icon className="w-5 h-5 text-[#1B4F72]" /></div>
                  <div>
                    <h3 className="font-semibold text-[#071B34] text-sm">{report.title}</h3>
                    <p className="text-xs text-[#374151] mt-0.5">{report.desc}</p>
                    <p className="text-2xl font-extrabold text-[#1B4F72] mt-2">{report.metric}</p>
                  </div>
                </div>
                <button onClick={() => downloadReport(report.title, report.lines)} className="p-2 text-[#1B4F72] hover:bg-[#F5F7FA] rounded-lg" aria-label={`Download ${report.title}`}>
                  <Download className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="font-semibold text-[#071B34] text-sm mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#1B4F72]" /> Complaint Status</p>
            <div className="space-y-4">
              {statusChart.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#374151]">{item.label}</span>
                    <span className="font-semibold text-[#071B34]">{item.value}</span>
                  </div>
                  <div className="h-2 bg-[#071B34]/8 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percent(item.value, maxStatus)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="font-semibold text-[#071B34] text-sm mb-4 flex items-center gap-2"><IndianRupee className="w-4 h-4 text-[#1B4F72]" /> Fee Distribution</p>
            <div className="space-y-4">
              {feeChart.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#374151]">{item.label}</span>
                    <span className="font-semibold text-[#071B34]">Rs. {item.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-[#071B34]/8 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percent(item.value, maxFee)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="font-semibold text-[#071B34] text-sm mb-4">Live Operational Summary</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Room Occupancy', value: `${occupancyPercent}%` },
              { label: 'Open Complaints', value: complaintCounts.open },
              { label: 'Pending Leave', value: pendingLeave },
              { label: 'Fee Collection', value: `${feeCollectionPercent}%` },
            ].map((item) => (
              <div key={item.label} className="bg-[#F5F7FA] rounded-xl p-4 border border-[#071B34]/8">
                <p className="text-xs text-[#374151]">{item.label}</p>
                <p className="text-2xl font-extrabold text-[#071B34] mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
