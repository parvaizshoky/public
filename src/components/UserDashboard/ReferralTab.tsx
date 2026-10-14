import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Copy,
  Check,
  Share2,
  Sparkles,
  TrendingUp,
  Coins,
  Send,
  MessageCircle,
} from 'lucide-react';

export const ReferralTab: React.FC = () => {
  const { currentUser, referrals, settings } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!currentUser) return null;

  const userReferrals = referrals.filter((r) => r.inviterId === currentUser.id);
  const totalCommission = userReferrals.reduce((sum, r) => sum + r.commissionEarned, 0);
  const totalVolume = userReferrals.reduce((sum, r) => sum + r.totalDeposited, 0);

  const inviteUrl = `${window.location.origin}?ref=${currentUser.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `Earn daily passive USDT TRC-20 yield with TronYield! Register using my invitation code ${currentUser.referralCode}: ${inviteUrl}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${text}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join TronYield and earn daily USDT yield on TRC-20 staking! Use my code: ${currentUser.referralCode} - ${inviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Maximizing daily crypto returns on TronYield TRC-20 protocol. Join using code ${currentUser.referralCode}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(inviteUrl)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Invite Friends & Referral Program</span>
          <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
            Tiered Rewards
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Share your referral link. Earn {settings.referralTier1Percent}% commission on every approved deposit made by your invitees.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Total Friends Invited</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tabular-nums">
            {currentUser.referralCount}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Registered with code <span className="font-mono text-purple-700 font-bold">{currentUser.referralCode}</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Total Commission Earned</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700 font-mono tabular-nums">
            +${(currentUser.referralEarnings || totalCommission).toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Paid directly into your active balance
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Referral Deposit Volume</span>
            <Coins className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tabular-nums">
            ${totalVolume.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Total capital deposited by invitees
          </div>
        </div>
      </div>

      {/* Referral Link & Code Sharing Box */}
      <div className="p-6 rounded-3xl bg-white border border-purple-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Your Unique Invitation Credentials</span>
            </h3>

            {/* Code */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Referral Code
              </label>
              <div className="flex items-center gap-2 max-w-sm">
                <div className="px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 font-mono text-base font-bold text-purple-800 tracking-wider flex-1">
                  {currentUser.referralCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Link */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Direct Invitation Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 w-full focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 pt-4 md:pt-0 shrink-0 space-y-2">
            <span className="text-xs font-bold text-slate-700 block mb-3">
              Fast Social Share
            </span>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleShareTelegram}
                className="px-4 py-2 bg-[#229ED9]/10 hover:bg-[#229ED9]/20 text-[#229ED9] border border-[#229ED9]/30 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Share via Telegram</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Share via WhatsApp</span>
              </button>
              <button
                onClick={handleShareTwitter}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share via X / Twitter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Tier Commission Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">
            <span>Tier 1 Direct Referrals</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {settings.referralTier1Percent}% Commission
          </div>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Earn an instant {settings.referralTier1Percent}% reward on every approved TRC-20 deposit made by members who register directly with your code.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">
            <span>Tier 2 Secondary Network</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {settings.referralTier2Percent}% Commission
          </div>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Earn an additional {settings.referralTier2Percent}% bonus when your direct invitees introduce other crypto investors to TronYield.
          </p>
        </div>
      </div>

      {/* Referred Friends Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 mb-1">Referred Friends Directory</h3>
        <p className="text-xs text-slate-500 mb-4">
          List of members registered under your network and commissions produced
        </p>

        {userReferrals.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
            <p className="text-xs font-medium">No referrals registered yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Copy your link above and invite partners to start earning commission.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3 rounded-l-xl">Username</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Joined Date</th>
                  <th className="py-2.5 px-3">Total Deposited</th>
                  <th className="py-2.5 px-3 text-right rounded-r-xl">Commission Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {userReferrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 text-slate-900 font-bold font-sans">
                      {ref.referredUsername}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{ref.referredEmail}</td>
                    <td className="py-3 px-3 text-slate-500 font-sans">
                      {new Date(ref.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-slate-900">
                      ${ref.totalDeposited.toFixed(2)} USDT
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-700 font-bold">
                      +${ref.commissionEarned.toFixed(2)} USDT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
