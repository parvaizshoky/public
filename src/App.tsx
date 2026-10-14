import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthGateView } from './components/AuthGateView';

// Admin views
import { AdminLoginView } from './components/AdminPanel/AdminLoginView';
import { AdminOverview } from './components/AdminPanel/AdminOverview';
import { AdminDeposits } from './components/AdminPanel/AdminDeposits';
import { AdminWithdrawals } from './components/AdminPanel/AdminWithdrawals';
import { AdminUsers } from './components/AdminPanel/AdminUsers';
import { AdminPlans } from './components/AdminPanel/AdminPlans';
import { AdminSettings } from './components/AdminPanel/AdminSettings';

// User Dashboard views
import { OverviewTab } from './components/UserDashboard/OverviewTab';
import { DepositTab } from './components/UserDashboard/DepositTab';
import { PlansTab } from './components/UserDashboard/PlansTab';
import { WithdrawTab } from './components/UserDashboard/WithdrawTab';
import { ReferralTab } from './components/UserDashboard/ReferralTab';
import { ProfileTab } from './components/UserDashboard/ProfileTab';

import { ShieldAlert, Coins } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentUser,
    currentAdmin,
    currentRoute,
    navigateToRoute,
    activeTab,
    adminTab,
    adminLogout,
  } = useApp();

  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);

  // 1. ROUTE: /admin (Dedicated Admin Portal)
  if (currentRoute === 'admin') {
    // If admin is not logged in, show dedicated Admin Login Screen
    if (!currentAdmin) {
      return <AdminLoginView />;
    }

    // If admin is logged in, show full Admin Dashboard
    return (
      <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col selection:bg-amber-500/20 selection:text-amber-800">
        <Navbar onOpenNotifications={() => setNotificationsModalOpen(true)} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
          {/* Admin Header Ribbon */}
          <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>TronYield Superadmin Management</span>
                  <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase font-bold">
                    URL: /admin
                  </span>
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Logged in as {currentAdmin.username} ({currentAdmin.email}).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => navigateToRoute('user')}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200 whitespace-nowrap shadow-2xs"
              >
                Go to Client Site (/)
              </button>
              <button
                onClick={adminLogout}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shadow-2xs"
              >
                Sign Out Admin
              </button>
            </div>
          </div>

          {/* Admin View Router */}
          {adminTab === 'overview' && <AdminOverview />}
          {adminTab === 'deposits' && <AdminDeposits />}
          {adminTab === 'withdrawals' && <AdminWithdrawals />}
          {adminTab === 'users' && <AdminUsers />}
          {adminTab === 'plans' && <AdminPlans />}
          {adminTab === 'settings' && <AdminSettings />}
        </main>

        <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 font-mono shadow-2xs">
          TronYield Administration Engine · Dedicated Endpoint: /admin
        </footer>

        <NotificationsModal
          isOpen={notificationsModalOpen}
          onClose={() => setNotificationsModalOpen(false)}
        />
      </div>
    );
  }

  // 2. ROUTE: / (User Website)
  // Requirement: Without signup or login, entry is strictly blocked
  if (!currentUser) {
    return <AuthGateView />;
  }

  // Logged-in User Dashboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-700">
      <Navbar onOpenNotifications={() => setNotificationsModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'deposit' && <DepositTab />}
        {activeTab === 'plans' && <PlansTab />}
        {activeTab === 'withdraw' && <WithdrawTab />}
        {activeTab === 'referral' && <ReferralTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-700">TronYield Protocol</span>
            <span>·</span>
            <span>USDT TRC-20 Institutional Settlement</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateToRoute('admin')}
              className="text-slate-600 hover:text-amber-600 transition-colors font-mono font-medium"
            >
              Admin Portal (/admin)
            </button>
            <span>·</span>
            <span>Manual Admin Verification</span>
            <span>·</span>
            <span className="font-mono text-emerald-600 font-semibold">Tron Network Verified</span>
          </div>
        </div>
      </footer>

      <NotificationsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
