import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Users,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useApp();

  if (!isOpen) return null;

  // Filter notifications for current user or platform wide broadcast ('all')
  const userNotifications = notifications.filter(
    (n) => (currentUser && (n.userId === currentUser.id || n.userId === 'all')) || n.userId === 'all'
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-amber-600" />;
      case 'investment':
        return <TrendingUp className="w-4 h-4 text-teal-600" />;
      case 'referral':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'admin':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
              <Bell className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Platform Notifications</h3>
              <p className="text-xs text-slate-500">Real-time alerts on your assets & operations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between py-2.5 border-b border-slate-100 text-xs shrink-0">
          <span className="text-slate-500 font-mono font-medium">
            {userNotifications.length} Total Alerts
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllNotificationsRead}
              className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors font-bold"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark Read
            </button>
            <button
              onClick={clearNotifications}
              className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto py-2 space-y-2.5 flex-1 pr-1">
          {userNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
              <p className="text-sm font-semibold text-slate-500">No notifications found.</p>
              <p className="text-xs text-slate-400 mt-0.5">
                New deposits, approvals, and referral rewards will appear here.
              </p>
            </div>
          ) : (
            userNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-slate-50/70 border-slate-200 text-slate-600'
                    : 'bg-white border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{n.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 font-medium">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
