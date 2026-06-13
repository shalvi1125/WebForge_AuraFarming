import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, CheckCircle2, XCircle, Clock, BrainCircuit, MessageSquare } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';
import { formatShortDate } from '@/react-app/lib/studentState';
import { WARDEN, type WardenLeaveRequest, useWardenLeaveRequests } from '@/react-app/lib/wardenState';

const statusStyles: Record<WardenLeaveRequest['status'], string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-rose-100 text-rose-700',
  Cancelled: 'bg-gray-100 text-[#374151]',
};

function statusIcon(status: WardenLeaveRequest['status']) {
  if (status === 'Approved') return <CheckCircle2 className="w-3 h-3" />;
  if (status === 'Rejected' || status === 'Cancelled') return <XCircle className="w-3 h-3" />;
  return <Clock className="w-3 h-3" />;
}

export default function WardenLeave() {
  const { leaveRequests, reviewLeaveRequest } = useWardenLeaveRequests();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const pendingCount = leaveRequests.filter((request) => request.status === 'Pending').length;
  const approvedCount = leaveRequests.filter((request) => request.status === 'Approved').length;
  const rejectedCount = leaveRequests.filter((request) => request.status === 'Rejected').length;

  function handleReview(request: WardenLeaveRequest, status: 'Approved' | 'Rejected') {
    const fallback = status === 'Approved' ? 'Approved by warden.' : 'Rejected by warden.';
    reviewLeaveRequest(request.id, status, notes[request.id] || fallback);
    setNotes((current) => ({ ...current, [request.id]: '' }));
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav portal="Warden Portal" userName={WARDEN.name} avatar={WARDEN.avatar} homeHref="/warden/dashboard" dark
        links={[{ label: 'Operations Map', href: '/warden/room' }, { label: 'Complaints', href: '/warden/complaints' }, { label: 'Students', href: '/warden/students' }]} />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/warden/dashboard" className="inline-flex items-center gap-1 text-sm text-[#1B4F72] font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <h1 className="text-2xl font-extrabold text-[#071B34]">Leave Approvals</h1>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pending', value: pendingCount, color: 'text-amber-600' },
            { label: 'Approved', value: approvedCount, color: 'text-green-600' },
            { label: 'Rejected', value: rejectedCount, color: 'text-rose-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-[#374151]">{stat.label}</p>
              <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-[#F5F7FA] border border-[#071B34]/10 rounded-xl p-4 flex items-start gap-3">
          <BrainCircuit className="w-5 h-5 text-[#1B4F72] shrink-0" />
          <p className="text-sm text-[#071B34]">
            Review {pendingCount} pending leave request{pendingCount === 1 ? '' : 's'}. Notes added here are persisted with the local leave record.
          </p>
        </div>
        <div className="space-y-3">
          {leaveRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-[#071B34]">{request.student} - Room {request.room}</p>
                  <p className="text-sm text-[#374151] mt-1">{request.reason}</p>
                  <p className="text-xs text-[#374151] mt-1">
                    {request.id} - {formatShortDate(request.fromDate)} to {formatShortDate(request.toDate)} - {request.days} day{request.days === 1 ? '' : 's'}
                  </p>
                  <p className="text-xs text-[#374151] mt-1">Applied {formatShortDate(request.appliedOn)} - {request.rollNo}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${statusStyles[request.status]}`}>
                  {statusIcon(request.status)}
                  {request.status}
                </span>
              </div>
              {request.approvalNotes && (
                <div className="mt-4 bg-[#F5F7FA] rounded-xl p-3 border border-[#071B34]/8">
                  <p className="text-xs text-[#1B4F72] font-semibold flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> Warden Notes</p>
                  <p className="text-sm text-[#071B34] mt-1">{request.approvalNotes}</p>
                  {request.reviewedOn && <p className="text-xs text-[#374151] mt-1">Reviewed {request.reviewedOn}</p>}
                </div>
              )}
              {request.status === 'Pending' && (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={notes[request.id] || ''}
                    onChange={(e) => setNotes((current) => ({ ...current, [request.id]: e.target.value }))}
                    placeholder="Add approval or rejection notes"
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#4CC9F0]/30 outline-none resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleReview(request, 'Approved')} className="flex items-center gap-1 text-xs bg-green-600 text-white px-4 py-2 rounded-lg font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Approve</button>
                    <button onClick={() => handleReview(request, 'Rejected')} className="flex items-center gap-1 text-xs bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2 rounded-lg font-medium"><XCircle className="w-3.5 h-3.5" /> Reject</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
