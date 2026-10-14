import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Bell,
  Coins,
  LogOut,
  ChevronDown,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Users,
  Settings,
  Shield,
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const {
    currentUser,
    currentAdmin,
    logout,
    adminLogout,
    activeTab,
    setActiveTab,
    adminTab,
    setAdminTab,
    currentRoute,
    navigateToRoute,
    unreadCount,
    deposits,
    withdrawals,
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const pendingDepositsCount = deposits.filter((d) => d.status === 'pending').length;
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (currentRoute === 'admin') setAdminTab('overview');
                else setActiveTab('overview');
              }}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${
                  currentRoute === 'admin'
                    ? 'bg-gradient-to-tr from-amber-600 to-amber-500 shadow-amber-500/20 text-white'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-600/20 text-white'
                }`}
              >
                {currentRoute === 'admin' ? (
                  <ShieldAlert className="w-5 h-5 stroke-[2.4]" />
                ) : (
                  <Coins className="w-5 h-5 stroke-[2.4]" />
                )}
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                  Tron
                  <span className={currentRoute === 'admin' ? 'text-amber-600' : 'text-emerald-600'}>
                    Yield
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 tracking-wider font-mono uppercase block font-semibold">
                  {currentRoute === 'admin' ? 'Superadmin Control Portal' : 'USDT TRC-20 Platform'}
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            {currentRoute === 'user' ? (
              <>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    activeTab === 'overview'
                      ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('deposit')}
                  className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    activeTab === 'deposit'
                      ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                  Deposit USDT
                </button>
                <button
                  onClick={() => setActiveTab('plans')}
                  className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    activeTab === 'plans'
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Yield Plans
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    activeTab === 'withdraw'
                      ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-amber-600" />
                  Withdraw
                </button>
                <button
                  onClick={() => setActiveTab('referral')}
                  className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    activeTab === 'referral'
                      ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4 text-purple-600" />
                  Invite Friends
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAdminTab('overview')}
                  className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                    adminTab === 'overview'
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Platform Analytics
                </button>
                <button
                  onClick={() => setAdminTab('deposits')}
                  className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    adminTab === 'deposits'
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Deposit Queue
                  {pendingDepositsCount > 0 && (
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                      {pendingDepositsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setAdminTab('withdrawals')}
                  className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    adminTab === 'withdrawals'
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Withdrawal Queue
                  {pendingWithdrawalsCount > 0 && (
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                      {pendingWithdrawalsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setAdminTab('users')}
                  className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                    adminTab === 'users'
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  User Database
                </button>
                <button
                  onClick={() => setAdminTab('plans')}
                  className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                    adminTab === 'plans'
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Plan Config
                </button>
                <button
                  onClick={() => setAdminTab('settings')}
                  className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                    adminTab === 'settings'
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Settings
                </button>
              </>
            )}
          </nav>

          {/* Actions & Auth */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Route Switcher */}
            {currentRoute === 'user' ? (
              <button
                onClick={() => navigateToRoute('admin')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-amber-700 hover:border-amber-400 transition-all whitespace-nowrap flex items-center gap-1.5 shadow-2xs"
                title="Open Admin Portal at /admin"
              >
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>Admin Portal (/admin)</span>
              </button>
            ) : (
              <button
                onClick={() => navigateToRoute('user')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-emerald-700 hover:border-emerald-400 transition-all whitespace-nowrap flex items-center gap-1.5 shadow-2xs"
                title="Go to client user website at /"
              >
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                <span>Client Site (/)</span>
              </button>
            )}

            {/* Notification Bell */}
            {currentRoute === 'user' && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </button>
            )}

            {/* Account & Logout */}
            {currentRoute === 'admin' ? (
              currentAdmin && (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block text-right">
                    <span className="text-xs font-bold text-slate-900 block">{currentAdmin.username}</span>
                    <span className="text-[10px] font-mono text-amber-700 font-semibold">Superadmin</span>
                  </div>
                  <button
                    onClick={adminLogout}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    title="Sign out of Admin Portal"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )
            ) : currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors focus:outline-none shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xs font-bold text-emerald-700">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {currentUser.username}
                    </div>
                    <div className="text-[11px] font-mono text-emerald-700 font-bold tabular-nums">
                      ${currentUser.balance.toFixed(2)} USDT
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-500">Balance:</span>
                        <span className="text-emerald-600 font-bold tabular-nums">
                          ${currentUser.balance.toFixed(2)} USDT
                        </span>
                      </div>
                    </div>

                    <div className="px-2 pt-1">
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                        Account Settings & Wallet
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-200 overflow-x-auto gap-2">
          {currentRoute === 'user' ? (
            <>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                  activeTab === 'overview' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('deposit')}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                  activeTab === 'deposit' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                  activeTab === 'plans' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600'
                }`}
              >
                Plans
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                  activeTab === 'withdraw' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'
                }`}
              >
                Withdraw
              </button>
              <button
                onClick={() => setActiveTab('referral')}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                  activeTab === 'referral' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'
                }`}
              >
                Invite
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setAdminTab('overview')}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                  adminTab === 'overview' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setAdminTab('deposits')}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                  adminTab === 'deposits' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
                }`}
              >
                Deposits ({pendingDepositsCount})
              </button>
              <button
                onClick={() => setAdminTab('withdrawals')}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                  adminTab === 'withdrawals' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
                }`}
              >
                Withdrawals ({pendingWithdrawalsCount})
              </button>
              <button
                onClick={() => setAdminTab('users')}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                  adminTab === 'users' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setAdminTab('plans')}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                  adminTab === 'plans' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
                }`}
              >
                Plans
              </button>
              <button
                onClick={() => setAdminTab('settings')}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                  adminTab === 'settings' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
                }`}
              >
                Settings
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
