import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowUpRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Sparkles,
} from 'lucide-react';

export const WithdrawTab: React.FC = () => {
  const { currentUser, settings, submitWithdrawal, withdrawals } = useApp();

  const [payoutAddress, setPayoutAddress] = useState<string>(currentUser?.trc20Address || '');
  const [amount, setAmount] = useState<string>('50');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!currentUser) return null;

  const userWithdrawals = withdrawals.filter((w) => w.userId === currentUser.id);

  const numAmount = parseFloat(amount) || 0;
  const feeAmount = (numAmount * settings.withdrawalFeePercent) / 100;
  const netAmount = Math.max(0, numAmount - feeAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (numAmount < settings.minWithdrawal) {
      setError(`Minimum withdrawal limit is ${settings.minWithdrawal} USDT.`);
      return;
    }
    if (currentUser.balance < numAmount) {
      setError(`Insufficient balance. You have $${currentUser.balance.toFixed(2)} USDT available.`);
      return;
    }
    if (!payoutAddress.trim() || payoutAddress.trim().length < 15) {
      setError('Please provide a valid USDT TRC-20 recipient wallet address.');
      return;
    }

    const res = submitWithdrawal(numAmount, payoutAddress.trim());
    if (!res.success) {
      setError(res.message || 'Withdrawal submission failed.');
      return;
    }

    setSuccess(
      `Withdrawal request for ${numAmount.toFixed(2)} USDT submitted! Under manual verification by administration.`
    );
    setAmount('');
  };

  const handleUseSavedAddress = () => {
    if (currentUser.trc20Address) {
      setPayoutAddress(currentUser.trc20Address);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Withdraw USDT (TRC-20)</span>
          <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
            Manual Verification Required
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Request funds to your external TRC-20 address. Requests are audited and verified manually by the admin team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-amber-600" />
                <span>Withdrawal Request Details</span>
              </h3>
              <div className="text-xs font-mono text-slate-500">
                Available: <span className="text-emerald-700 font-bold">${currentUser.balance.toFixed(2)} USDT</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Recipient USDT (TRC-20) Address
                  </label>
                  {currentUser.trc20Address && (
                    <button
                      type="button"
                      onClick={handleUseSavedAddress}
                      className="text-[11px] text-teal-700 hover:text-teal-800 flex items-center gap-1 font-bold"
                    >
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      Use Saved Profile Wallet
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
                  value={payoutAddress}
                  onChange={(e) => setPayoutAddress(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Ensure the address is strictly TRC-20 on the Tron blockchain. Transfers to incorrect chains cannot be recovered.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Amount to Withdraw (USDT)
                  </label>
                  <button
                    type="button"
                    onClick={() => setAmount(currentUser.balance.toString())}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold"
                  >
                    Withdraw All Max
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-mono">$</span>
                  <input
                    type="number"
                    step="any"
                    min={settings.minWithdrawal}
                    max={currentUser.balance}
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-20 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="0.00"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono font-bold text-slate-500">
                    USDT
                  </span>
                </div>
              </div>

              {/* Fee and Net Calculation Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span className="font-sans font-medium">Requested Amount:</span>
                  <span className="text-slate-900 font-bold">${numAmount.toFixed(2)} USDT</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-sans font-medium">Protocol Network Fee ({settings.withdrawalFeePercent}%):</span>
                  <span className="text-amber-700 font-semibold">-${feeAmount.toFixed(2)} USDT</span>
                </div>
                <div className="flex justify-between text-slate-800 pt-2 border-t border-slate-200 font-bold">
                  <span className="font-sans">Net Disbursed to Wallet:</span>
                  <span className="text-emerald-700 text-sm">${netAmount.toFixed(2)} USDT</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={currentUser.balance < settings.minWithdrawal || numAmount <= 0}
                className={`w-full py-3 px-4 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                  currentUser.balance >= settings.minWithdrawal && numAmount > 0
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Submit Withdrawal Request</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Security Policy & Audit Note */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Manual Verification Protocol</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              To defend client funds against automated exploits and wallet compromises, all withdrawal requests are held in an escrow lock and verified manually by system administrators.
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">
                  Review Turnaround
                </span>
                <span className="text-slate-800 font-semibold mt-0.5 block">
                  Typically processed within 15–60 minutes during standard operations.
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">
                  Refund Protection
                </span>
                <span className="text-slate-800 font-semibold mt-0.5 block">
                  If admin declines a request for invalid wallet formatting, the full amount is immediately refunded to your balance.
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">
                  Minimum Threshold
                </span>
                <span className="text-emerald-700 font-mono font-black mt-0.5 block">
                  ${settings.minWithdrawal} USDT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal History Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 mb-1">My Withdrawal History</h3>
        <p className="text-xs text-slate-500 mb-4">
          Status of all outgoing TRC-20 requests and confirmation hashes
        </p>

        {userWithdrawals.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <ArrowUpRight className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
            <p className="text-xs font-medium">No withdrawal requests placed yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3 rounded-l-xl">Date</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Net Disbursed</th>
                  <th className="py-2.5 px-3">Payout Address</th>
                  <th className="py-2.5 px-3">TxID / Note</th>
                  <th className="py-2.5 px-3 text-right rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {userWithdrawals.map((wd) => (
                  <tr key={wd.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 text-slate-500 font-sans">
                      {new Date(wd.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-900 font-bold">
                      ${wd.amount.toFixed(2)} USDT
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">
                      ${wd.netAmount.toFixed(2)} USDT
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-[150px] truncate">
                      {wd.payoutAddress}
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-[160px] truncate">
                      {wd.txHash || wd.reviewNotes || '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {wd.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-sans font-semibold">
                          <Clock className="w-3 h-3" />
                          Pending Admin Verification
                        </span>
                      )}
                      {wd.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-sans font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved & Dispatched
                        </span>
                      )}
                      {wd.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-rose-50 text-rose-800 border border-rose-200 font-sans font-semibold">
                          <AlertCircle className="w-3 h-3" />
                          Declined & Refunded
                        </span>
                      )}
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
