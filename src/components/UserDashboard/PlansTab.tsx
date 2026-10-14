import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InvestmentPlan } from '../../types';
import {
  Layers,
  TrendingUp,
  Clock,
  ShieldCheck,
  Check,
  AlertCircle,
  Zap,
  ArrowRight,
  X,
  Wallet,
  CheckCircle2,
  Coins,
  Sparkles,
  Globe,
  ExternalLink,
} from 'lucide-react';

export const PlansTab: React.FC = () => {
  const {
    currentUser,
    plans,
    createInvestment,
    investments,
    claimInvestmentProfit,
    simulateYieldCycle,
    setActiveTab,
  } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investAmount, setInvestAmount] = useState<string>('30');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!currentUser) return null;

  const activePlans = plans.filter((p) => p.status === 'active');
  const userInvestments = investments.filter(
    (i) => i.userId === currentUser.id && i.status === 'active'
  );

  const handleOpenModal = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setInvestAmount(plan.minDeposit.toString());
    setError(null);
    setSuccess(null);
  };

  const handleInvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setError(null);

    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please provide a valid investment amount.');
      return;
    }

    const res = createInvestment(selectedPlan.id, amount);
    if (!res.success) {
      setError(res.message || 'Investment failed.');
      return;
    }

    setSuccess(`Successfully activated ${selectedPlan.name} with ${amount.toFixed(2)} USDT!`);
    setTimeout(() => {
      setSelectedPlan(null);
      setSuccess(null);
    }, 1500);
  };

  // Calculator preview for modal
  const calcAmount = parseFloat(investAmount) || (selectedPlan?.minDeposit || 0);
  const calcDailyProfit = selectedPlan ? (calcAmount * selectedPlan.dailyRoi) / 100 : 0;
  const calcTotalProfit = selectedPlan ? calcDailyProfit * selectedPlan.durationDays : 0;
  const calcTotalReturn = selectedPlan ? calcAmount + calcTotalProfit : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>High-Yield Liquidity Plans</span>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              TRC-20 Staking
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose a plan tailored to your capital. Returns accrue every 24 hours into your active balance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block font-medium">Available Balance:</span>
            <span className="text-sm font-bold font-mono text-emerald-600 tabular-nums">
              ${currentUser.balance.toFixed(2)} USDT
            </span>
          </div>
          <button
            onClick={() => setActiveTab('deposit')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white rounded-xl transition-colors shadow-2xs"
          >
            + Deposit USDT
          </button>
        </div>
      </div>

      {/* Available Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activePlans.map((plan) => {
          const totalRoiPercent = (plan.dailyRoi * plan.durationDays).toFixed(0);
          const minDailyEarning = (plan.minDeposit * plan.dailyRoi) / 100;

          // Check if current user has an active investment in this specific plan
          const activeUserInv = userInvestments.find(
            (inv) => inv.planId === plan.id && inv.status === 'active'
          );
          const isPlanActive = Boolean(activeUserInv);

          return (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between relative shadow-sm hover:shadow-md ${
                isPlanActive
                  ? 'border-emerald-400 ring-2 ring-emerald-400/20 bg-gradient-to-b from-white to-emerald-50/20'
                  : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div>
                {/* Top Badge & Active Indicator */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {plan.badge || `Daily ROI +${plan.dailyRoi}%`}
                  </span>

                  {isPlanActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">
                      {plan.durationDays} Days Term
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1 mb-3 min-h-[32px] leading-relaxed">
                  {plan.tagline}
                </p>

                {/* External Website Link Button if provided */}
                {plan.websiteUrl && (
                  <div className="mb-3.5">
                    <a
                      href={plan.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-xl transition-colors w-full group/link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe className="w-3.5 h-3.5 text-teal-600 group-hover/link:rotate-12 transition-transform" />
                      <span className="truncate">Visit Official Project Website</span>
                      <ExternalLink className="w-3 h-3 text-teal-500 shrink-0" />
                    </a>
                  </div>
                )}

                {/* Prominent Daily Earning Box */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 mb-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-emerald-600" />
                      Guaranteed Return
                    </span>
                    <span className="text-xs font-extrabold font-mono text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      +{plan.dailyRoi}% / day
                    </span>
                  </div>

                  <div className="text-lg sm:text-xl font-black text-emerald-800 font-mono tracking-tight mt-1.5 flex items-baseline gap-1">
                    <span>Daily Earning: ${minDailyEarning.toFixed(2)} USDT</span>
                  </div>

                  <div className="text-[11px] text-emerald-600 mt-1 flex items-center justify-between font-medium">
                    <span>On ${plan.minDeposit} USDT Min Investment</span>
                    <span>Total ROI: +{totalRoiPercent}%</span>
                  </div>
                </div>

                {/* Key Specs */}
                <div className="space-y-2 text-xs text-slate-600 mb-6 font-mono p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-sans">Min Deposit:</span>
                    <span className="font-bold text-slate-900">${plan.minDeposit} USDT</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-sans">Max Deposit:</span>
                    <span className="text-slate-700">${plan.maxDeposit.toLocaleString()} USDT</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-sans">Contract Period:</span>
                    <span className="font-bold text-slate-800">{plan.durationDays} Days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-sans">Capital Return:</span>
                    <span className="text-emerald-700 font-sans font-semibold">
                      {plan.principalReturn ? '100% at End' : 'Included in ROI'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Requirement: Active badge for activated plans, and prominent Activate Now button for non-activated */}
              <div className="space-y-2 mt-auto">
                {isPlanActive && activeUserInv ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Plan is Active</span>
                      </div>
                      <div className="text-[11px] font-mono text-emerald-700 mt-1">
                        Staked: ${activeUserInv.amountInvested.toFixed(2)} USDT · Daily: +${activeUserInv.dailyProfit.toFixed(2)} USDT
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenModal(plan)}
                      className="w-full py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <span>Invest More in Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenModal(plan)}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/40 hover:ring-emerald-600 flex items-center justify-center gap-2 group"
                  >
                    <Zap className="w-4 h-4 fill-amber-300 text-amber-300 group-hover:scale-110 transition-transform" />
                    <span className="tracking-wide uppercase text-sm font-black">Activate Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active User Contracts Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">My Active Staking Portfolio</h3>
            <p className="text-xs text-slate-500">
              Live yield progression across your active contract allocations
            </p>
          </div>
          <button
            onClick={simulateYieldCycle}
            disabled={userInvestments.length === 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              userInvestments.length > 0
                ? 'bg-amber-500/15 text-amber-800 border border-amber-300 hover:bg-amber-500/25'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulate 24H Yield Cycle</span>
          </button>
        </div>

        {userInvestments.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No active staking contracts yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Select one of the high-yield plans above and click &quot;Activate Now&quot; to begin generating daily passive returns.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userInvestments.map((inv) => {
              const progressPct = Math.min(100, Math.round((inv.daysElapsed / inv.durationDays) * 100));
              return (
                <div
                  key={inv.id}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{inv.planName}</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Started {new Date(inv.startDate).toLocaleDateString()} · {inv.daysElapsed}/{inv.durationDays} Days Completed
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      +{inv.dailyRoi}% / day
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-xl border border-slate-200/80 font-mono text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-sans">Principal</span>
                      <span className="text-xs font-bold text-slate-800">
                        ${inv.amountInvested.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block font-sans">Daily Yield</span>
                      <span className="text-xs font-bold text-emerald-600">
                        +${inv.dailyProfit.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block font-sans">Total Claimed</span>
                      <span className="text-xs font-bold text-teal-600">
                        ${inv.profitClaimed.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>Term Duration</span>
                      <span>{progressPct}% ({inv.daysElapsed} of {inv.durationDays} Days)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Claim Button */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-medium">Unclaimed Yield:</span>
                      <span className="text-sm font-bold font-mono text-emerald-700">
                        ${inv.unclaimedProfit.toFixed(2)} USDT
                      </span>
                    </div>
                    <button
                      onClick={() => claimInvestmentProfit(inv.id)}
                      disabled={inv.unclaimedProfit <= 0}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        inv.unclaimedProfit > 0
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Collect Yield</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Investment Confirmation & Calculator Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 overflow-hidden">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold text-xs">
                TRC
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Activate {selectedPlan.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">{selectedPlan.tagline}</p>

            {/* If websiteUrl is available, show it */}
            {selectedPlan.websiteUrl && (
              <div className="mb-4 p-2.5 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-teal-800 font-medium flex items-center gap-1.5 truncate">
                  <Globe className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">Official Project Resource:</span>
                </span>
                <a
                  href={selectedPlan.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 font-bold hover:underline flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Visit Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleInvestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex justify-between">
                  <span>Investment Amount (USDT)</span>
                  <span className="text-slate-400 font-mono">
                    Balance: ${currentUser.balance.toFixed(2)} USDT
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-mono">$</span>
                  <input
                    type="number"
                    step="any"
                    min={selectedPlan.minDeposit}
                    max={selectedPlan.maxDeposit}
                    required
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    className="w-full pl-8 pr-20 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono font-bold text-slate-500">
                    USDT
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                  <span>Min: ${selectedPlan.minDeposit} USDT</span>
                  <span>Max: ${selectedPlan.maxDeposit.toLocaleString()} USDT</span>
                </div>
              </div>

              {/* Live Yield Projection Calculator */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Projected Returns Breakdown:</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Daily Earning ({selectedPlan.dailyRoi}%):</span>
                  <span className="font-mono font-extrabold text-emerald-700 tabular-nums">
                    +${calcDailyProfit.toFixed(2)} USDT / Day
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Net Yield ({selectedPlan.durationDays} Days):</span>
                  <span className="font-mono font-bold text-teal-700 tabular-nums">
                    +${calcTotalProfit.toFixed(2)} USDT
                  </span>
                </div>
                <div className="flex justify-between text-slate-800 pt-2 border-t border-slate-200 font-semibold">
                  <span>Total Payout (Principal + Profit):</span>
                  <span className="font-mono font-extrabold text-slate-900 tabular-nums text-sm">
                    ${calcTotalReturn.toFixed(2)} USDT
                  </span>
                </div>
              </div>

              {currentUser.balance < calcAmount && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  Your current balance (${currentUser.balance.toFixed(2)}) is insufficient. Please deposit USDT first.
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={currentUser.balance < calcAmount}
                  className={`flex-1 py-2.5 px-4 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 ${
                    currentUser.balance >= calcAmount
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Confirm & Activate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
