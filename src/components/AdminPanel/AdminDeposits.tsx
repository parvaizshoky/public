import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DepositTransaction } from '../../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Copy,
  Check,
  Edit3,
  QrCode,
  Coins,
  ExternalLink,
  ShieldCheck,
  X,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const AdminDeposits: React.FC = () => {
  const { deposits, approveDeposit, rejectDeposit, settings, adminUpdateDepositAddress } = useApp();

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState('');
  const [rejectModalDeposit, setRejectModalDeposit] = useState<DepositTransaction | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Deposit Address Edit Modal State
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [newDepositAddress, setNewDepositAddress] = useState(settings.officialTrc20Address);
  const [customQrUrl, setCustomQrUrl] = useState('');
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const filteredDeposits = deposits.filter((d) => {
    if (filter !== 'all' && d.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.username.toLowerCase().includes(q) ||
        d.userEmail.toLowerCase().includes(q) ||
        d.txHash.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = deposits.filter((d) => d.status === 'pending').length;
  const approvedCount = deposits.filter((d) => d.status === 'approved').length;
  const rejectedCount = deposits.filter((d) => d.status === 'rejected').length;

  const handleCopy = (tx: string) => {
    navigator.clipboard.writeText(tx);
    setCopiedTx(tx);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const handleCopyPlatformAddress = () => {
    navigator.clipboard.writeText(settings.officialTrc20Address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleApprove = (deposit: DepositTransaction) => {
    approveDeposit(deposit.id, 'Verified on TronScan ledger. Credit applied to user account.');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalDeposit) return;
    rejectDeposit(rejectModalDeposit.id, rejectionReason || 'TxID could not be verified on TRON network.');
    setRejectModalDeposit(null);
    setRejectionReason('');
  };

  const handleOpenEditAddress = () => {
    setNewDepositAddress(settings.officialTrc20Address);
    setCustomQrUrl('');
    setEditError(null);
    setEditSuccessMsg(null);
    setIsEditAddressOpen(true);
  };

  const handleSaveDepositAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setEditSuccessMsg(null);

    const clean = newDepositAddress.trim();
    if (!clean) {
      setEditError('Deposit address cannot be empty.');
      return;
    }

    if (!clean.startsWith('T') && !clean.startsWith('t')) {
      // Gentle warning for non-TRON prefix, still allowed if user insists
      console.warn('Address does not begin with standard TRON prefix T');
    }

    const res = adminUpdateDepositAddress(clean, customQrUrl.trim() || undefined);
    if (!res.success) {
      setEditError(res.message || 'Failed to update deposit address.');
      return;
    }

    setEditSuccessMsg('Official Deposit Address successfully updated and synchronized to Firebase Firestore!');
    setTimeout(() => {
      setIsEditAddressOpen(false);
      setEditSuccessMsg(null);
    }, 1500);
  };

  const isTronFormat = newDepositAddress.trim().startsWith('T') && newDepositAddress.trim().length >= 30;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Title and Quick Edit Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>USDT (TRC-20) Deposit Management</span>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              Admin Control
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage official TRC-20 deposit receiving address and verify incoming transactions from members.
          </p>
        </div>

        <button
          onClick={handleOpenEditAddress}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-2xl shadow-md hover:shadow-lg transition-all"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Deposit Address</span>
        </button>
      </div>

      {/* Official Deposit Address Banner / Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300">
              <Coins className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Platform Official Receiving Address
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  TRC-20 Protocol
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Live in User View
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-emerald-100 font-bold bg-slate-950/60 px-3 py-2 rounded-xl border border-white/10 break-all select-all">
                <span>{settings.officialTrc20Address}</span>
              </div>

              <p className="text-[11px] text-slate-300">
                All users deposit funds to this wallet. Any change here automatically refreshes the deposit screen and QR code in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyPlatformAddress}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors"
              title="Copy Address"
            >
              {copiedAddress ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAddress ? 'Copied!' : 'Copy'}</span>
            </button>

            <a
              href={`https://tronscan.org/#/address/${settings.officialTrc20Address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-semibold rounded-xl border border-emerald-400/30 transition-colors"
              title="View on TronScan Explorer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>TronScan</span>
            </a>

            <button
              onClick={handleOpenEditAddress}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Address</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filter === 'pending'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pending</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white font-mono text-[10px] border border-amber-200">
              {pendingCount}
            </span>
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filter === 'approved'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Approved</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white font-mono text-[10px] border border-emerald-200">
              {approvedCount}
            </span>
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filter === 'rejected'
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Rejected</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white font-mono text-[10px] border border-rose-200">
              {rejectedCount}
            </span>
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-slate-100 text-slate-900 border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({deposits.length})
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by user or TxID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">TxID (Hash)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No deposits matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{dep.username}</div>
                      <div className="text-[11px] text-slate-400">{dep.userEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ${dep.amount.toFixed(2)}{' '}
                      <span className="text-[10px] text-emerald-600 font-normal">USDT</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
                        <span className="max-w-[140px] truncate">{dep.txHash}</span>
                        <button
                          onClick={() => handleCopy(dep.txHash)}
                          className="p-1 hover:text-slate-900 transition-colors"
                          title="Copy Tx Hash"
                        >
                          {copiedTx === dep.txHash ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={`https://tronscan.org/#/transaction/${dep.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                          title="Check on TronScan"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      {dep.proofNote && (
                        <div className="text-[10px] text-slate-400 mt-0.5 italic max-w-xs truncate">
                          "{dep.proofNote}"
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {dep.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {dep.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {dep.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(dep.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {dep.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(dep)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 text-[11px] shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectModalDeposit(dep)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Deposit Address Modal */}
      {isEditAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Edit Official Deposit Address
                  </h3>
                  <p className="text-xs text-slate-500">
                    TRC-20 USDT Wallet Address for all platform deposits
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditAddressOpen(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            {editSuccessMsg && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{editSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveDepositAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Tron TRC-20 Receiving Address</span>
                  {isTronFormat ? (
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Valid TRON format
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-600 font-semibold">
                      Must start with 'T' (TRON standard)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  value={newDepositAddress}
                  onChange={(e) => setNewDepositAddress(e.target.value)}
                  placeholder="e.g. TXL97uK2x..."
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-emerald-500 shadow-inner"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Standard TRON wallet address (starts with capital 'T', 34 characters).
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setNewDepositAddress('TXYZopTRONUSDTReceivingVault998XyL')}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
                >
                  Fill Sample Address 1
                </button>
                <button
                  type="button"
                  onClick={() => setNewDepositAddress('TW1R9xProOfficialEarningsDeposit001')}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
                >
                  Fill Sample Address 2
                </button>
              </div>

              {/* Live QR Code Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                <div className="w-20 h-20 bg-white p-1 rounded-xl border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      newDepositAddress.trim() || 'TRON'
                    )}`}
                    alt="Deposit QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Auto-Generated QR Code Preview</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    The platform will dynamically generate this high-resolution QR code for all members when depositing USDT.
                  </p>
                </div>
              </div>

              {/* Optional Custom QR URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Custom QR Code Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={customQrUrl}
                  onChange={(e) => setCustomQrUrl(e.target.value)}
                  placeholder="Leave empty to auto-generate based on address"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditAddressOpen(false)}
                  className="flex-1 py-2.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save & Sync Address</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Reject Deposit of ${rejectModalDeposit.amount} USDT
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Please specify the reason. This will be transmitted directly to user {rejectModalDeposit.username}.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Rejection Reason
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Transaction hash not found on TronScan block explorer."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModalDeposit(null)}
                  className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors shadow-2xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
