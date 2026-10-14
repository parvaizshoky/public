import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Users,
  Clock,
  Layers,
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const {
    users,
    deposits,
    withdrawals,
    investments,
    setAdminTab,
  } = useApp();

  // Metrics
  const totalUsersCount = users.filter((u) => u.role !== 'admin').length;
  const activeUsersCount = users.filter((u) => u.status === 'active' && u.role !== 'admin').length;

  const approvedDeposits = deposits.filter((d) => d.status === 'approved');
  const totalDepositedVolume = approvedDeposits.reduce((sum, d) => sum + d.amount, 0);

  // Count unique users who have made at least one deposit
  const uniqueDepositorIds = new Set(approvedDeposits.map((d) => d.userId));
  const uniqueDepositorsCount = uniqueDepositorIds.size;

  const approvedWithdrawals = withdrawals.filter((w) => w.status === 'approved');
  const totalWithdrawnVolume = approvedWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  const totalUserProfitPaid = users.reduce((sum, u) => sum + u.totalProfitGenerated, 0);
  const netPlatformReserve = Math.max(0, totalDepositedVolume - totalWithdrawnVolume);

  const pendingDeposits = deposits.filter((d) => d.status === 'pending');
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending');
  const totalPendingAction = pendingDeposits.length + pendingWithdrawals.length;

  const activeInvestmentsVolume = investments
    .filter((i) => i.status === 'active')
    .reduce((sum, i) => sum + i.amountInvested, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Pending Alerts Banner */}
      {totalPendingAction > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-amber-950">
                Action Required: {totalPendingAction} Pending Requests Awaiting Verification
              </h3>
              <p className="text-xs text-amber-800 mt-0.5 font-medium">
                {pendingDeposits.length} USDT deposits and {pendingWithdrawals.length} withdrawal requests need review.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingDeposits.length > 0 && (
              <button
                onClick={() => setAdminTab('deposits')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap shadow-2xs"
              >
                Review Deposits ({pendingDeposits.length})
              </button>
            )}
            {pendingWithdrawals.length > 0 && (
              <button
                onClick={() => setAdminTab('withdrawals')}
                className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition-colors whitespace-nowrap shadow-2xs"
              >
                Review Withdrawals ({pendingWithdrawals.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Platform Deposits */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Total TRC-20 Deposits</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tabular-nums">
            ${totalDepositedVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{approvedDeposits.length} Approved Transfers</span>
            <span className="text-slate-700 font-mono font-bold">
              {uniqueDepositorsCount} Depositing Users
            </span>
          </div>
        </div>

        {/* Total Withdrawals */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Total Disbursed Withdrawals</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 font-mono tabular-nums">
            ${totalWithdrawnVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{approvedWithdrawals.length} Settled Requests</span>
            <span className="text-slate-500 font-mono">TRC-20 Disbursed</span>
          </div>
        </div>

        {/* Total User Profits Generated */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Total User Profit Generated</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-700 font-mono tabular-nums">
            +${totalUserProfitPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Distributed Across Plans</span>
            <span className="text-emerald-700 font-mono font-semibold">Audit Cleared</span>
          </div>
        </div>

        {/* Registered Platform Users */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Registered Platform Users</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
            {totalUsersCount}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{activeUsersCount} Active Accounts</span>
            <button
              onClick={() => setAdminTab('users')}
              className="text-purple-700 hover:text-purple-800 font-bold"
            >
              Manage Users &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Metrics & Capital Reserves */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1 font-medium">Net Platform Liquidity Reserve</span>
          <div className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
            ${netPlatformReserve.toFixed(2)} USDT
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total Deposits minus Total Disbursed Withdrawals on-chain.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1 font-medium">Active Staked Capital Pool</span>
          <div className="text-xl font-bold font-mono text-teal-700 tabular-nums">
            ${activeInvestmentsVolume.toFixed(2)} USDT
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Capital currently locked into user yield plans generating daily returns.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1 font-medium">Depositors Conversion Rate</span>
          <div className="text-xl font-bold font-mono text-purple-700 tabular-nums">
            {totalUsersCount > 0 ? Math.round((uniqueDepositorsCount / totalUsersCount) * 100) : 0}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {uniqueDepositorsCount} of {totalUsersCount} registered users have funded their accounts.
          </p>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setAdminTab('deposits')}
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Deposit Approvals Queue
            </h4>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {pendingDeposits.length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Verify Tron TxIDs and approve pending USDT deposits to credit user balances.
          </p>
        </div>

        <div
          onClick={() => setAdminTab('withdrawals')}
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-300 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              Withdrawal Queue & Payouts
            </h4>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
              {pendingWithdrawals.length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Review user TRC-20 wallet payout requests, authorize disbursements or issue refunds.
          </p>
        </div>

        <div
          onClick={() => setAdminTab('plans')}
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-teal-300 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              Investment Plans Configuration
            </h4>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Add, modify daily ROI %, adjust durations, and customize staking tiers.
          </p>
        </div>
      </div>
    </div>
  );
};
