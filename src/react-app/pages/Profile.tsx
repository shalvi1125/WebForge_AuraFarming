import { Link } from 'react-router';
import {
  User, Mail, Building2, BedDouble, IndianRupee, AlertCircle,
  Calendar, Users, Award, Clock, ChevronRight, ArrowLeft,
  Trophy, Star, BrainCircuit, CheckCircle2,
} from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

const student = {
  name: 'Aryan Sharma',
  rollNo: 'CS21B047',
  email: 'aryan.sharma@university.edu',
  year: '3rd Year · CSE',
  hostel: 'Tagore Hostel',
  block: 'Block B',
  room: '204',
  joined: 'Aug 2022',
  avatar: 'AS',
};

const stats = [
  { label: 'Complaints Filed', value: '8', sub: '2 active', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Leave Requests', value: '5', sub: '1 pending', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Visitors Hosted', value: '12', sub: '3 this month', icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { label: 'Outstanding Fees', value: '₹4,500', sub: 'Due 30 Jun', icon: IndianRupee, color: 'text-[#1B4F72]', bg: 'bg-[#F5F7FA]' },
];

const badges = [
  { name: 'Early Adopter', icon: Star, color: 'text-amber-500' },
  { name: '5 Leave Streak', icon: Calendar, color: 'text-blue-500' },
  { name: 'Community Star', icon: Trophy, color: 'text-[#1B4F72]' },
];

const activity = [
  { action: 'Complaint CMP-041 updated to In Progress', time: '2 hours ago', icon: AlertCircle },
  { action: 'Leave request LV-014 submitted', time: '3 days ago', icon: Calendar },
  { action: 'Visitor pass issued for Rahul Sharma', time: '5 days ago', icon: Users },
  { action: 'Fee payment of ₹8,000 received', time: '1 week ago', icon: IndianRupee },
  { action: 'Room allocation confirmed — Block B, 204', time: '2 weeks ago', icon: BedDouble },
];

export default function StudentProfile() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav
        portal="Student Profile"
        userName={student.name}
        userMeta={student.rollNo}
        avatar={student.avatar}
        homeHref="/student/dashboard"
        links={[
          { label: 'Complaints', href: '/student/complaints' },
          { label: 'Leave', href: '/student/leave' },
          { label: 'Room Map', href: '/student/room' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/student/dashboard" className="inline-flex items-center gap-1 text-sm text-[#1B4F72] hover:text-[#071B34] font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#071B34] px-6 py-8 flex flex-col items-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-3xl font-extrabold border-4 border-white/30 mb-3">
                  {student.avatar}
                </div>
                <h1 className="text-xl font-extrabold text-white">{student.name}</h1>
                <p className="text-[#374151] text-sm">{student.rollNo}</p>
                <p className="text-[#374151] text-xs mt-1">{student.year}</p>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { icon: Mail, label: 'Email', value: student.email },
                  { icon: Building2, label: 'Hostel', value: student.hostel },
                  { icon: BedDouble, label: 'Room', value: `${student.room}, ${student.block}` },
                  { icon: Clock, label: 'Member Since', value: student.joined },
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

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-[#071B34] mb-4">Room & Fee Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#F5F7FA] rounded-xl p-4 border border-[#071B34]/10">
                  <p className="text-xs text-[#1B4F72] font-medium mb-2">Room Details</p>
                  <p className="text-sm font-bold text-[#071B34]">Room 204, Block B</p>
                  <p className="text-xs text-[#374151] mt-1">3/4 occupancy · AC · Attached washroom</p>
                  <Link to="/student/room" className="inline-flex items-center gap-1 text-xs text-[#1B4F72] mt-2 font-medium">
                    View allocation <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-medium mb-2">Fee Status</p>
                  <p className="text-sm font-bold text-[#071B34]">₹4,500 outstanding</p>
                  <p className="text-xs text-[#374151] mt-1">Last payment: ₹8,000 on 01 May</p>
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
                  <p className="text-[#374151] text-xs">Your complaint resolution rate is 87% — above hostel average.</p>
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
