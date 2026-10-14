import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Users,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Coins,
  ListTodo,
  ArrowRight,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const {
    currentUser,
    investments,
    deposits,
    withdrawals,
    settings,
    dailyTasks,
    setActiveTab,
    simulateYieldCycle,
    claimInvestmentProfit,
  } = useApp();

  if (!currentUser) return null;

  const userInvestments = investments.filter(
    (i) => i.userId === currentUser.id && i.status === 'active'
  );
  const totalActiveInvested = userInvestments.reduce((sum, i) => sum + i.amountInvested, 0);
  const totalUnclaimedYield = userInvestments.reduce((sum, i) => sum + i.unclaimedProfit, 0);

  // Recent user activities
  const userDeposits = deposits.filter((d) => d.userId === currentUser.id);
  const userWithdrawals = withdrawals.filter((w) => w.userId === currentUser.id);

  const allActivity = [
    ...userDeposits.map((d) => ({
      id: d.id,
      type: 'deposit' as const,
      amount: d.amount,
      status: d.status,
      date: d.createdAt,
      detail: `TRC-20: ${d.txHash.slice(0, 10)}...`,
    })),
    ...userWithdrawals.map((w) => ({
      id: w.id,
      type: 'withdrawal' as const,
      amount: w.amount,
      status: w.status,
      date: w.createdAt,
      detail: `To: ${w.payoutAddress.slice(0, 10)}...`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Announcement Banner */}
      {settings.announcement && (
        <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 text-slate-700 text-xs flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="leading-snug font-medium">{settings.announcement}</span>
          </div>
          <button
            onClick={() => setActiveTab('deposit')}
            className="text-emerald-700 hover:text-emerald-800 font-bold whitespace-nowrap shrink-0 text-xs bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            Deposit Now &rarr;
          </button>
        </div>
      )}

      {/* Main KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Balance */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Active Wallet Balance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums tracking-tight">
            ${currentUser.balance.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Currency: USDT TRC-20</span>
            <button
              onClick={() => setActiveTab('deposit')}
              className="text-emerald-700 hover:text-emerald-800 font-bold"
            >
              + Add Funds
            </button>
          </div>
        </div>

        {/* Total Profit Earned */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Total Profit Generated</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-700 font-mono tabular-nums tracking-tight">
            +${currentUser.totalProfitGenerated.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Unclaimed: ${totalUnclaimedYield.toFixed(2)}</span>
            {totalUnclaimedYield > 0 && (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Ready to claim
              </span>
            )}
          </div>
        </div>

        {/* Invested Capital */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Active Staked Capital</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums tracking-tight">
            ${totalActiveInvested.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{userInvestments.length} Active Contracts</span>
            <button
              onClick={() => setActiveTab('plans')}
              className="text-purple-700 hover:text-purple-800 font-bold"
            >
              View Plans &rarr;
            </button>
          </div>
        </div>

        {/* Total Deposited / Withdrawn */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Deposit / Withdrawal</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-emerald-700 font-mono tabular-nums">
              ↓${currentUser.totalDeposited.toFixed(0)}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-lg font-extrabold text-amber-700 font-mono tabular-nums">
              ↑${currentUser.totalWithdrawn.toFixed(0)}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
            <span>Referrals: {currentUser.referralCount}</span>
            <span className="font-mono text-emerald-700 font-bold">+${currentUser.referralEarnings.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Daily Tasks Banner */}
      {(() => {
        const userTasks = dailyTasks.filter((t) => t.userId === currentUser.id);
        const pendingCount = userTasks.filter((t) => !t.completed).length;
        const completedCount = userTasks.filter((t) => t.completed).length;

        return (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white border border-emerald-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                <ListTodo className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Daily Earning Tasks & Verification
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                    {pendingCount} Pending
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {userInvestments.length > 0
                    ? `Solve daily math verification challenges with anti-bot captcha to claim instant USDT earnings.`
                    : 'Activate an investment plan to unlock daily tasks tailored to your plan size!'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('tasks')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
            >
              <span>{userInvestments.length > 0 ? 'Solve Today\'s Tasks' : 'View Daily Tasks'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })()}

      {/* Yield Accrual Quick Sandbox Action */}
      <div className="p-4 rounded-3xl bg-white border border-emerald-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>Smart Yield Generation Engine</span>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                Automated 24H Cycle
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Profits accrue daily into active investments. Click the simulation button to test an instant 24H yield cycle.
            </p>
          </div>
        </div>
        <button
          onClick={simulateYieldCycle}
          disabled={userInvestments.length === 0}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap shrink-0 shadow-sm ${
            userInvestments.length > 0
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
          title={userInvestments.length === 0 ? 'Activate an investment plan first' : 'Advance 24 hours of profits'}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Accrue 24H Yield (Test Simulator)</span>
        </button>
      </div>

      {/* Active Investments Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Active Staking Contracts</h3>
            <p className="text-xs text-slate-500">Monitoring real-time performance and profit distribution</p>
          </div>
          <button
            onClick={() => setActiveTab('plans')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          >
            + New Investment
          </button>
        </div>

        {userInvestments.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <Layers className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-400" />
            <p className="text-sm font-semibold text-slate-600">No active investment contracts yet.</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Deposit USDT TRC-20 and lock capital into an investment plan to start receiving daily guaranteed returns.
            </p>
            <button
              onClick={() => setActiveTab('plans')}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              Browse Available Plans
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {userInvestments.map((inv) => {
              const progressPercent = Math.min(100, Math.round((inv.daysElapsed / inv.durationDays) * 100));
              return (
                <div
                  key={inv.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{inv.planName}</span>
                        <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {inv.dailyRoi}% Daily
                        </span>
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Active
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-3 font-mono">
                        <span>Principal: ${inv.amountInvested.toFixed(2)} USDT</span>
                        <span>·</span>
                        <span className="font-bold text-emerald-700">Daily Return: ${inv.dailyProfit.toFixed(2)} USDT</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-500 font-medium">Unclaimed Yield</div>
                        <div className="text-base font-black text-emerald-700 font-mono tabular-nums">
                          ${inv.unclaimedProfit.toFixed(2)} USDT
                        </div>
                      </div>
                      {inv.unclaimedProfit > 0 && (
                        <button
                          onClick={() => claimInvestmentProfit(inv.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                        >
                          Collect
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>Day {inv.daysElapsed} of {inv.durationDays}</span>
                      <span>{progressPercent}% Complete</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Deposit Quickcard */}
        <div
          onClick={() => setActiveTab('deposit')}
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer group shadow-sm"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-105 transition-transform">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
            Deposit USDT (TRC-20)
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Deposit Tether via Tron network. Requires manual verification and admin review.
          </p>
        </div>

        {/* Withdraw Quickcard */}
        <div
          onClick={() => setActiveTab('withdraw')}
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-300 transition-all cursor-pointer group shadow-sm"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 group-hover:scale-105 transition-transform">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
            Withdraw to TRC-20 Wallet
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Fast withdrawals to your personal TRC20 address, manually audited for integrity.
          </p>
        </div>

        {/* Referrals Quickcard */}
        <div
          onClick={() => setActiveTab('referral')}
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-purple-300 transition-all cursor-pointer group shadow-sm"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
            Invite Friends & Earn {settings.referralTier1Percent}%
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Share your unique invite code. Receive instant commission when referred users deposit.
          </p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 mb-1">Recent Transactions</h3>
        <p className="text-xs text-slate-500 mb-4">Latest deposit and withdrawal operations</p>

        {allActivity.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center font-medium">No transaction history found yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3 rounded-l-xl">Type</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right rounded-r-xl">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {allActivity.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1.5 font-sans font-bold">
                        {item.type === 'deposit' ? (
                          <>
                            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Deposit</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-amber-700">Withdrawal</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">
                      ${item.amount.toFixed(2)} USDT
                    </td>
                    <td className="py-3 px-3 text-slate-500 truncate max-w-xs">{item.detail}</td>
                    <td className="py-3 px-3 text-slate-500 font-sans">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {item.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-sans font-semibold">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                      {item.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-sans font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {item.status === 'rejected' && (
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
