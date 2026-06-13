import { useState } from 'react';
import { Link } from 'react-router';
import { Users, ArrowLeft, Search, AlertCircle, Calendar, Home, IndianRupee, Mail, Phone } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';
import { useComplaints } from '@/react-app/lib/complaints';
import { formatShortDate, getFeeSummary, useFees, useStudentProfile } from '@/react-app/lib/studentState';
import { type WardenStudent, useWardenLeaveRequests, useWardenStudents } from '@/react-app/lib/wardenState';

const ADMIN = { name: 'Dr. Rajesh Kumar', avatar: 'RK' };

function studentStatus(student: WardenStudent, activeComplaints: number, pendingLeave: number) {
  if (activeComplaints > 0) return 'Attention';
  if (pendingLeave > 0 || student.status === 'On Leave') return 'On Leave';
  return 'Active';
}

const statusStyles: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  'On Leave': 'bg-amber-100 text-amber-700',
  Attention: 'bg-rose-100 text-rose-700',
};

export default function AdminStudents() {
  const { students } = useWardenStudents();
  const { complaints } = useComplaints();
  const { leaveRequests } = useWardenLeaveRequests();
  const { payments } = useFees();
  const { profile } = useStudentProfile();
  const [query, setQuery] = useState('');
  const [selectedRoll, setSelectedRoll] = useState('');
  const { totalPaid, outstanding } = getFeeSummary(payments);
  const currentStudentFeePercent = totalPaid + outstanding ? Math.round((totalPaid / (totalPaid + outstanding)) * 100) : 0;

  const filteredStudents = students.filter((student) => {
    const haystack = `${student.name} ${student.rollNo} ${student.room} ${student.department} ${student.hostel}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });
  const selectedStudent = students.find((student) => student.rollNo === selectedRoll) || filteredStudents[0] || students[0] || null;
  const selectedComplaints = selectedStudent
    ? complaints.filter((complaint) => complaint.student === selectedStudent.name || complaint.room === selectedStudent.room || complaint.roomId === selectedStudent.room)
    : [];
  const selectedLeave = selectedStudent
    ? leaveRequests.filter((request) => request.rollNo === selectedStudent.rollNo || request.student === selectedStudent.name || request.room === selectedStudent.room)
    : [];
  const activeCount = selectedComplaints.filter((complaint) => complaint.status !== 'Resolved').length;
  const pendingLeaveCount = selectedLeave.filter((request) => request.status === 'Pending').length;
  const onLeaveCount = students.filter((student) => {
    const leaveForStudent = leaveRequests.filter((request) => request.rollNo === student.rollNo || request.student === student.name || request.room === student.room);
    return leaveForStudent.some((request) => request.status === 'Pending' || request.status === 'Approved') || student.status === 'On Leave';
  }).length;
  const attentionCount = students.filter((student) => complaints.some((complaint) => (complaint.student === student.name || complaint.room === student.room || complaint.roomId === student.room) && complaint.status !== 'Resolved')).length;
  const selectedOccupancy = selectedStudent ? Math.round((selectedStudent.occupiedBeds / Math.max(1, selectedStudent.roomCapacity)) * 100) : 0;
  const hasLinkedFeeLedger = selectedStudent?.rollNo === profile.rollNo;

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav portal="Admin Portal" userName={ADMIN.name} avatar={ADMIN.avatar} homeHref="/admin/dashboard" dark
        links={[{ label: 'Campus Map', href: '/admin/room' }, { label: 'Rooms', href: '/admin/rooms' }, { label: 'Reports', href: '/admin/reports' }]} />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-[#1B4F72] font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#071B34]">Student Records</h1>
            <p className="text-sm text-[#374151] mt-1">Live roster from shared Warden/student state</p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#374151]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, roll no, room, department..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4CC9F0]/30 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: 'Total Students', v: students.length },
            { l: 'Active', v: Math.max(0, students.length - onLeaveCount - attentionCount) },
            { l: 'On Leave', v: onLeaveCount },
            { l: 'Need Attention', v: attentionCount },
          ].map((s) => (
            <div key={s.l} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><p className="text-xs text-[#374151]">{s.l}</p><p className="text-2xl font-extrabold text-[#1B4F72] mt-1">{s.v}</p></div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-[#374151] uppercase">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Roll No</th>
                  <th className="px-6 py-3">Room</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map((student) => {
                  const rowComplaints = complaints.filter((complaint) => complaint.student === student.name || complaint.room === student.room || complaint.roomId === student.room);
                  const rowLeave = leaveRequests.filter((request) => request.rollNo === student.rollNo || request.student === student.name || request.room === student.room);
                  const status = studentStatus(
                    student,
                    rowComplaints.filter((complaint) => complaint.status !== 'Resolved').length,
                    rowLeave.filter((request) => request.status === 'Pending').length
                  );
                  return (
                    <tr
                      key={student.rollNo}
                      onClick={() => setSelectedRoll(student.rollNo)}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedStudent?.rollNo === student.rollNo ? 'bg-[#F5F7FA]' : ''}`}
                    >
                      <td className="px-6 py-4 font-medium text-[#071B34]">{student.name}</td>
                      <td className="px-6 py-4 text-[#374151]">{student.rollNo}</td>
                      <td className="px-6 py-4">{student.room}</td>
                      <td className="px-6 py-4">{student.department}</td>
                      <td className="px-6 py-4"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[status]}`}>{status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredStudents.length === 0 && <div className="p-10 text-sm text-[#374151]">No students match your search.</div>}
          </div>

          {selectedStudent && (
            <aside className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#071B34] text-white flex items-center justify-center text-sm font-bold">
                    {selectedStudent.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-[#071B34]">{selectedStudent.name}</p>
                    <p className="text-xs text-[#374151]">{selectedStudent.rollNo} - {selectedStudent.year}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-[#374151]"><Home className="w-4 h-4 text-[#1B4F72]" /> Room {selectedStudent.room}, {selectedStudent.block}</p>
                  <p className="flex items-center gap-2 text-[#374151]"><Mail className="w-4 h-4 text-[#1B4F72]" /> {selectedStudent.email}</p>
                  <p className="flex items-center gap-2 text-[#374151]"><Phone className="w-4 h-4 text-[#1B4F72]" /> {selectedStudent.phone}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-3 flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Room Details</p>
                <p className="text-sm font-semibold text-[#071B34]">{selectedStudent.hostel} - {selectedStudent.block}</p>
                <p className="text-xs text-[#374151] mt-1">{selectedStudent.occupiedBeds}/{selectedStudent.roomCapacity} beds occupied - {selectedOccupancy}% utilization</p>
                <div className="h-2 bg-[#071B34]/8 rounded-full mt-3"><div className="h-full bg-[#4CC9F0] rounded-full" style={{ width: `${selectedOccupancy}%` }} /></div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-3 flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" /> Fee Status</p>
                {hasLinkedFeeLedger ? (
                  <>
                    <p className="text-sm font-semibold text-[#071B34]">{currentStudentFeePercent}% collected</p>
                    <p className="text-xs text-[#374151] mt-1">Paid Rs. {totalPaid.toLocaleString()} - Outstanding Rs. {outstanding.toLocaleString()}</p>
                    <div className="h-2 bg-[#071B34]/8 rounded-full mt-3"><div className="h-full bg-green-500 rounded-full" style={{ width: `${currentStudentFeePercent}%` }} /></div>
                  </>
                ) : (
                  <p className="text-sm text-[#374151]">No linked fee ledger is available in the shared frontend stores for this seeded roster record.</p>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-3 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Complaints</p>
                <div className="space-y-3">
                  {selectedComplaints.length ? selectedComplaints.map((complaint) => (
                    <div key={complaint.id} className="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                      <p className="text-sm font-semibold text-[#071B34]">{complaint.title}</p>
                      <p className="text-xs text-[#374151] mt-0.5">{complaint.id} - {complaint.status} - {complaint.priority}</p>
                    </div>
                  )) : <p className="text-sm text-[#374151]">No complaints found.</p>}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-3 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Leave History</p>
                <div className="space-y-3">
                  {selectedLeave.length ? selectedLeave.map((request) => (
                    <div key={request.id} className="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                      <p className="text-sm font-semibold text-[#071B34]">{request.reason}</p>
                      <p className="text-xs text-[#374151] mt-0.5">{request.id} - {request.status} - {formatShortDate(request.fromDate)} to {formatShortDate(request.toDate)}</p>
                    </div>
                  )) : <p className="text-sm text-[#374151]">No leave history found.</p>}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
