import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Save,
  Coins,
  Shield,
  RotateCcw,
  Check,
  Megaphone,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, adminUpdateSettings, resetPlatformData } = useApp();

  const [officialTrc20Address, setOfficialTrc20Address] = useState(settings.officialTrc20Address);
  const [minDeposit, setMinDeposit] = useState(settings.minDeposit.toString());
  const [minWithdrawal, setMinWithdrawal] = useState(settings.minWithdrawal.toString());
  const [withdrawalFeePercent, setWithdrawalFeePercent] = useState(
    settings.withdrawalFeePercent.toString()
  );
  const [referralTier1Percent, setReferralTier1Percent] = useState(
    settings.referralTier1Percent.toString()
  );
  const [referralTier2Percent, setReferralTier2Percent] = useState(
    settings.referralTier2Percent.toString()
  );
  const [announcement, setAnnouncement] = useState(settings.announcement);
  const [supportTelegram, setSupportTelegram] = useState(settings.supportTelegram);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanAddress = officialTrc20Address.trim();
    // Auto-update QR code URL when receiving address changes
    const generatedQr = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
      cleanAddress
    )}`;

    adminUpdateSettings({
      officialTrc20Address: cleanAddress,
      qrCodeUrl: generatedQr,
      minDeposit: parseFloat(minDeposit) || 20,
      minWithdrawal: parseFloat(minWithdrawal) || 15,
      withdrawalFeePercent: parseFloat(withdrawalFeePercent) || 1.5,
      referralTier1Percent: parseFloat(referralTier1Percent) || 8,
      referralTier2Percent: parseFloat(referralTier2Percent) || 3,
      announcement: announcement.trim(),
      supportTelegram: supportTelegram.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all user balances, pending queues, and demo data to clean 0 funds state?')) {
      resetPlatformData();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Global Platform Controls & Settings</span>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            System Config
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Adjust platform receiving address, transaction thresholds, referral commission rules, and live broadcasts.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Platform configuration updated successfully. All user views refreshed in real time.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Receiving Wallet Section */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>Platform USDT (TRC-20) Receiving Wallet</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            This is the official TRC-20 address rendered on all user deposit screens and QR codes.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Admin Tron Receiving Address (TRC-20)
            </label>
            <input
              type="text"
              required
              value={officialTrc20Address}
              onChange={(e) => setOfficialTrc20Address(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-emerald-800 font-bold focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Financial Limits & Fees */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>Financial Thresholds & Transaction Fees</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Min Deposit (USDT)
              </label>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={minDeposit}
                onChange={(e) => setMinDeposit(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Min Withdrawal (USDT)
              </label>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={minWithdrawal}
                onChange={(e) => setMinWithdrawal(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Withdrawal Fee (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={withdrawalFeePercent}
                onChange={(e) => setWithdrawalFeePercent(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-amber-700 font-bold focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Referral Commission Rates */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Coins className="w-4 h-4 text-purple-600" />
            <span>Referral Program Reward Commission</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tier 1 Direct Referral Commission (%)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="50"
                required
                value={referralTier1Percent}
                onChange={(e) => setReferralTier1Percent(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-purple-700 font-bold focus:bg-white focus:outline-none focus:border-purple-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Percentage paid to direct inviter upon approved user deposit.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tier 2 Indirect Referral Commission (%)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="25"
                required
                value={referralTier2Percent}
                onChange={(e) => setReferralTier2Percent(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-teal-700 font-bold focus:bg-white focus:outline-none focus:border-teal-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Percentage credited for secondary level network participants.
              </span>
            </div>
          </div>
        </div>

        {/* Platform Announcements & Support */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-emerald-600" />
            <span>Platform Broadcast & Support Contact</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Announcement Banner Message (Broadcast to all users)
            </label>
            <textarea
              rows={2}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Official Telegram Support Handle
            </label>
            <input
              type="text"
              value={supportTelegram}
              onChange={(e) => setSupportTelegram(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save & Apply Platform Changes</span>
        </button>
      </form>

      {/* Reset State Zone */}
      <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 shadow-sm">
        <h3 className="text-sm font-bold text-rose-800 mb-1">Clean System Reset</h3>
        <p className="text-xs text-rose-700 mb-4">
          Restore clean state with 0 funds and reset test queues.
        </p>
        <button
          onClick={handleResetData}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Platform Data to Clean 0 Funds State</span>
        </button>
      </div>
    </div>
  );
};
