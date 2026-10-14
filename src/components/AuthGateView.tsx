import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Coins,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Shield,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const AuthGateView: React.FC = () => {
  const { signup, login, loginWithGoogleAction, navigateToRoute } = useApp();

  const [mode, setMode] = useState<'signup' | 'login'>('signup'); // Default to Signup
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!username.trim() || !email.trim()) {
        setError('Please enter a username and email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must contain at least 6 characters.');
        return;
      }
      setLoading(true);
      try {
        const res = await signup(username, email, password, referralCode);
        if (!res.success) {
          setError(res.message || 'Registration failed.');
        }
      } catch (err: any) {
        setError(err?.message || 'Server error occurred during signup.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim()) {
        setError('Please enter your account email.');
        return;
      }
      setLoading(true);
      try {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.message || 'Login failed.');
        }
      } catch (err: any) {
        setError(err?.message || 'Server error occurred during login.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-700">
      {/* Top Bar on Gate */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between max-w-7xl w-full mx-auto shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Coins className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">
              Tron<span className="text-emerald-600">Yield</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono block uppercase font-medium">
              USDT TRC-20 Platform
            </span>
          </div>
        </div>

        {/* Direct Link to Admin Portal */}
        <button
          onClick={() => navigateToRoute('admin')}
          className="text-xs font-mono text-slate-600 hover:text-amber-600 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-amber-400 transition-colors flex items-center gap-1.5 shadow-2xs font-medium"
        >
          <Shield className="w-3.5 h-3.5 text-amber-500" />
          <span>Admin Portal (/admin)</span>
        </button>
      </header>

      {/* Main Center Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Pitch */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-700 font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Membership Registration Required</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Sign Up First to Access{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Daily USDT Yield
              </span>
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Without signup or login, platform entry is restricted. Register your personal account to unlock TRON TRC-20 staking contracts, manual deposit verification, and daily yield generation.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 max-w-md mx-auto lg:mx-0 text-left">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-emerald-600 font-mono text-sm font-extrabold block">0.00 USD</span>
                <span className="text-[11px] text-slate-500 font-medium">Starting Balance</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-teal-600 font-mono text-sm font-extrabold block">10% - 20%</span>
                <span className="text-[11px] text-slate-500 font-medium">Daily Return</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-purple-600 font-mono text-sm font-extrabold block">Tiered 8%</span>
                <span className="text-[11px] text-slate-500 font-medium">Referral Bonus</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs text-slate-500 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero fake demo funds — 100% genuine TRC-20 settlement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Plans include guaranteed daily earnings (e.g. $30 plan = $3/day)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Manual administrator audit on all deposits & withdrawals</span>
              </div>
            </div>
          </div>

          {/* Right Column: Registration / Sign In Card */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              {/* Subtle Gradient Header Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

              {/* Toggle Switch */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account (Sign Up)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Already Member (Sign In)
                </button>
              </div>

              <div className="mb-5">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {mode === 'signup' ? 'Step 1: Create Your Account' : 'Welcome Back'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mode === 'signup'
                    ? 'Registration opens your dashboard with verified 0.00 USD balance.'
                    : 'Access your active portfolio, wallet, and staking contracts.'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Choose Username
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Satoshi_Trader"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Invitation / Referral Code (Optional)
                    </label>
                    <div className="relative">
                      <Sparkles className="w-4 h-4 text-amber-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. TY-ADMIN99"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        className="w-full pl-10 pr-3 py-2 text-xs font-mono uppercase text-amber-700 bg-amber-50/50 border border-amber-200 rounded-xl placeholder-amber-400 focus:bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Saving Account...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'signup' ? 'Complete Signup & Enter Platform' : 'Sign In to Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="relative my-3 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <span className="relative bg-white px-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Or Sign In with
                  </span>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    try {
                      const res = await loginWithGoogleAction(referralCode);
                      if (!res.success) setError(res.message || 'Google sign-in failed');
                    } catch (err: any) {
                      setError(err?.message || 'Google sign-in failed');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2 shadow-2xs"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.2.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.8 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 20.4 7.5 23 12 23z"
                    />
                  </svg>
                  <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        TronYield TRON TRC-20 Investment Protocol · Automated Smart Accounting & Manual Admin Verification
      </footer>
    </div>
  );
};
