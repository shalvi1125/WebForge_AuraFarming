import { useState } from 'react';
import { Link } from 'react-router';
import {
  Megaphone, Calendar, Utensils, Wrench, AlertTriangle, Bell,
  ChevronRight, Pin, ThumbsUp, MessageCircle, Vote, Sparkles, Clock,
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

const typeLabels: Record<NoticeType, string> = {
  general: 'General', mess: 'Mess', maintenance: 'Maintenance', emergency: 'Emergency', event: 'Event',
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

const featured = notices.find((n) => n.pinned) || notices[0];

export default function Announcements() {
  const [filter, setFilter] = useState<NoticeType | 'all'>('all');
  const filtered = filter === 'all' ? notices : notices.filter((n) => n.type === filter);

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav portal="Campus Notice Board" userName="Aryan Sharma" userMeta="Tagore Hostel" avatar="AS" homeHref="/student/dashboard"
        links={[{ label: 'Dashboard', href: '/student/dashboard' }, { label: 'Leave', href: '/student/leave' }, { label: 'Fees', href: '/student/fees' }]} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <header className="mb-16">
          <p className="text-xs text-[#1B4F72] uppercase tracking-widest mb-3">Tagore Hostel</p>
          <h1 className="text-4xl lg:text-5xl font-semibold text-[#071B34] tracking-tight">Campus Notice Board</h1>
          <p className="text-[#374151] mt-4 max-w-xl">Notices, events, mess updates, and emergency alerts — curated for your hostel.</p>
        </header>

        {/* Featured announcement — editorial */}
        <section className="mb-20 surface-panel-dark rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <Pin className="w-4 h-4 text-[#4CC9F0]" />
                <span className="text-xs text-[#4CC9F0] uppercase tracking-widest">Featured</span>
                <span className="text-xs text-[#374151]">{featured.date}</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-[#F8FAFC] tracking-tight mb-4">{featured.title}</h2>
              <p className="text-[#374151] leading-relaxed">{featured.body}</p>
              <div className="flex items-center gap-6 mt-8 text-sm text-[#374151]">
                <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4" /> {featured.likes}</span>
                <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> {featured.comments}</span>
              </div>
            </div>
            <div className="bg-[#0A2342] min-h-[240px] flex items-center justify-center relative overflow-hidden">
              <div className="glow-orb w-64 h-64 bg-[#4CC9F0]/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <Megaphone className="w-16 h-16 text-[#4CC9F0]/40 relative z-10" />
            </div>
          </div>
        </section>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {(['all', 'general', 'mess', 'maintenance', 'emergency', 'event'] as const).map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === t ? 'bg-[#071B34] text-[#F8FAFC]' : 'text-[#374151] hover:text-[#071B34] hover:bg-white'}`}>
              {t === 'all' ? 'All' : typeLabels[t]}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Notice feed — editorial list, not cards */}
          <div className="lg:col-span-2 space-y-0">
            {filtered.map((notice) => (
              <article key={notice.id} className="py-10 border-b border-[#071B34]/5 group">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs text-[#1B4F72] uppercase tracking-widest">{typeLabels[notice.type]}</span>
                  <span className="text-xs text-[#374151] flex items-center gap-1"><Clock className="w-3 h-3" />{notice.date}</span>
                  {notice.pinned && <Pin className="w-3 h-3 text-[#4CC9F0]" />}
                </div>
                <h3 className="text-xl font-semibold text-[#071B34] mb-3 group-hover:text-[#1B4F72] transition-colors">{notice.title}</h3>
                <p className="text-[#374151] leading-relaxed max-w-2xl">{notice.body}</p>
                <div className="flex items-center gap-6 mt-6 text-sm text-[#374151]">
                  <button className="flex items-center gap-1.5 hover:text-[#4CC9F0] transition-colors"><ThumbsUp className="w-4 h-4" /> {notice.likes}</button>
                  <button className="flex items-center gap-1.5 hover:text-[#4CC9F0] transition-colors"><MessageCircle className="w-4 h-4" /> {notice.comments}</button>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar — timeline + engagement */}
          <aside className="space-y-16">
            <div>
              <p className="text-xs text-[#1B4F72] uppercase tracking-widest mb-6">Emergency</p>
              <div className="border-l-2 border-[#4CC9F0] pl-6">
                <AlertTriangle className="w-5 h-5 text-[#4CC9F0] mb-3" />
                <p className="font-medium text-[#071B34]">Fire drill on 16 Jun, 4 PM</p>
                <p className="text-sm text-[#374151] mt-2">Mandatory for all Block B residents.</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-[#1B4F72] uppercase tracking-widest mb-6">Event Timeline</p>
              <div className="space-y-0">
                {upcomingEvents.map((e, i) => (
                  <div key={e.title} className="flex gap-6 pb-8 relative">
                    {i < upcomingEvents.length - 1 && <div className="absolute left-[7px] top-4 bottom-0 w-px bg-[#071B34]/10" />}
                    <div className="w-4 h-4 rounded-full bg-[#1B4F72] shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-[#4CC9F0] mb-1">{e.date}</p>
                      <p className="font-medium text-[#071B34]">{e.title}</p>
                      <p className="text-xs text-[#374151] mt-1">{e.time} · {e.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-[#1B4F72] uppercase tracking-widest mb-6">Active Poll</p>
              <p className="text-[#071B34] font-medium mb-4">{activePoll.question}</p>
              <div className="space-y-4">
                {activePoll.options.map((opt) => (
                  <div key={opt.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#374151]">{opt.label}</span>
                      <span className="text-[#071B34]">{opt.pct}%</span>
                    </div>
                    <div className="h-1 bg-[#071B34]/5 rounded-full"><div className="h-full bg-[#1B4F72] rounded-full" style={{ width: `${opt.pct}%` }} /></div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#374151] mt-4">{activePoll.totalVotes} votes · Ends 18 Jun</p>
            </div>

            <div className="pt-8 border-t border-[#071B34]/5">
              <p className="text-xs text-[#1B4F72] uppercase tracking-widest mb-4">Engagement</p>
              <div className="flex gap-12">
                <div><p className="text-3xl font-semibold text-[#071B34]">94%</p><p className="text-xs text-[#374151] mt-1">Read rate</p></div>
                <div><p className="text-3xl font-semibold text-[#071B34]">12</p><p className="text-xs text-[#374151] mt-1">Active polls</p></div>
              </div>
            </div>

            <Link to="/chat" className="inline-flex items-center gap-2 text-sm text-[#1B4F72] hover:text-[#4CC9F0] transition-colors">
              <Sparkles className="w-4 h-4" /> Get AI summary of notices <ChevronRight className="w-4 h-4" />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
