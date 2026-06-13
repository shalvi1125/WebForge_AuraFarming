import { useState } from 'react';
import { Link } from 'react-router';
import {
  Mail, Building2, BedDouble, IndianRupee, AlertCircle,
  Calendar, Users, Award, Clock, ChevronRight, ArrowLeft,
  Trophy, Star, BrainCircuit, CheckCircle2, Save, Pencil,
} from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';
import { useComplaints } from '@/react-app/lib/complaints';
import {
  getFeeSummary,
  useFees,
  useLeaveRequests,
  useStudentProfile,
  type StudentProfileData,
} from '@/react-app/lib/studentState';

const badges = [
  { name: 'Early Adopter', icon: Star, color: 'text-amber-500' },
  { name: '5 Leave Streak', icon: Calendar, color: 'text-blue-500' },
  { name: 'Community Star', icon: Trophy, color: 'text-[#1B4F72]' },
];

export default function StudentProfile() {
  const { profile, setProfile } = useStudentProfile();
  const { complaints } = useComplaints();
  const { leaveRequests } = useLeaveRequests();
  const { payments } = useFees();
  const { outstanding } = getFeeSummary(payments);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<StudentProfileData>(profile);

  const studentComplaints = complaints.filter((complaint) => complaint.student === profile.name);
  const activeComplaints = studentComplaints.filter((complaint) => complaint.status !== 'Resolved').length;
  const pendingLeave = leaveRequests.filter((leave) => leave.status === 'Pending').length;
  const lastPayment = payments.find((payment) => payment.status === 'paid');

  const stats = [
    { label: 'Complaints Filed', value: String(studentComplaints.length), sub: `${activeComplaints} active`, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Leave Requests', value: String(leaveRequests.length), sub: `${pendingLeave} pending`, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Visitors Hosted', value: '12', sub: '3 this month', icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Outstanding Fees', value: `Rs. ${outstanding.toLocaleString()}`, sub: outstanding ? 'Due 30 Jun' : 'Paid up', icon: IndianRupee, color: 'text-[#1B4F72]', bg: 'bg-[#F5F7FA]' },
  ];

  const activity = [
    ...studentComplaints.slice(0, 2).map((complaint) => ({ action: `Complaint ${complaint.id} is ${complaint.status}`, time: complaint.date, icon: AlertCircle })),
    ...leaveRequests.slice(0, 2).map((leave) => ({ action: `Leave request ${leave.id} is ${leave.status}`, time: leave.appliedOn, icon: Calendar })),
    ...(lastPayment ? [{ action: `Fee payment ${lastPayment.id} recorded`, time: lastPayment.paidOn || lastPayment.date, icon: IndianRupee }] : []),
    { action: `Room allocation confirmed - ${profile.block}, ${profile.room}`, time: profile.joined, icon: BedDouble },
  ];

  function updateDraft(path: string, value: string) {
    setDraft((current) => {
      if (path.startsWith('emergencyContact.')) {
        const key = path.replace('emergencyContact.', '') as keyof StudentProfileData['emergencyContact'];
        return { ...current, emergencyContact: { ...current.emergencyContact, [key]: value } };
      }
      if (path.startsWith('parent.')) {
        const key = path.replace('parent.', '') as keyof StudentProfileData['parent'];
        return { ...current, parent: { ...current.parent, [key]: value } };
      }
      return { ...current, [path]: value };
    });
  }

  function saveProfile() {
    const avatar = draft.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'AS';
    setProfile({ ...draft, avatar });
    setDraft({ ...draft, avatar });
    setEditing(false);
  }

  const yearLine = `${profile.year} - ${profile.department}`;

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav
        portal="Student Profile"
        userName={profile.name}
        userMeta={profile.rollNo}
        avatar={profile.avatar}
        homeHref="/student/dashboard"
        links={[
          { label: 'Complaints', href: '/student/complaints' },
          { label: 'Leave', href: '/student/leave' },
          { label: 'Room Map', href: '/student/room' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link to="/student/dashboard" className="inline-flex items-center gap-1 text-sm text-[#1B4F72] hover:text-[#071B34] font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <button
            onClick={() => editing ? saveProfile() : setEditing(true)}
            className="inline-flex items-center gap-2 bg-[#071B34] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0A2342]"
          >
            {editing ? <Save className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            {editing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#071B34] px-6 py-8 flex flex-col items-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-3xl font-extrabold border-4 border-white/30 mb-3">
                  {profile.avatar}
                </div>
                <h1 className="text-xl font-extrabold text-white">{profile.name}</h1>
                <p className="text-[#D1DEE6] text-sm">{profile.rollNo}</p>
                <p className="text-[#D1DEE6] text-xs mt-1">{yearLine}</p>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { icon: Mail, label: 'Email', value: profile.email },
                  { icon: Building2, label: 'Hostel', value: profile.hostel },
                  { icon: BedDouble, label: 'Room', value: `${profile.room}, ${profile.block}` },
                  { icon: Clock, label: 'Member Since', value: profile.joined },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="flex items-center gap-3 text-sm">
                      <Icon className="w-4 h-4 text-[#374151] shrink-0" />
                      <div>
                        <p className="text-xs text-[#374151]">{row.label}</p>
                        <p className="font-medium text-[#071B34]">{row.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-4">
              <h2 className="font-semibold text-[#071B34] mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#1B4F72]" /> Achievement Badges
              </h2>
              <div className="flex flex-wrap gap-2">
                {badges.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.name} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                      <Icon className={`w-4 h-4 ${b.color}`} />
                      <span className="text-xs font-semibold text-[#374151]">{b.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm card-hover">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-[#374151]">{s.label}</p>
                        <p className={`text-2xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-[#374151] mt-0.5">{s.sub}</p>
                      </div>
                      <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {editing && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                <h2 className="font-semibold text-[#071B34]">Edit Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    ['name', 'Full Name', draft.name],
                    ['email', 'Email', draft.email],
                    ['phone', 'Phone', draft.phone],
                    ['year', 'Year', draft.year],
                    ['department', 'Department', draft.department],
                    ['room', 'Room', draft.room],
                  ].map(([key, label, value]) => (
                    <label key={key} className="text-xs text-[#374151] font-semibold">
                      {label}
                      <input value={value} onChange={(e) => updateDraft(key, e.target.value)}
                        className="mt-1 w-full border border-[#071B34]/10 rounded-lg px-3 py-2 text-sm font-normal text-[#071B34] focus:ring-2 focus:ring-[#4CC9F0]/30 outline-none" />
                    </label>
                  ))}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <section className="bg-[#F5F7FA] rounded-xl p-4 border border-[#071B34]/8">
                    <p className="text-xs text-[#1B4F72] font-bold uppercase tracking-widest mb-3">Emergency Contact</p>
                    {[
                      ['emergencyContact.name', 'Name', draft.emergencyContact.name],
                      ['emergencyContact.relation', 'Relation', draft.emergencyContact.relation],
                      ['emergencyContact.phone', 'Phone', draft.emergencyContact.phone],
                    ].map(([key, label, value]) => (
                      <label key={key} className="block text-xs text-[#374151] font-semibold mb-3">
                        {label}
                        <input value={value} onChange={(e) => updateDraft(key, e.target.value)}
                          className="mt-1 w-full border border-[#071B34]/10 rounded-lg px-3 py-2 text-sm font-normal text-[#071B34] outline-none" />
                      </label>
                    ))}
                  </section>
                  <section className="bg-[#F5F7FA] rounded-xl p-4 border border-[#071B34]/8">
                    <p className="text-xs text-[#1B4F72] font-bold uppercase tracking-widest mb-3">Parent Information</p>
                    {[
                      ['parent.name', 'Name', draft.parent.name],
                      ['parent.phone', 'Phone', draft.parent.phone],
                      ['parent.email', 'Email', draft.parent.email],
                      ['parent.address', 'Address', draft.parent.address],
                    ].map(([key, label, value]) => (
                      <label key={key} className="block text-xs text-[#374151] font-semibold mb-3">
                        {label}
                        <input value={value} onChange={(e) => updateDraft(key, e.target.value)}
                          className="mt-1 w-full border border-[#071B34]/10 rounded-lg px-3 py-2 text-sm font-normal text-[#071B34] outline-none" />
                      </label>
                    ))}
                  </section>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-[#071B34] mb-4">Room & Fee Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#F5F7FA] rounded-xl p-4 border border-[#071B34]/10">
                  <p className="text-xs text-[#1B4F72] font-medium mb-2">Room Details</p>
                  <p className="text-sm font-bold text-[#071B34]">Room {profile.room}, {profile.block}</p>
                  <p className="text-xs text-[#374151] mt-1">{profile.hostel} - 3/4 occupancy</p>
                  <Link to="/student/room" className="inline-flex items-center gap-1 text-xs text-[#1B4F72] mt-2 font-medium">
                    View allocation <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-medium mb-2">Fee Status</p>
                  <p className="text-sm font-bold text-[#071B34]">Rs. {outstanding.toLocaleString()} outstanding</p>
                  <p className="text-xs text-[#374151] mt-1">Last payment: {lastPayment ? `Rs. ${lastPayment.amount.toLocaleString()} on ${lastPayment.paidOn || lastPayment.date}` : 'No payment yet'}</p>
                  <Link to="/student/fees" className="inline-flex items-center gap-1 text-xs text-emerald-600 mt-2 font-medium">
                    Pay now <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-[#071B34]">Activity Timeline</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {activity.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#374151]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#071B34]">{a.action}</p>
                        <p className="text-xs text-[#374151] mt-0.5">{a.time}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#071B34] rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-cyan-400" />
                <div>
                  <p className="text-white font-semibold text-sm">AI Profile Insights</p>
                  <p className="text-[#D1DEE6] text-xs">{activeComplaints ? `${activeComplaints} active complaint${activeComplaints > 1 ? 's' : ''} need follow-up.` : 'No active complaints. Profile is in good standing.'}</p>
                </div>
              </div>
              <Link to="/chat" className="text-cyan-300 text-xs font-medium hover:text-white flex items-center gap-1">
                Ask AI <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
