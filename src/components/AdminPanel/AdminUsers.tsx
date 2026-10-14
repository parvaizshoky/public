import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  Search,
  DollarSign,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const {
    users,
    adminAdjustUserBalance,
    adminToggleUserStatus,
    switchUser,
    navigateToRoute,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedUserForAdjustment, setSelectedUserForAdjustment] = useState<User | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>('50');
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustReason, setAdjustReason] = useState<string>('Administrative incentive credit');

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.referralCode.toLowerCase().includes(q)
    );
  });

  const handleConfirmAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForAdjustment) return;
    const amt = parseFloat(adjustAmount);
    if (isNaN(amt) || amt <= 0) return;

    const delta = adjustType === 'credit' ? amt : -amt;
    adminAdjustUserBalance(selectedUserForAdjustment.id, delta, adjustReason);
    setSelectedUserForAdjustment(null);
    setAdjustAmount('50');
  };

  const handleImpersonateUser = (user: User) => {
    switchUser(user.id);
    navigateToRoute('user');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>User Accounts & Ledger Control</span>
            <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
              {users.length} Total Registered
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete user directory with real-time balance tracking, profit metrics, and direct balance adjustments.
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by username, email, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                <th className="py-3 px-4">User & Contact</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Total Deposited</th>
                <th className="py-3 px-4">Total Profit Generated</th>
                <th className="py-3 px-4">Withdrawn</th>
                <th className="py-3 px-4">Referral Stats</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{u.username}</span>
                      {u.role === 'admin' && (
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-bold">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                      {u.email}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-emerald-700 text-sm">
                      ${u.balance.toFixed(2)} USDT
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    ${u.totalDeposited.toFixed(2)} USDT
                  </td>

                  <td className="py-3.5 px-4 font-bold text-teal-700">
                    +${u.totalProfitGenerated.toFixed(2)} USDT
                  </td>

                  <td className="py-3.5 px-4 text-amber-700 font-medium">
                    ${u.totalWithdrawn.toFixed(2)} USDT
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-sans">
                    <div>
                      <span className="font-mono text-purple-700 font-bold">{u.referralCode}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {u.referralCount} invitees · +${u.referralEarnings.toFixed(0)} earned
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    {u.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
                        <XCircle className="w-3 h-3" />
                        Suspended
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right font-sans">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedUserForAdjustment(u)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 border border-slate-200 shadow-2xs"
                        title="Credit or Debit Balance"
                      >
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Adjust</span>
                      </button>

                      {u.role !== 'admin' && (
                        <button
                          onClick={() => adminToggleUserStatus(u.id)}
                          className={`px-2 py-1 text-xs rounded-xl transition-colors font-bold ${
                            u.status === 'active'
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}

                      <button
                        onClick={() => handleImpersonateUser(u)}
                        className="p-1.5 hover:text-slate-900 text-slate-400 transition-colors"
                        title="View Dashboard as this user"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Balance Modal */}
      {selectedUserForAdjustment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Adjust Balance for {selectedUserForAdjustment.username}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Current balance:{' '}
              <span className="font-mono text-emerald-700 font-bold">
                ${selectedUserForAdjustment.balance.toFixed(2)} USDT
              </span>
            </p>

            <form onSubmit={handleConfirmAdjustment} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('credit')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    adjustType === 'credit'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  + Credit (Add Funds)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('debit')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    adjustType === 'debit'
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  - Debit (Deduct Funds)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Amount (USDT)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Reason for Adjustment
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Administrative incentive credit"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForAdjustment(null)}
                  className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors shadow-2xs"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
