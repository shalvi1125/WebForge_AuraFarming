import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ArrowRight, Users, Shield, ChevronRight, LogOut, User,
  BrainCircuit, ClipboardList, DoorOpen, CreditCard, UserCheck, BarChart3,
  Menu, X, Sparkles, Quote,
} from 'lucide-react';
import { useScrollReveal } from '@/react-app/hooks/useScrollReveal';
import HostelBlueprint from '@/react-app/components/HostelBlueprint';
import { HostelIQLogoMark } from '@/react-app/components/HostelIQLogo';
import { logoutSession } from '@/react-app/hooks/useAuth';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  preferences: unknown;
}

const testimonials = [
  { name: 'Dr. Priya Mehta', role: 'Warden, Tagore Hostel', quote: 'HostelIQ cut our complaint resolution time in half. AI categorization means the right team gets notified instantly.', avatar: 'PM' },
  { name: 'Aryan Sharma', role: 'CS Student, 3rd Year', quote: 'I can file complaints, apply for leave, and pay fees without standing in a single queue. The AI assistant answers everything.', avatar: 'AS' },
  { name: 'Dr. Rajesh Kumar', role: 'Campus Administrator', quote: 'Real-time occupancy analytics across 12 hostels. Capacity planning used to take weeks — now it takes minutes.', avatar: 'RK' },
];

const aiCapabilities = [
  { title: 'Complaint Categorization', metric: '94%', desc: 'Auto-tags and routes issues to the right department instantly.' },
  { title: 'Occupancy Prediction', metric: '91%', desc: 'Forecasts room availability 30 days ahead across all blocks.' },
  { title: 'Leave Optimization', metric: '2.4×', desc: 'Suggests optimal dates based on policies and occupancy.' },
  { title: 'Fee Recovery', metric: '₹4.2L', desc: 'AI identifies high-risk accounts and sends smart reminders.' },
];

export default function Landing() {
  const [user, setUser] = useState<UserData | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useScrollReveal();

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) setUser(JSON.parse(userData));
    } catch { /* ignore corrupt localStorage */ }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.profile-menu')) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    void logoutSession();
    setUser(null);
    setShowProfileMenu(false);
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* Nav */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#071B34]/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HostelIQLogoMark />
            <div>
              <p className="font-semibold text-[#F8FAFC] text-sm tracking-tight">HostelIQ</p>
              <p className="text-[10px] text-[#D1DEE6] uppercase tracking-widest font-semibold">Hostel Management</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <a href="#problem" className="text-sm text-[#D1DEE6] hover:text-[#F8FAFC] hover:bg-white/8 px-3 py-2 rounded-lg transition-all font-semibold">Problem</a>
            <a href="#ai" className="text-sm text-[#D1DEE6] hover:text-[#F8FAFC] hover:bg-white/8 px-3 py-2 rounded-lg transition-all font-semibold">AI</a>
            <Link to="/features" className="text-sm text-[#D1DEE6] hover:text-[#F8FAFC] hover:bg-white/8 px-3 py-2 rounded-lg transition-all font-semibold">Platform</Link>
            <Link to="/chat" className="text-sm text-[#D1DEE6] hover:text-[#F8FAFC] hover:bg-white/8 px-3 py-2 rounded-lg transition-all font-semibold">Assistant</Link>
            {user ? (
              <div className="relative profile-menu">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 text-sm text-[#F8FAFC] border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
                  <User className="w-4 h-4" />{user.firstName || user.username}
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#102A43] rounded-xl border border-white/10 shadow-2xl py-2">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-medium text-[#F8FAFC]">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-[#D1DEE6]/90">{user.email}</p>
                    </div>
                    <Link to="/student/profile" className="flex items-center px-4 py-2.5 text-sm text-[#D1DEE6] hover:text-[#F8FAFC] hover:bg-white/5" onClick={() => setShowProfileMenu(false)}>
                      <User className="w-4 h-4 mr-2" /> Profile
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-[#D1DEE6] hover:text-[#F8FAFC] hover:bg-white/5">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm text-[#D1DEE6] hover:text-[#F8FAFC] hover:bg-white/8 px-3 py-2 rounded-lg transition-all font-semibold">Sign in</Link>
                <Link to="/register" className="text-sm bg-[#4CC9F0] text-[#071B34] px-5 py-2 rounded-lg font-medium hover:bg-[#67E8F9] transition-colors">Get Started</Link>
              </div>
            )}
          </div>
          <button className="md:hidden text-[#F8FAFC]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-mesh-hero min-h-screen flex items-center">
        <div className="glow-orb w-[500px] h-[500px] bg-[#4CC9F0]/20 -top-32 -right-32" />
        <div className="glow-orb w-[400px] h-[400px] bg-[#1B4F72]/40 bottom-0 left-0" style={{ animationDelay: '3s' }} />
        <div className="gradient-mesh-content max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8 animate-fade-up">
              <p className="text-[#4CC9F0] text-sm font-medium tracking-wide uppercase">AI Powered Hostel Management</p>
              <h1 className="text-5xl lg:text-7xl font-semibold text-[#F8FAFC] leading-[1.05] tracking-tight">
                Smarter hostels.<br />
                <span className="text-gradient-highlight">Happier students.</span>
              </h1>
              <p className="text-lg text-[#D1DEE6] leading-relaxed max-w-lg">
                The intelligent platform built for universities. Automate room allocation, complaints, leave, and fee tracking — all in one place.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/student/dashboard" className="inline-flex items-center gap-2 bg-[#4CC9F0] text-[#071B34] px-6 py-3 rounded-lg font-semibold hover:bg-[#67E8F9] transition-colors text-sm">
                  Student Portal <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/warden/dashboard" className="inline-flex items-center gap-2 border border-white/20 text-[#F8FAFC] px-6 py-3 rounded-lg font-semibold hover:bg-white/8 transition-colors text-sm">
                  Warden Portal
                </Link>
                <Link to="/admin/dashboard" className="inline-flex items-center gap-2 border border-[#4CC9F0]/40 text-[#4CC9F0] px-6 py-3 rounded-lg font-semibold hover:bg-[#4CC9F0]/10 transition-colors text-sm">
                  Admin Portal
                </Link>
              </div>
              <div className="flex gap-12 pt-8 border-t border-white/10">
                {[['10,000+', 'Students'], ['500+', 'Hostels'], ['98%', 'Resolution']].map(([v, l]) => (
                  <div key={l}>
                    <p className="text-2xl font-semibold text-[#F8FAFC]">{v}</p>
                    <p className="text-xs text-[#D1DEE6]/80 mt-1 uppercase tracking-wider font-medium">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block animate-subtle-float">
              <div className="surface-panel-dark rounded-2xl p-8 border border-white/5">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                  <p className="text-sm text-[#D1DEE6]">Live Overview</p>
                  <span className="flex items-center gap-2 text-xs text-[#4CC9F0]"><span className="w-1.5 h-1.5 bg-[#4CC9F0] rounded-full animate-pulse" /> Active</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-[#D1DEE6]">Occupancy</span><span className="text-[#F8FAFC] font-medium">87%</span></div>
                    <div className="h-1 bg-white/10 rounded-full"><div className="h-full w-[87%] bg-[#4CC9F0] rounded-full" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[['248', 'Rooms'], ['1,024', 'Students'], ['14', 'Complaints'], ['6', 'Leave Pending']].map(([v, l]) => (
                      <div key={l} className="bg-white/5 rounded-xl p-4">
                        <p className="text-xl font-semibold text-[#F8FAFC]">{v}</p>
                        <p className="text-xs text-[#D1DEE6]/90 mt-1">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="section-depth py-32 px-6 lg:px-10">
        <HostelBlueprint className="blueprint-decor w-[480px] h-[360px] right-8 top-16 hidden lg:block" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center reveal-on-scroll">
          <div>
            <p className="text-sm text-[#1B4F72] font-medium uppercase tracking-widest mb-4">The Problem</p>
            <h2 className="text-4xl lg:text-5xl font-semibold text-[#071B34] leading-tight tracking-tight">
              Hostel management<br />wasn't designed for today.
            </h2>
          </div>
          <div className="space-y-6">
            {[
              { title: 'Paper-based records', desc: 'Lost files, manual errors, no audit trail.' },
              { title: 'Phone-based complaints', desc: 'No tracking, slow resolution, frustrated students.' },
              { title: 'Zero data visibility', desc: 'Admins flying blind without occupancy analytics.' },
            ].map((p) => (
              <div key={p.title} className="border-l-2 border-[#4CC9F0] pl-6 py-2">
                <p className="font-medium text-[#071B34]">{p.title}</p>
                <p className="text-[#374151] text-sm mt-1">{p.desc}</p>
              </div>
            ))}
            <p className="text-[#374151] pt-4 font-medium">HostelIQ replaces all of that with a unified, AI-powered platform.</p>
          </div>
        </div>
      </section>

      {/* AI Showcase */}
      <section id="ai" className="py-32 bg-[#071B34]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-20 reveal-on-scroll">
            <p className="text-[#4CC9F0] text-sm font-medium uppercase tracking-widest mb-4">Intelligence</p>
            <h2 className="text-4xl lg:text-5xl font-semibold text-[#F8FAFC] tracking-tight">AI that understands hostel operations.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden reveal-on-scroll">
            {aiCapabilities.map((item) => (
              <div key={item.title} className="bg-[#0A2342] p-8 lg:p-10 elevate-hover">
                <p className="text-4xl font-semibold text-gradient-highlight mb-4">{item.metric}</p>
                <p className="font-medium text-[#F8FAFC] mb-2">{item.title}</p>
                <p className="text-sm text-[#D1DEE6] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Experiences */}
      {[
        { role: 'Student', title: 'Your hostel workspace', desc: 'File complaints, apply for leave, manage fees, and track visitors — all from one calm, focused portal.', href: '/student/dashboard', icon: Users, features: ['Complaint tracking', 'Leave applications', 'Fee management', 'Room allocation'] },
        { role: 'Warden', title: 'Hostel control center', desc: 'Monitor occupancy, resolve complaints, approve leave, and act on AI-generated insights in real time.', href: '/warden/dashboard', icon: Shield, features: ['Complaint queue', 'Leave approvals', 'Occupancy monitoring', 'AI alerts'], dark: true },
        { role: 'Admin', title: 'Executive campus overview', desc: 'Campus-wide analytics, revenue tracking, capacity planning, and predictive forecasting for every hostel.', href: '/admin/dashboard', icon: BarChart3, features: ['Campus analytics', 'Revenue metrics', 'Capacity planning', 'AI forecasting'] },
      ].map((portal, i) => {
        const Icon = portal.icon;
        return (
          <section key={portal.role} className={`py-32 relative overflow-hidden ${portal.dark ? 'bg-[#102A43]' : 'section-depth'}`}>
            {!portal.dark && <HostelBlueprint className="blueprint-decor w-80 h-60 left-4 bottom-8 hidden lg:block" />}
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
              <div className={`grid lg:grid-cols-2 gap-16 items-center reveal-on-scroll ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <p className={`text-sm font-medium uppercase tracking-widest mb-4 ${portal.dark ? 'text-[#4CC9F0]' : 'text-[#1B4F72]'}`}>{portal.role} Experience</p>
                  <h2 className={`text-4xl font-semibold tracking-tight mb-6 ${portal.dark ? 'text-[#F8FAFC]' : 'text-[#071B34]'}`}>{portal.title}</h2>
                  <p className={`text-lg leading-relaxed mb-8 font-medium ${portal.dark ? 'text-[#D1DEE6]' : 'text-[#374151]'}`}>{portal.desc}</p>
                  <ul className="space-y-3 mb-10">
                    {portal.features.map((f) => (
                      <li key={f} className={`flex items-center gap-3 text-sm ${portal.dark ? 'text-[#374151]' : 'text-[#071B34]'}`}>
                        <ChevronRight className={`w-4 h-4 ${portal.dark ? 'text-[#4CC9F0]' : 'text-[#1B4F72]'}`} />{f}
                      </li>
                    ))}
                  </ul>
                  <Link to={portal.href} className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${portal.dark ? 'bg-[#4CC9F0] text-[#071B34] hover:bg-[#67E8F9]' : 'bg-[#071B34] text-[#F8FAFC] hover:bg-[#0A2342]'}`}>
                    Open {portal.role} Portal <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className={`rounded-2xl p-10 min-h-[320px] flex items-center justify-center section-glass-panel ${portal.dark ? 'bg-[#071B34] border border-white/5' : ''} ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="text-center">
                    <Icon className={`w-16 h-16 mx-auto mb-4 ${portal.dark ? 'text-[#4CC9F0]' : 'text-[#1B4F72]'}`} />
                    <p className={`text-sm uppercase tracking-widest ${portal.dark ? 'text-[#D1DEE6]/80' : 'text-[#374151]'}`}>{portal.role} Portal Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Testimonials */}
      <section className="section-depth py-32 relative">
        <HostelBlueprint className="blueprint-decor w-72 h-52 right-12 top-20 hidden lg:block" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-sm text-[#1B4F72] font-medium uppercase tracking-widest mb-4 reveal-on-scroll">Testimonials</p>
        <h2 className="text-4xl font-semibold text-[#071B34] tracking-tight mb-16 reveal-on-scroll">Trusted by campus leaders.</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="surface-panel rounded-2xl p-8 elevate-hover reveal-on-scroll">
              <Quote className="w-8 h-8 text-[#4CC9F0]/40 mb-6" />
              <p className="text-[#071B34] leading-relaxed mb-8">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-6 border-t border-[#071B34]/5">
                <div className="w-10 h-10 bg-[#1B4F72] rounded-full flex items-center justify-center text-[#F8FAFC] text-sm font-medium">{t.avatar}</div>
                <div>
                  <p className="font-medium text-[#071B34] text-sm">{t.name}</p>
                  <p className="text-xs text-[#374151]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-mesh-hero py-32">
        <div className="gradient-mesh-content max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-semibold text-[#F8FAFC] tracking-tight mb-6">Ready to modernize your hostel?</h2>
          <p className="text-[#D1DEE6] text-lg mb-10 font-medium">Join universities already using HostelIQ to manage smarter, not harder.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-[#4CC9F0] text-[#071B34] px-8 py-3.5 rounded-lg font-medium hover:bg-[#67E8F9] transition-colors">Start for Free</Link>
            <Link to="/login" className="border border-white/15 text-[#F8FAFC] px-8 py-3.5 rounded-lg font-medium hover:bg-white/5 transition-colors">Sign In</Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#071B34] py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#D1DEE6] text-sm">© 2025 HostelIQ. AI Powered Hostel Management.</p>
          <div className="flex gap-6 text-sm text-[#D1DEE6]">
            <Link to="/login" className="hover:text-[#F8FAFC] transition-colors">Login</Link>
            <Link to="/register" className="hover:text-[#F8FAFC] transition-colors">Register</Link>
            <Link to="/chat" className="hover:text-[#F8FAFC] transition-colors">AI Assistant</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
