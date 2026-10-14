import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User as UserIcon,
  Wallet,
  Lock,
  Check,
  Save,
  AlertCircle,
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { currentUser, updateProfile } = useApp();

  const [username, setUsername] = useState(currentUser?.username || '');
  const [trc20Address, setTrc20Address] = useState(currentUser?.trc20Address || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    const updates: { username?: string; trc20Address?: string; password?: string } = {
      username: username.trim(),
      trc20Address: trc20Address.trim(),
    };

    if (newPassword) {
      updates.password = newPassword;
    }

    updateProfile(updates);
    setSuccess('Profile and wallet configuration updated successfully.');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Account & Security Settings</span>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            Profile Verified
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal identity, default withdrawal TRC-20 wallet address, and account credentials.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Personal Details */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-emerald-600" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address (Permanent)
              </label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full px-3 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-mono"
              />
            </div>
          </div>
        </div>

        {/* Saved TRC-20 Wallet */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-teal-600" />
            <span>Default TRC-20 Payout Address</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Save your verified TRC-20 wallet address for one-click payout processing during withdrawal requests.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tron TRC-20 Address (USDT)
            </label>
            <input
              type="text"
              placeholder="e.g. TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
              value={trc20Address}
              onChange={(e) => setTrc20Address(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-emerald-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Change Password */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-600" />
            <span>Update Account Password</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                New Password (Optional)
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep unchanged"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Account Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-slate-500 block mb-1 font-medium">Account Role</span>
            <span className="font-bold text-slate-900 capitalize">{currentUser.role}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-slate-500 block mb-1 font-medium">Referral Code</span>
            <span className="font-mono font-bold text-purple-700">{currentUser.referralCode}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-slate-500 block mb-1 font-medium">Registration Date</span>
            <span className="text-slate-700 font-mono font-semibold">
              {new Date(currentUser.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </form>
    </div>
  );
};
