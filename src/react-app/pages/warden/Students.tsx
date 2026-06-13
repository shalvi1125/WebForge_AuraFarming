import { useState } from 'react';
import { Link } from 'react-router';
import { Users, ArrowLeft, Search, BrainCircuit, AlertCircle, Calendar, Home, Phone, Mail } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';
import { useComplaints } from '@/react-app/lib/complaints';
import { formatShortDate } from '@/react-app/lib/studentState';
import { WARDEN, type WardenStudent, useWardenLeaveRequests, useWardenStudents } from '@/react-app/lib/wardenState';

function studentStatus(student: WardenStudent, pendingLeaveCount: number, activeComplaintCount: number) {
  if (activeComplaintCount > 0) return 'Attention';
  if (pendingLeaveCount > 0 || student.status === 'On Leave') return 'On Leave';
  return 'Active';
}

const statusStyles: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  'On Leave': 'bg-amber-100 text-amber-700',
  Attention: 'bg-rose-100 text-rose-700',
};

export default function WardenStudents() {
  const { students } = useWardenStudents();
  const { complaints } = useComplaints();
  const { leaveRequests } = useWardenLeaveRequests();
  const [query, setQuery] = useState('');
  const [selectedRoll, setSelectedRoll] = useState('');

  const filteredStudents = students.filter((student) => {
    const haystack = `${student.name} ${student.rollNo} ${student.room} ${student.department}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });
  const selectedStudent = students.find((student) => student.rollNo === selectedRoll) || filteredStudents[0] || students[0] || null;
  const selectedComplaints = selectedStudent
    ? complaints.filter((complaint) => complaint.student === selectedStudent.name || complaint.room === selectedStudent.room || complaint.roomId === selectedStudent.room)
    : [];
  const selectedLeave = selectedStudent
    ? leaveRequests.filter((request) => request.rollNo === selectedStudent.rollNo || request.student === selectedStudent.name || request.room === selectedStudent.room)
    : [];
  const activeComplaintCount = selectedComplaints.filter((complaint) => complaint.status !== 'Resolved').length;
  const pendingLeaveCount = selectedLeave.filter((request) => request.status === 'Pending').length;
  const occupancyPercent = selectedStudent ? Math.round((selectedStudent.occupiedBeds / Math.max(1, selectedStudent.roomCapacity)) * 100) : 0;
  const rosterOccupancy = students.reduce((sum, student) => sum + student.occupiedBeds, 0);
  const rosterCapacity = students.reduce((sum, student) => sum + student.roomCapacity, 0);

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav portal="Warden Portal" userName={WARDEN.name} userMeta={WARDEN.hostel} avatar={WARDEN.avatar} homeHref="/warden/dashboard" dark
        links={[{ label: 'Operations Map', href: '/warden/room' }, { label: 'Complaints', href: '/warden/complaints' }, { label: 'Students', href: '/warden/students' }]} />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/warden/dashboard" className="inline-flex items-center gap-1 text-sm text-[#1B4F72] font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#071B34]">Students</h1>
            <p className="text-sm text-[#374151] mt-1">{students.length} students - {rosterOccupancy}/{rosterCapacity} beds occupied</p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#374151]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students, roll no, room..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4CC9F0]/30 outline-none"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-[#374151] uppercase">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Roll No</th>
                  <th className="px-6 py-3">Room</th>
                  <th className="px-6 py-3">Year</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map((student) => {
                  const rowComplaints = complaints.filter((complaint) => complaint.student === student.name || complaint.room === student.room || complaint.roomId === student.room);
                  const rowLeave = leaveRequests.filter((request) => request.rollNo === student.rollNo || request.student === student.name || request.room === student.room);
                  const status = studentStatus(
                    student,
                    rowLeave.filter((request) => request.status === 'Pending').length,
                    rowComplaints.filter((complaint) => complaint.status !== 'Resolved').length
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
                      <td className="px-6 py-4">{student.year}</td>
                      <td className="px-6 py-4"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[status]}`}>{status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredStudents.length === 0 && <div className="p-8 text-sm text-[#374151]">No students match your search.</div>}
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
                    <p className="text-xs text-[#374151]">{selectedStudent.rollNo} - {selectedStudent.department}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-[#374151]"><Home className="w-4 h-4 text-[#1B4F72]" /> Room {selectedStudent.room}, {selectedStudent.block}</p>
                  <p className="flex items-center gap-2 text-[#374151]"><Mail className="w-4 h-4 text-[#1B4F72]" /> {selectedStudent.email}</p>
                  <p className="flex items-center gap-2 text-[#374151]"><Phone className="w-4 h-4 text-[#1B4F72]" /> {selectedStudent.phone}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-3 flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Room Information</p>
                <p className="text-sm font-semibold text-[#071B34]">{selectedStudent.hostel} - {selectedStudent.block}</p>
                <p className="text-xs text-[#374151] mt-1">{selectedStudent.occupiedBeds}/{selectedStudent.roomCapacity} beds occupied - {occupancyPercent}% occupancy</p>
                <div className="h-2 bg-[#071B34]/8 rounded-full mt-3"><div className="h-full bg-[#4CC9F0] rounded-full" style={{ width: `${occupancyPercent}%` }} /></div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-3 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Complaint History</p>
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
                      {request.approvalNotes && <p className="text-xs text-[#1B4F72] mt-1">{request.approvalNotes}</p>}
                    </div>
                  )) : <p className="text-sm text-[#374151]">No leave history found.</p>}
                </div>
              </div>
            </aside>
          )}
        </div>

        <div className="flex items-start gap-3 bg-[#F5F7FA] rounded-xl p-4 border border-[#071B34]/10">
          <BrainCircuit className="w-5 h-5 text-[#1B4F72] shrink-0" />
          <p className="text-sm text-[#071B34]">
            Live roster insight: {activeComplaintCount} active complaint{activeComplaintCount === 1 ? '' : 's'} and {pendingLeaveCount} pending leave request{pendingLeaveCount === 1 ? '' : 's'} for the selected student.
          </p>
        </div>
      </div>
    </div>
  );
}
