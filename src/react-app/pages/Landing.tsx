import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  Users,
  Shield,
  ChevronRight,
  LogOut,
  User,
  Building2,
  BrainCircuit,
  ClipboardList,
  DoorOpen,
  CreditCard,
  UserCheck,
  BarChart3,
  Cpu,
  Menu,
  X,
} from 'lucide-react';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  preferences: any;
}

const features = [
  {
    icon: Building2,
    title: 'Room Allocation',
    desc: 'Automated room assignment based on preferences, availability, and occupancy — zero manual effort.',
    color: 'from-indigo-500 to-blue-500',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    icon: ClipboardList,
    title: 'Complaint Management',
    desc: 'Students raise complaints digitally. Wardens track, prioritize, and resolve them in real time.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: DoorOpen,
    title: 'Leave Requests',
    desc: 'Streamlined leave application, approval, and record-keeping for students and wardens.',
    color: 'from-cyan-500 to-indigo-500',
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
  {
    icon: UserCheck,
    title: 'Visitor Management',
    desc: 'Pre-register visitors, track entry/exit, and maintain a complete visitor log automatically.',
    color: 'from-indigo-500 to-cyan-500',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    icon: CreditCard,
    title: 'Fee Tracking',
    desc: 'View fee dues, payment history, and receive automated reminders — all in one place.',
    color: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: BarChart3,
    title: 'AI Analytics',
    desc: 'Smart dashboards with occupancy trends, complaint patterns, and predictive insights.',
    color: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
  {
    icon: BrainCircuit,
    title: 'AI Complaint Categorization',
    desc: 'AI automatically tags, routes, and prioritizes complaints — reducing resolution time dramatically.',
    color: 'from-indigo-600 to-blue-600',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    icon: Cpu,
    title: 'Smart Occupancy Insights',
    desc: 'Real-time occupancy heatmaps and forecasting to help admins plan hostel capacity intelligently.',
    color: 'from-blue-600 to-cyan-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
];

const stats = [
  { value: '10,000+', label: 'Students Managed' },
  { value: '500+', label: 'Hostels Onboarded' },
  { value: '98%', label: 'Complaint Resolution Rate' },
  { value: '3x', label: 'Faster than Manual Systems' },
];

export default function Landing() {
  const [user, setUser] = useState<UserData | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">

      {/* ── Navbar ── */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-none">HostelIQ</h1>
                <p className="text-xs text-indigo-500 font-medium">AI Powered Hostel Management</p>
              </div>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm">
                About
              </a>
              <Link to="/chat" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm">
                AI Assistant
              </Link>

              {user ? (
                <div className="relative profile-menu">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 text-sm font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.firstName || user.username}</span>
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          My Profile
                        </Link>
                        <button
                          onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            setUser(null);
                            setShowProfileMenu(false);
                            window.location.reload();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 space-y-3">
              <a href="#features" className="block text-gray-600 hover:text-indigo-600 font-medium text-sm py-1">Features</a>
              <a href="#about" className="block text-gray-600 hover:text-indigo-600 font-medium text-sm py-1">About</a>
              <Link to="/chat" className="block text-gray-600 hover:text-indigo-600 font-medium text-sm py-1">AI Assistant</Link>
              <div className="flex space-x-3 pt-2">
                <Link to="/login" className="flex-1 text-center border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium">Login</Link>
                <Link to="/register" className="flex-1 text-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Get Started</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium">
                  <BrainCircuit className="w-4 h-4" />
                  <span>AI-Powered Platform</span>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  HostelIQ
                  <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Smarter Hostels.
                  </span>
                  <span className="block text-4xl lg:text-5xl text-gray-700 font-bold">
                    Happier Students.
                  </span>
                </h1>

                <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
                  The AI-powered hostel management system built for universities. Automate room allocation,
                  complaints, leave, and fee tracking — all in one intelligent platform.
                </p>
              </div>

              {/* Portal buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <Link
                  to="/student/dashboard"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-7 py-3.5 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold shadow-md hover:shadow-indigo-200 hover:shadow-lg"
                >
                  <Users className="w-5 h-5" />
                  <span>Student Portal</span>
                </Link>
                <Link
                  to="/warden/dashboard"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-7 py-3.5 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold shadow-md hover:shadow-blue-200 hover:shadow-lg"
                >
                  <Shield className="w-5 h-5" />
                  <span>Warden Portal</span>
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="border-2 border-indigo-600 text-indigo-700 px-7 py-3.5 rounded-xl hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold"
                >
                  <Building2 className="w-5 h-5" />
                  <span>Admin Portal</span>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span>Real-time sync</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>Role-based access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>AI insights built-in</span>
                </div>
              </div>
            </div>

            {/* Right: Dashboard preview card */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Card header bar */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <span className="ml-3 text-white/80 text-sm font-medium">HostelIQ Dashboard</span>
                </div>
                {/* Mock dashboard content */}
                <div className="p-6 space-y-4 bg-gray-50">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Rooms', value: '248', color: 'text-indigo-600' },
                      { label: 'Students', value: '1,024', color: 'text-blue-600' },
                      { label: 'Open Issues', value: '12', color: 'text-cyan-600' },
                    ].map((s) => (
                      <div key={s.label} className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                        <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* Occupancy bar */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span className="font-medium text-gray-700">Occupancy Rate</span>
                      <span className="text-indigo-600 font-semibold">87%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-[87%] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" />
                    </div>
                  </div>
                  {/* Recent complaints */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Recent Complaints</p>
                    {[
                      { text: 'Water leakage in Block B', tag: 'Maintenance', tagColor: 'bg-blue-100 text-blue-700' },
                      { text: 'Wi-Fi outage in Room 204', tag: 'Network', tagColor: 'bg-indigo-100 text-indigo-700' },
                      { text: 'Mess food quality issue', tag: 'Catering', tagColor: 'bg-cyan-100 text-cyan-700' },
                    ].map((c) => (
                      <div key={c.text} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 truncate mr-2">{c.text}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${c.tagColor}`}>{c.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating AI badge */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 text-sm font-medium">
                <BrainCircuit className="w-4 h-4" />
                <span>AI Insights Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold">{s.value}</p>
                <p className="text-indigo-100 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium">
              <Cpu className="w-4 h-4" />
              <span>Everything you need</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900">
              Powerful Features,{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Zero Complexity
              </span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              HostelIQ brings every aspect of hostel management into one intelligent platform — so wardens
              manage less and students experience more.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-6 h-6 ${f.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: illustration / visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100">
                <div className="space-y-4">
                  {/* Problem cards */}
                  {[
                    { icon: '📋', title: 'Paper-based records', sub: 'Lost files, manual errors, no audit trail' },
                    { icon: '📞', title: 'Phone-based complaints', sub: 'No tracking, slow resolution, frustrated students' },
                    { icon: '📊', title: 'No data insights', sub: 'Admins flying blind without occupancy analytics' },
                  ].map((p) => (
                    <div key={p.title} className="flex items-start space-x-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <span className="text-2xl">{p.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{p.title}</p>
                        <p className="text-xs text-gray-500">{p.sub}</p>
                      </div>
                    </div>
                  ))}
                  {/* Arrow */}
                  <div className="text-center py-2">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md">
                      <BrainCircuit className="w-4 h-4" />
                      <span>HostelIQ solves all of this</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: About text */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium">
                  <Building2 className="w-4 h-4" />
                  <span>The problem we're solving</span>
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                  Hostel Management
                  <span className="block bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                    Reimagined for the AI Era
                  </span>
                </h2>
              </div>

              <p className="text-gray-500 leading-relaxed">
                University hostels today run on spreadsheets, phone calls, and paper forms. Students wait
                days for complaint resolutions. Wardens drown in administrative work. Admins have zero
                visibility into real-time occupancy.
              </p>

              <p className="text-gray-500 leading-relaxed">
                HostelIQ replaces all of that with a unified, AI-powered platform. Students get a
                transparent self-service portal. Wardens get smart dashboards with AI-categorized complaints.
                Admins get predictive occupancy analytics — all in real time.
              </p>

              <div className="space-y-3">
                {[
                  'Automated room allocation with conflict-free assignment',
                  'AI complaint categorization — right person, right time',
                  'Digital leave and visitor management with audit trails',
                  'Live fee dashboards and automated reminders',
                ].map((point) => (
                  <div key={point} className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight className="w-3 h-3 text-indigo-600" />
                    </div>
                    <p className="text-gray-600 text-sm">{point}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-7 py-3.5 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-indigo-200 hover:shadow-lg"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl font-extrabold text-white">
            Ready to modernize your hostel?
          </h2>
          <p className="text-indigo-200 text-lg">
            Join universities already using HostelIQ to manage smarter, not harder.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center space-x-2 shadow-md"
            >
              <span>Start for Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">HostelIQ</span>
          </div>
          <p className="text-gray-500 text-sm">© 2025 HostelIQ. AI Powered Hostel Management System.</p>
          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <Link to="/login" className="hover:text-gray-300 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-gray-300 transition-colors">Register</Link>
            <Link to="/chat" className="hover:text-gray-300 transition-colors">AI Assistant</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
