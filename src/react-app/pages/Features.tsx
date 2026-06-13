import { Link } from 'react-router';
import {
  Building2, BrainCircuit, ClipboardList, DoorOpen, CreditCard,
  UserCheck, BarChart3, Shield, ArrowRight, Layers, Zap, Cpu,
  ChevronRight, Users,
} from 'lucide-react';

const capabilities = [
  { icon: Building2, title: 'Smart Room Allocation', desc: 'AI-powered room assignment with preference matching, conflict detection, and occupancy optimization.', color: 'from-indigo-500 to-blue-500' },
  { icon: ClipboardList, title: 'Complaint Management', desc: 'End-to-end complaint lifecycle with AI categorization, priority prediction, and resolution tracking.', color: 'from-blue-500 to-cyan-500' },
  { icon: DoorOpen, title: 'Leave Management', desc: 'Digital leave applications, warden approval workflows, and automated security notifications.', color: 'from-cyan-500 to-indigo-500' },
  { icon: UserCheck, title: 'Visitor Management', desc: 'Pre-registration, QR pass generation, entry/exit logging, and security dashboard integration.', color: 'from-indigo-500 to-purple-500' },
  { icon: CreditCard, title: 'Fee Management', desc: 'Real-time fee tracking, payment history, automated reminders, and financial analytics.', color: 'from-emerald-500 to-teal-500' },
  { icon: BarChart3, title: 'Admin Analytics', desc: 'Executive dashboards with occupancy trends, revenue metrics, and AI capacity forecasting.', color: 'from-violet-500 to-indigo-500' },
];

const aiFeatures = [
  { title: 'AI Complaint Categorization', desc: 'Automatically tags, routes, and prioritizes complaints to the right department.', icon: Zap },
  { title: 'AI Leave Suggestions', desc: 'Recommends optimal leave dates based on policies, exams, and hostel occupancy.', icon: DoorOpen },
  { title: 'AI Occupancy Predictions', desc: 'Forecasts room availability and capacity needs across all hostels.', icon: BarChart3 },
  { title: 'AI Room Allocation', desc: 'Matches students to rooms based on preferences, compatibility, and availability.', icon: Building2 },
  { title: 'AI Hostel Insights', desc: 'Proactive alerts on maintenance patterns, fee recovery, and operational risks.', icon: BrainCircuit },
  { title: 'AI Capacity Planning', desc: 'Helps admins plan hostel capacity with semester-wise demand forecasting.', icon: Cpu },
];

const journeys = [
  { role: 'Student', steps: ['Login → Dashboard', 'File complaint / Apply leave', 'Track status in real-time', 'Get AI guidance via chat'], badge: 'bg-indigo-50 text-indigo-700' },
  { role: 'Warden', steps: ['Review complaint queue', 'Approve leave requests', 'Monitor occupancy', 'Act on AI alerts'], badge: 'bg-blue-50 text-blue-700' },
  { role: 'Admin', steps: ['Campus-wide analytics', 'Room allocation oversight', 'Fee collection reports', 'Capacity planning'], badge: 'bg-cyan-50 text-cyan-700' },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-white page-enter">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HostelIQ</h1>
              <p className="text-xs text-indigo-500">Platform Features</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/chat" className="text-sm text-gray-600 hover:text-indigo-600 font-medium">AI Assistant</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 py-24">
        <div className="absolute inset-0 gradient-mesh pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Layers className="w-4 h-4" /> Platform Capabilities
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Everything HostelIQ{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">Delivers</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            One intelligent platform for students, wardens, admins, and visitors — powered by AI at every step.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-10 text-center">Core Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm card-hover group">
                <div className={`w-12 h-12 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <BrainCircuit className="w-4 h-4" /> AI-Powered
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Intelligence Built In</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-card rounded-2xl p-5 border border-indigo-100/50 card-hover">
                  <Icon className="w-5 h-5 text-indigo-600 mb-3" />
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-10 text-center">User Journeys</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {journeys.map((j) => (
            <div key={j.role} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className={`inline-flex items-center gap-2 ${j.badge} px-3 py-1 rounded-full text-sm font-semibold mb-4`}>
                <Users className="w-4 h-4" /> {j.role}
              </div>
              <ol className="space-y-3">
                {j.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <span className="text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-indigo-900 to-blue-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">See HostelIQ in Action</h2>
          <p className="text-indigo-200 mb-8">Explore the platform with our interactive prototype.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/student/dashboard" className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2">
              Student Portal <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/admin/dashboard" className="border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
              Admin Portal <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/chat" className="border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
              AI Assistant <BrainCircuit className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-8 text-center">
        <Link to="/" className="text-white font-semibold hover:text-indigo-300">← Back to HostelIQ Home</Link>
      </footer>
    </div>
  );
}
