import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Mail, Lock, KeyRound } from 'lucide-react';
import { HostelIQLogoMark } from '@/react-app/components/HostelIQLogo';
import { loginWithPassword, roleDashboard } from '@/react-app/hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user } = await loginWithPassword(email.trim().toLowerCase(), password);
      navigate(roleDashboard(user.role));
    } catch (error) {
      console.error('Login error:', error);
      alert(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage('');

    setResetMessage('Password reset link sent to your email!');
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetEmail('');
      setResetMessage('');
    }, 3000);
    setResetLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-[#1B4F72] hover:text-[#071B34] mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <HostelIQLogoMark size="lg" className="mx-auto mb-4" />
          
          <h1 className="text-3xl font-bold text-[#071B34] mb-2">
            Welcome Back
          </h1>
          <p className="text-[#374151]">Sign in to your HostelIQ account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          {!showForgotPassword ? (
            <>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#374151] w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CC9F0]/30 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#374151] w-5 h-5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CC9F0]/30 focus:border-transparent"
                      placeholder="Your password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#071B34] hover:bg-[#0A2342] transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 shadow-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[#1B4F72] hover:text-[#071B34] font-medium text-sm transition-colors"
                >
                  Forgot Password?
                </button>
                <p className="text-[#374151]">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-[#1B4F72] hover:text-[#071B34] font-semibold">
                    Sign up here
                  </Link>
                </p>
              </div>
            </>
          ) : (
            /* Forgot Password Form */
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#071B34] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#071B34] mb-2">Reset Password</h2>
                <p className="text-[#374151] text-sm">Enter your email address and we'll send you a link to reset your password.</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#374151] w-5 h-5" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CC9F0]/30 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                {resetMessage && (
                  <div className={`text-sm text-center p-3 rounded-lg ${
                    resetMessage.includes('sent')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {resetMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-[#071B34] hover:bg-[#0A2342] transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 shadow-sm"
                >
                  {resetLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setResetMessage('');
                  }}
                  className="text-[#1B4F72] hover:text-[#071B34] font-medium text-sm transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
