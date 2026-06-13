import { useState } from 'react';
import { Link } from 'react-router';
import {
  Megaphone, Calendar, Utensils, Wrench, AlertTriangle, Bell,
  ChevronRight, Pin, ThumbsUp, MessageCircle, ArrowLeft, Vote,
  Sparkles, Clock,
} from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

type NoticeType = 'general' | 'mess' | 'maintenance' | 'emergency' | 'event';

interface Notice {
  id: string;
  title: string;
  body: string;
  type: NoticeType;
  date: string;
  pinned?: boolean;
  likes: number;
  comments: number;
}

const notices: Notice[] = [
  { id: '1', title: 'Hostel Curfew Extended for Fest Week', body: 'Curfew extended to 11:00 PM from 14–18 Jun for college fest participants. Carry ID cards at all times.', type: 'general', date: '12 Jun', pinned: true, likes: 42, comments: 8 },
  { id: '2', title: 'Mess Menu Update — Special Dinner', body: 'Special North Indian thali on Sunday. Veg and non-veg options available. Timings: 7–9 PM.', type: 'mess', date: '11 Jun', likes: 89, comments: 15 },
  { id: '3', title: 'Block B — Water Supply Maintenance', body: 'Water supply will be interrupted on 15 Jun, 9 AM–12 PM for pipeline repair. Store water in advance.', type: 'maintenance', date: '10 Jun', likes: 23, comments: 5 },
  { id: '4', title: 'Fire Drill — Mandatory Attendance', body: 'Emergency fire drill scheduled for 16 Jun at 4 PM. All students must assemble at the main ground.', type: 'emergency', date: '09 Jun', likes: 56, comments: 3 },
  { id: '5', title: 'Inter-Hostel Cricket Tournament', body: 'Registrations open until 20 Jun. Teams of 11. Sign up at the warden office or via the student portal.', type: 'event', date: '08 Jun', likes: 124, comments: 31 },
];

const typeStyles: Record<NoticeType, { icon: typeof Megaphone; color: string; bg: string; label: string }> = {
  general: { icon: Megaphone, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'General' },
  mess: { icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Mess' },
  maintenance: { icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Maintenance' },
  emergency: { icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', label: 'Emergency' },
  event: { icon: Calendar, color: 'text-cyan-600', bg: 'bg-cyan-50', label: 'Event' },
};

const upcomingEvents = [
  { title: 'Cricket Tournament Finals', date: '22 Jun', time: '3:00 PM', location: 'Main Ground' },
  { title: 'Hostel Cultural Night', date: '28 Jun', time: '6:00 PM', location: 'Common Hall' },
  { title: 'Fee Payment Deadline', date: '30 Jun', time: '11:59 PM', location: 'Online Portal' },
];

const activePoll = {
  question: 'Preferred mess closing time on weekends?',
  options: [
    { label: '9:00 PM', votes: 45, pct: 38 },
    { label: '9:30 PM', votes: 52, pct: 44 },
    { label: '10:00 PM', votes: 21, pct: 18 },
  ],
  totalVotes: 118,
};

export default function Announcements() {
  const [filter, setFilter] = useState<NoticeType | 'all'>('all');

  const filtered = filter === 'all' ? notices : notices.filter((n) => n.type === filter);

  return (
    <div className="min-h-screen bg-gray-50 page-enter">
      <PortalNav
        portal="Hostel Announcements"
        userName="Aryan Sharma"
        userMeta="Tagore Hostel"
        avatar="AS"
        homeHref="/student/dashboard"
        links={[
          { label: 'Dashboard', href: '/student/dashboard' },
          { label: 'Leave', href: '/student/leave' },
          { label: 'Fees', href: '/student/fees' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div>
          <Link to="/student/dashboard" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mb-2 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Hostel Announcements</h1>
          <p className="text-gray-500 text-sm mt-1">Notice board, events, mess updates, and emergency alerts</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'general', 'mess', 'maintenance', 'emergency', 'event'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === t ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-200'
              }`}
            >
              {t === 'all' ? 'All' : typeStyles[t].label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {filtered.map((notice) => {
              const style = typeStyles[notice.type];
              const Icon = style.icon;
              return (
                <div key={notice.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden card-hover ${notice.pinned ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-gray-100'}`}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 ${style.bg} rounded-xl flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${style.color}`} />
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.color}`}>{style.label}</span>
                        {notice.pinned && (
                          <span className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                            <Pin className="w-3 h-3" /> Pinned
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{notice.date}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{notice.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{notice.body}</p>
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                      <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" /> {notice.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" /> {notice.comments}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <p className="font-semibold text-sm">Emergency Notice</p>
              </div>
              <p className="text-sm text-white/90">Fire drill on 16 Jun, 4 PM. Mandatory for all Block B residents.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> Upcoming Events
              </h2>
              <div className="space-y-3">
                {upcomingEvents.map((e) => (
                  <div key={e.title} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-indigo-600">{e.date.split(' ')[0]}</span>
                      <span className="text-[10px] text-indigo-400">{e.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{e.title}</p>
                      <p className="text-xs text-gray-400">{e.time} · {e.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Vote className="w-5 h-5 text-indigo-600" /> Active Poll
              </h2>
              <p className="text-sm text-gray-700 mb-3">{activePoll.question}</p>
              <div className="space-y-2">
                {activePoll.options.map((opt) => (
                  <div key={opt.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{opt.label}</span>
                      <span className="font-medium text-gray-800">{opt.pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-700" style={{ width: `${opt.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">{activePoll.totalVotes} votes · Ends 18 Jun</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-indigo-100/50">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <p className="font-semibold text-gray-800 text-sm">Engagement</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-indigo-50 rounded-xl">
                  <p className="text-xl font-extrabold text-indigo-600">94%</p>
                  <p className="text-xs text-gray-500">Read Rate</p>
                </div>
                <div className="text-center p-3 bg-cyan-50 rounded-xl">
                  <p className="text-xl font-extrabold text-cyan-600">12</p>
                  <p className="text-xs text-gray-500">Active Polls</p>
                </div>
              </div>
            </div>

            <Link to="/chat" className="flex items-center justify-between bg-indigo-600 text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md">
              <span className="flex items-center gap-2"><Bell className="w-4 h-4" /> Get AI summary of notices</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
