import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, GraduationCap, Shield, BarChart3 } from 'lucide-react';
import { HostelIQLogoMark } from '@/react-app/components/HostelIQLogo';
import { createMockSession, roleDashboard, saveMockUser, UserRole } from '@/react-app/hooks/useAuth';

interface UserPreferences {
  complaints: boolean;
  leaveRequests: boolean;
  roomManagement: boolean;
  feeTracking: boolean;
  visitorManagement: boolean;
  hostelEvents: boolean;
  messFeedback: boolean;
  maintenanceRequests: boolean;
  security: boolean;
  generalSupport: boolean;
}

const ROLES: { value: UserRole; label: string; desc: string; icon: typeof GraduationCap }[] = [
  { value: 'student',  label: 'Student',  desc: 'File complaints, apply for leave, manage fees', icon: GraduationCap },
  { value: 'warden',  label: 'Warden',   desc: 'Manage block, approve leave, resolve complaints', icon: Shield },
  { value: 'admin',   label: 'Admin',    desc: 'Campus-wide analytics and oversight', icon: BarChart3 },
];

export default function Signup() {
  const [step, setStep] = useState(1); // 1=role, 2=account, 3=preferences
  const [role, setRole] = useState<UserRole>('student');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    complaints: false,
    leaveRequests: false,
    roomManagement: false,
    feeTracking: false,
    visitorManagement: false,
    hostelEvents: false,
    messFeedback: false,
    maintenanceRequests: false,
    security: false,
    generalSupport: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePreferenceChange = (preference: keyof UserPreferences) => {
    setPreferences(prev => ({ ...prev, [preference]: !prev[preference] }));
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const user = {
        id: Date.now(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        role,
        preferences,
      };

      saveMockUser(user, formData.password);
      createMockSession(user);
      navigate(roleDashboard(user.role as UserRole));
    } catch {
      alert('Signup failed. Please try again.');
    }
    setIsLoading(false);
  };

  const preferenceOptions = [
    { key: 'complaints',          label: 'Complaints',        icon: '🔧' },
    { key: 'leaveRequests',       label: 'Leave Requests',    icon: '📋' },
    { key: 'roomManagement',      label: 'Room Management',   icon: '🛏️' },
    { key: 'feeTracking',         label: 'Fee Tracking',      icon: '💳' },
    { key: 'visitorManagement',   label: 'Visitor Mgmt',      icon: '👤' },
    { key: 'hostelEvents',        label: 'Hostel Events',     icon: '📅' },
    { key: 'messFeedback',        label: 'Mess Feedback',     icon: '🍛' },
    { key: 'maintenanceRequests', label: 'Maintenance',       icon: '⚙️' },
    { key: 'security',            label: 'Security',          icon: '�' },
    { key: 'generalSupport',      label: 'General Support',   icon: '�' },
  ];

  // ── Step 1: Role selection ──
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 text-[#1B4F72] hover:text-[#071B34] mb-4">
              <ArrowLeft className="w-5 h-5" /><span>Back to Home</span>
            </Link>
            <HostelIQLogoMark size="lg" className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-[#071B34] mb-2">Join HostelIQ</h1>
            <p className="text-[#374151]">Choose your role to get started</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 space-y-4">
            {ROLES.map(({ value, label, desc, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setRole(value)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  role === value
                    ? 'border-[#1B4F72] bg-[#071B34]/5'
                    : 'border-gray-200 hover:border-[#4CC9F0]/40'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${role === value ? 'bg-[#071B34] text-white' : 'bg-gray-100 text-[#374151]'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${role === value ? 'text-[#071B34]' : 'text-[#374151]'}`}>{label}</p>
                  <p className="text-xs text-[#374151] mt-0.5">{desc}</p>
                </div>
              </button>
            ))}

            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#071B34] hover:bg-[#0A2342] text-white py-3 rounded-xl font-semibold transition-colors mt-2"
            >
              Continue as {ROLES.find(r => r.value === role)?.label}
            </button>

            <p className="text-center text-[#374151] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#1B4F72] hover:text-[#071B34] font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Account details ──
  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <HostelIQLogoMark size="lg" className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-[#071B34] mb-2">Create Account</h1>
            <p className="text-[#374151]">Signing up as <span className="font-semibold capitalize text-[#1B4F72]">{role}</span></p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-2">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CC9F0]/30 focus:border-transparent"
                    placeholder="John" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-2">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CC9F0]/30 focus:border-transparent"
                    placeholder="Doe" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#374151] w-5 h-5" />
                  <input type="text" name="username" value={formData.username} onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CC9F0]/30 focus:border-transparent"
                    placeholder="johndoe123" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#374151] w-5 h-5" />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CC9F0]/30 focus:border-transparent"
                    placeholder="your@email.com" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#374151] w-5 h-5" />
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CC9F0]/30 focus:border-transparent"
                    placeholder="Create a strong password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#374151] hover:text-[#1B4F72]">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 border-2 border-gray-200 text-[#374151] py-3 rounded-xl hover:bg-[#F5F7FA] transition-colors font-medium">
                  Back
                </button>
                <button type="submit" className="flex-1 bg-[#071B34] hover:bg-[#0A2342] text-white py-3 rounded-xl font-semibold transition-colors">
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 3: Preferences ──
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <HostelIQLogoMark size="lg" className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#071B34] mb-2">Your Hostel Interests</h1>
          <p className="text-[#374151]">Select the areas you'll use most in HostelIQ</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {preferenceOptions.map((option) => (
              <button key={option.key} onClick={() => handlePreferenceChange(option.key as keyof UserPreferences)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  preferences[option.key as keyof UserPreferences]
                    ? 'border-[#1B4F72] bg-[#071B34]/5 text-[#071B34]'
                    : 'border-[#071B34]/10 hover:border-[#4CC9F0]/30'
                }`}>
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="text-sm font-medium">{option.label}</div>
              </button>
            ))}
          </div>

          <div className="flex space-x-4">
            <button onClick={() => setStep(2)}
              className="flex-1 border-2 border-gray-200 text-[#374151] py-3 rounded-xl hover:bg-[#F5F7FA] transition-all font-medium">
              Back
            </button>
            <button onClick={handleSignup} disabled={isLoading}
              className="flex-1 bg-[#071B34] hover:bg-[#0A2342] text-white py-3 rounded-xl font-semibold flex items-center justify-center disabled:opacity-50 transition-colors">
              {isLoading
                ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                : 'Complete Signup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
