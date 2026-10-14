import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WithdrawalRequest } from '../../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Copy,
  Check,
  Send,
} from 'lucide-react';

export const AdminWithdrawals: React.FC = () => {
  const { withdrawals, approveWithdrawal, rejectWithdrawal } = useApp();

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState('');
  const [approveModalWd, setApproveModalWd] = useState<WithdrawalRequest | null>(null);
  const [rejectModalWd, setRejectModalWd] = useState<WithdrawalRequest | null>(null);
  const [txHashInput, setTxHashInput] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (filter !== 'all' && w.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        w.username.toLowerCase().includes(q) ||
        w.userEmail.toLowerCase().includes(q) ||
        w.payoutAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = withdrawals.filter((w) => w.status === 'pending').length;
  const approvedCount = withdrawals.filter((w) => w.status === 'approved').length;
  const rejectedCount = withdrawals.filter((w) => w.status === 'rejected').length;

  const handleCopy = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(addr);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleOpenApproveModal = (wd: WithdrawalRequest) => {
    const randomHex = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setTxHashInput(randomHex);
    setApproveModalWd(wd);
  };

  const handleConfirmApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approveModalWd) return;
    approveWithdrawal(approveModalWd.id, txHashInput, 'Dispatched via Tron Gateway node.');
    setApproveModalWd(null);
    setTxHashInput('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalWd) return;
    rejectWithdrawal(
      rejectModalWd.id,
      rejectionReason || 'Withdrawal declined by compliance check. Balance restored.'
    );
    setRejectModalWd(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>USDT (TRC-20) Withdrawal Approvals</span>
          <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
            Manual Verification Queue
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review client payout addresses, audit withdrawal integrity, and dispatch on-chain disbursements.
        </p>
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
            <span>Declined & Refunded</span>
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
            All ({withdrawals.length})
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by user or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Requested</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">TRC-20 Payout Address</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-sans font-medium">
                    No withdrawal requests found in this view.
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map((wd) => (
                  <tr key={wd.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-bold text-slate-900">{wd.username}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                        {wd.userEmail}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${wd.amount.toFixed(2)} USDT
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-700 text-sm">
                      ${wd.netAmount.toFixed(2)} USDT
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-slate-700 font-mono text-[11px] select-all font-medium">
                          {wd.payoutAddress}
                        </span>
                        <button
                          onClick={() => handleCopy(wd.payoutAddress)}
                          className="p-1 hover:text-slate-900 text-slate-400 transition-colors shrink-0"
                          title="Copy Address"
                        >
                          {copiedAddress === wd.payoutAddress ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-sans">
                      {new Date(wd.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {wd.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-sans font-semibold">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                      {wd.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-sans font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Dispatched
                        </span>
                      )}
                      {wd.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-rose-50 text-rose-800 border border-rose-200 font-sans font-semibold">
                          <XCircle className="w-3 h-3" />
                          Declined
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      {wd.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenApproveModal(wd)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-2xs"
                            title="Verify and disburse on-chain"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setRejectModalWd(wd)}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                            title="Decline and refund balance"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject & Refund</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          {wd.status === 'approved' ? 'Settled on Tron' : 'Refunded'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve Modal */}
      {approveModalWd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Approve Withdrawal: ${approveModalWd.netAmount.toFixed(2)} USDT
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Disbursing to user {approveModalWd.username} at address:
              <br />
              <span className="font-mono text-emerald-700 text-[11px] break-all font-semibold">
                {approveModalWd.payoutAddress}
              </span>
            </p>

            <form onSubmit={handleConfirmApprove} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tron Dispatch TxID / Hash
                </label>
                <input
                  type="text"
                  required
                  value={txHashInput}
                  onChange={(e) => setTxHashInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setApproveModalWd(null)}
                  className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-2xs"
                >
                  Confirm Disbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject & Refund Modal */}
      {rejectModalWd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Reject Withdrawal & Refund Balance
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              The full requested amount of ${rejectModalWd.amount.toFixed(2)} USDT will be returned to {rejectModalWd.username}'s active balance.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Rejection Reason (Sent to User)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Invalid TRC-20 address checksum or KYC compliance check."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModalWd(null)}
                  className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors shadow-2xs"
                >
                  Reject & Refund Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
