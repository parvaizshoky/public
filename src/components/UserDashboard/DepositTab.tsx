import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Coins,
  QrCode,
  Copy,
  Check,
  AlertTriangle,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const DepositTab: React.FC = () => {
  const { currentUser, settings, submitDeposit, deposits } = useApp();

  const [amount, setAmount] = useState<string>('50');
  const [txHash, setTxHash] = useState<string>('');
  const [proofNote, setProofNote] = useState<string>('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const userDeposits = deposits.filter((d) => d.userId === currentUser.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(settings.officialTrc20Address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleFillDemoHash = () => {
    const randomHex = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setTxHash(randomHex);
    setProofNote('Transferred via TronLink wallet on TRC20 network.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please specify a valid deposit amount.');
      return;
    }
    if (numericAmount < settings.minDeposit) {
      setError(`Minimum deposit requirement is ${settings.minDeposit} USDT.`);
      return;
    }
    if (!txHash.trim()) {
      setError('Please provide the transaction hash (TxID).');
      return;
    }

    const res = submitDeposit(numericAmount, txHash, proofNote);
    if (!res.success) {
      setError(res.message || 'Deposit submission failed.');
      return;
    }

    setSuccessMsg(
      `Deposit of ${numericAmount.toFixed(2)} USDT submitted successfully! It has been dispatched to the Administrator for verification.`
    );
    setTxHash('');
    setProofNote('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Deposit USDT (TRC-20)</span>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            Tron Network
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Transfer USDT on the TRON TRC-20 protocol. All transactions are manually verified by administrators for maximum asset security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Official Wallet & QR */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Official TRC-20 Deposit Address</span>
            </h3>

            {/* QR Code Container */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-center max-w-[220px] mx-auto shadow-inner my-4">
              <img
                src={settings.qrCodeUrl}
                alt="USDT TRC20 Deposit QR"
                className="w-48 h-48 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Address Box */}
            <div className="mt-4">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Deposit Address (TRON TRC-20)
              </label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-emerald-800 break-all select-all font-bold">
                  {settings.officialTrc20Address}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shrink-0 shadow-2xs"
                  title="Copy TRC20 Address"
                >
                  {copiedAddress ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Important Warning Notice */}
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Crucial Protocol Guidelines:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-1">
                <li>Send only USDT on TRON (TRC-20). Do not send ERC-20 or BEP-20.</li>
                <li>Minimum deposit requirement is {settings.minDeposit} USDT.</li>
                <li>Once transferred, submit your Transaction Hash (TxID) below.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Deposit Verification Submission Form */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              <span>Submit Transfer Verification</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Enter the amount sent and your transaction hash to notify admin for approval.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Deposit Amount (USDT)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-mono">$</span>
                  <input
                    type="number"
                    step="any"
                    min={settings.minDeposit}
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-24 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g. 100"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono font-bold text-slate-500">
                    USDT TRC20
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  {['30', '50', '100', '300', '500', '1000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className="px-2.5 py-1 text-[11px] font-mono font-bold bg-slate-100 border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 rounded-lg transition-colors"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Tron Transaction Hash (TxID)
                  </label>
                  <button
                    type="button"
                    onClick={handleFillDemoHash}
                    className="text-[11px] text-teal-700 hover:text-teal-800 flex items-center gap-1 font-bold"
                  >
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    Auto-Fill Test TxID
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="e.g. e79b940e4f4e70dd357908b8b0e6cf9cf4a5441d34e9e048dfd49ec2bf5f79a1"
                  className="w-full px-3 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-emerald-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Obtain this 64-character hash from your wallet (Binance, TronLink, Trust Wallet, etc.) after transfer.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Proof Notes / Sender Reference (Optional)
                </label>
                <textarea
                  rows={2}
                  value={proofNote}
                  onChange={(e) => setProofNote(e.target.value)}
                  placeholder="e.g. Sent from exchange, wallet ending in 8X9Q"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Deposit for Admin Approval</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* User's Deposit History Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 mb-1">My Deposit Records</h3>
        <p className="text-xs text-slate-500 mb-4">
          Tracking your submitted TRC-20 transfers and verification progress
        </p>

        {userDeposits.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Coins className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
            <p className="text-xs font-medium">No deposits submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3 rounded-l-xl">Date</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">TxID / Hash</th>
                  <th className="py-2.5 px-3">Notes</th>
                  <th className="py-2.5 px-3 text-right rounded-r-xl">Approval Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {userDeposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 text-slate-500 font-sans">
                      {new Date(dep.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      ${dep.amount.toFixed(2)} USDT
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="font-mono text-emerald-700 truncate inline-block max-w-[180px]">
                        {dep.txHash}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-sans max-w-xs truncate">
                      {dep.reviewNotes || dep.proofNote || '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {dep.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-sans font-semibold">
                          <Clock className="w-3 h-3" />
                          Pending Admin Verification
                        </span>
                      )}
                      {dep.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-sans font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved & Credited
                        </span>
                      )}
                      {dep.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-rose-50 text-rose-800 border border-rose-200 font-sans font-semibold">
                          <AlertCircle className="w-3 h-3" />
                          Rejected
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
