import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InvestmentPlan } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Save,
  Globe,
  ExternalLink,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';

export const AdminPlans: React.FC = () => {
  const { plans, adminCreatePlan, adminUpdatePlan, adminDeletePlan } = useApp();

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingPlan, setEditingPlan] = useState<Partial<InvestmentPlan>>({});

  const handleOpenCreate = () => {
    setEditingPlan({
      name: 'Custom Yield Tier',
      tagline: 'Custom yield protocol pool with fixed daily returns.',
      dailyRoi: 10.0,
      durationDays: 14,
      minDeposit: 30,
      maxDeposit: 1000,
      principalReturn: true,
      status: 'active',
      badge: 'Earn Daily USDT',
      colorScheme: 'emerald',
      websiteUrl: '',
    });
    setModalMode('create');
  };

  const handleOpenEdit = (plan: InvestmentPlan) => {
    setEditingPlan({ ...plan });
    setModalMode('edit');
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan.name || !editingPlan.dailyRoi || !editingPlan.durationDays) return;

    const trimmedUrl = editingPlan.websiteUrl?.trim();

    if (modalMode === 'create') {
      adminCreatePlan({
        name: editingPlan.name!,
        tagline: editingPlan.tagline || '',
        dailyRoi: Number(editingPlan.dailyRoi),
        durationDays: Number(editingPlan.durationDays),
        minDeposit: Number(editingPlan.minDeposit || 30),
        maxDeposit: Number(editingPlan.maxDeposit || 5000),
        principalReturn: editingPlan.principalReturn ?? true,
        status: editingPlan.status || 'active',
        badge: editingPlan.badge || '',
        colorScheme: editingPlan.colorScheme || 'emerald',
        websiteUrl: trimmedUrl && trimmedUrl.length > 0 ? trimmedUrl : undefined,
      });
    } else if (modalMode === 'edit' && editingPlan.id) {
      adminUpdatePlan({
        ...(editingPlan as InvestmentPlan),
        websiteUrl: trimmedUrl && trimmedUrl.length > 0 ? trimmedUrl : undefined,
      });
    }

    setModalMode(null);
  };

  const handleToggleStatus = (plan: InvestmentPlan) => {
    adminUpdatePlan({
      ...plan,
      status: plan.status === 'active' ? 'inactive' : 'active',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Investment Plans Configuration</span>
            <span className="text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-bold">
              Live Customization
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create new staking tiers, attach external website links, adjust daily ROI percentages, and manage active plans.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plan</span>
        </button>
      </div>

      {/* Plans List Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                <th className="py-3 px-4">Plan Name & Website Link</th>
                <th className="py-3 px-4">Daily ROI %</th>
                <th className="py-3 px-4">Daily Earning Preview</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Min Deposit</th>
                <th className="py-3 px-4">Max Deposit</th>
                <th className="py-3 px-4">Capital Return</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {plans.map((plan) => {
                const dailyProfitOnMin = (plan.minDeposit * plan.dailyRoi) / 100;
                return (
                  <tr key={plan.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{plan.name}</span>
                        {plan.badge && (
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-bold">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                        {plan.tagline}
                      </div>

                      {/* Display Website Link if attached */}
                      {plan.websiteUrl ? (
                        <div className="mt-1.5">
                          <a
                            href={plan.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100/70 px-2 py-0.5 rounded border border-teal-200 transition-colors font-mono max-w-xs truncate"
                            title={plan.websiteUrl}
                          >
                            <Globe className="w-3 h-3 text-teal-600 shrink-0" />
                            <span className="truncate">{plan.websiteUrl}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0 text-teal-500" />
                          </a>
                        </div>
                      ) : (
                        <span className="inline-block mt-1 text-[10px] text-slate-400 font-mono">
                          No external website link attached
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-700 text-sm">
                      +{plan.dailyRoi}% / day
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-800 font-sans">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        Earn ${dailyProfitOnMin.toFixed(2)} / Day
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-800 font-semibold">
                      {plan.durationDays} Days
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-bold">
                      ${plan.minDeposit} USDT
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      ${plan.maxDeposit.toLocaleString()} USDT
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      {plan.principalReturn ? (
                        <span className="text-emerald-700 font-semibold text-[11px]">Returned at End</span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Included in Profit</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      <button
                        onClick={() => handleToggleStatus(plan)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                          plan.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {plan.status === 'active' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(plan)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 border border-slate-200 shadow-2xs"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-teal-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => adminDeletePlan(plan.id)}
                          className="p-1 hover:text-rose-600 text-slate-400 transition-colors"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Edit / Create Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{modalMode === 'create' ? 'Create New Staking Plan' : 'Edit Investment Plan'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure parameters that directly govern return generation, client terms, and external website links.
            </p>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Plan Name
                </label>
                <input
                  type="text"
                  required
                  value={editingPlan.name || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  placeholder="e.g. Starter Plan - $30"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tagline / Description
                </label>
                <input
                  type="text"
                  value={editingPlan.tagline || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, tagline: e.target.value })}
                  placeholder="e.g. Earn $3.00 daily income with a $30 investment."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* External Website Link Input (Requested: "create new plan wale section mein link ka bhii form hoo.jaha mein kisi website ki link paste kersko") */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-600" />
                    <span>Website Link / Project URL (Optional)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Paste any website URL
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://example.com or paste any website link here"
                    value={editingPlan.websiteUrl || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, websiteUrl: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 font-mono placeholder:font-sans"
                  />
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                {editingPlan.websiteUrl && (
                  <div className="mt-1 flex items-center justify-between text-[11px] text-teal-700 bg-teal-50 px-2 py-1 rounded-lg border border-teal-200">
                    <span className="flex items-center gap-1 truncate">
                      <Globe className="w-3 h-3 text-teal-600 shrink-0" />
                      <span className="truncate">Preview: {editingPlan.websiteUrl}</span>
                    </span>
                    <a
                      href={editingPlan.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-800 font-bold hover:underline shrink-0 flex items-center gap-0.5 ml-2"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
                <p className="text-[10px] text-slate-400 mt-1">
                  Users can click this link on the plan card to visit the official website or project page.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Daily ROI Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={editingPlan.dailyRoi || ''}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, dailyRoi: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-emerald-800 font-bold focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingPlan.durationDays || ''}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, durationDays: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Min Deposit (USDT)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingPlan.minDeposit || ''}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, minDeposit: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Max Deposit (USDT)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingPlan.maxDeposit || ''}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, maxDeposit: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Highlight Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Earn $3.00 Daily"
                    value={editingPlan.badge || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Plan Status
                  </label>
                  <select
                    value={editingPlan.status || 'active'}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, status: e.target.value as 'active' | 'inactive' })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="active">Active (Visible to users)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Plan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
