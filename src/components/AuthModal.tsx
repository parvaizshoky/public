import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User as UserIcon, Shield, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, signup, loginWithGoogleAction, switchUser, users } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (!email) {
        setError('Please enter your email address.');
        return;
      }
      setLoading(true);
      try {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.message || 'Login failed.');
          return;
        }
        onClose();
      } catch (err: any) {
        setError(err?.message || 'Server error occurred during login.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!username || !email) {
        setError('Username and email are required.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      setLoading(true);
      try {
        const res = await signup(username, email, password, referralCode);
        if (!res.success) {
          setError(res.message || 'Signup failed.');
          return;
        }
        onClose();
      } catch (err: any) {
        setError(err?.message || 'Server error occurred during registration.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Quick 1-click test logins
  const handleQuickLogin = async (emailTarget: string) => {
    setLoading(true);
    try {
      const res = await login(emailTarget);
      if (res.success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickNewAccount = async () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setLoading(true);
    try {
      const res = await signup(`NewInvestor_${randomId}`, `investor${randomId}@tronyield.io`, '123456');
      if (res.success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back to TronYield' : 'Start Earning USDT TRC-20 Yield'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Access your portfolio, daily accrued returns, and transactions.'
              : 'Fresh accounts initialize with 0.00 USD balance. Fund with TRC-20 anytime.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Satoshi_99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Referral Code (Optional)
              </label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-2.5 w-4 h-4 text-amber-500/80" />
                <input
                  type="text"
                  placeholder="e.g. TY-ADMIN99 or TY-ALEX77"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono bg-slate-950 border border-slate-800 rounded-lg text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all uppercase"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Enter an inviter code to unlock tier-based referral benefits.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold text-sm rounded-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Saving to Firebase Server...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Account' : 'Register Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="relative my-2.5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative bg-slate-900 px-2 text-[10px] text-slate-500 uppercase tracking-wider">
              Or Firebase Auth
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
                if (res.success) {
                  onClose();
                } else {
                  setError(res.message || 'Google sign-in failed');
                }
              } catch (err: any) {
                setError(err?.message || 'Google sign-in failed');
              } finally {
                setLoading(false);
              }
            }}
            className="w-full py-2 px-3 bg-slate-950 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold text-xs rounded-lg border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
            <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>
        </form>

        {/* 1-Click Fast Sandbox Testing Helpers */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Quick Sandbox Testing Credentials:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@tronyield.io')}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-lg text-slate-300 hover:text-amber-300 text-left transition-colors"
            >
              <div className="font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-400" />
                Admin Panel
              </div>
              <div className="text-[10px] text-slate-500 truncate">admin@tronyield.io</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('investor@tronyield.io')}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-lg text-slate-300 hover:text-emerald-300 text-left transition-colors"
            >
              <div className="font-semibold flex items-center gap-1">
                <UserIcon className="w-3 h-3 text-emerald-400" />
                Demo User
              </div>
              <div className="text-[10px] text-slate-500 truncate">$420 Balance Active</div>
            </button>
          </div>

          <button
            type="button"
            onClick={handleQuickNewAccount}
            className="w-full mt-2 py-1.5 px-3 bg-slate-950/60 border border-dashed border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Generate Fresh 0 USD Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
