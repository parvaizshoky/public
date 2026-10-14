import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  DepositTransaction,
  WithdrawalRequest,
  InvestmentPlan,
  UserInvestment,
  ReferralRecord,
  PlatformNotification,
  PlatformSettings,
} from '../types';
import {
  initialUsers,
  initialPlans,
  initialDeposits,
  initialWithdrawals,
  initialInvestments,
  initialReferrals,
  initialNotifications,
  initialPlatformSettings,
} from '../data/initialData';
import {
  syncDocToFirestore,
  deleteDocFromFirestore,
  loginWithGoogle,
  registerWithFirebase,
  loginWithFirebase,
  fetchCollectionFromFirestore,
  fetchDocFromFirestore,
  subscribeToCollection,
} from '../lib/firebaseSync';

const STORAGE_KEY = 'tronyield_app_v3';

interface AppContextType {
  currentUser: User | null;
  currentAdmin: User | null;
  users: User[];
  deposits: DepositTransaction[];
  withdrawals: WithdrawalRequest[];
  plans: InvestmentPlan[];
  investments: UserInvestment[];
  referrals: ReferralRecord[];
  notifications: PlatformNotification[];
  settings: PlatformSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;
  currentRoute: 'user' | 'admin';
  navigateToRoute: (route: 'user' | 'admin') => void;

  // User Auth
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  signup: (username: string, email: string, password?: string, referralCode?: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogleAction: (referralCode?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updates: { username?: string; trc20Address?: string; password?: string }) => void;

  // Admin Auth
  adminLogin: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  adminLogout: () => void;

  // Deposits
  submitDeposit: (amount: number, txHash: string, proofNote?: string) => { success: boolean; message?: string };
  approveDeposit: (depositId: string, notes?: string) => void;
  rejectDeposit: (depositId: string, reason: string) => void;

  // Withdrawals
  submitWithdrawal: (amount: number, payoutAddress: string) => { success: boolean; message?: string };
  approveWithdrawal: (withdrawalId: string, txHash?: string, notes?: string) => void;
  rejectWithdrawal: (withdrawalId: string, reason: string) => void;

  // Investments
  createInvestment: (planId: string, amount: number) => { success: boolean; message?: string };
  claimInvestmentProfit: (investmentId: string) => void;
  simulateYieldCycle: () => void; // Advances 24h of profits

  // Admin Controls
  adminUpdateSettings: (newSettings: Partial<PlatformSettings>) => void;
  adminCreatePlan: (plan: Omit<InvestmentPlan, 'id'>) => void;
  adminUpdatePlan: (plan: InvestmentPlan) => void;
  adminDeletePlan: (planId: string) => void;
  adminAdjustUserBalance: (userId: string, deltaAmount: number, reason: string) => void;
  adminToggleUserStatus: (userId: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  unreadCount: number;

  // Reset
  resetPlatformData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback to initial
    }
    return null;
  };

  // Determine initial route based on URL path or hash
  const getInitialRoute = (): 'user' | 'admin' => {
    if (typeof window === 'undefined') return 'user';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (path.includes('/admin') || hash.includes('admin') || search.includes('admin')) {
      return 'admin';
    }
    return 'user';
  };

  const [currentRoute, setCurrentRoute] = useState<'user' | 'admin'>(getInitialRoute);

  const navigateToRoute = (route: 'user' | 'admin') => {
    setCurrentRoute(route);
    try {
      if (route === 'admin') {
        window.history.pushState(null, '', '/admin');
      } else {
        window.history.pushState(null, '', '/');
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const savedState = loadSavedState();

  const [users, setUsers] = useState<User[]>(savedState?.users || initialUsers);

  // User auth state: starts null if no previously saved user session
  const [currentUser, setCurrentUser] = useState<User | null>(
    savedState?.currentUserId
      ? (savedState?.users || initialUsers).find((u: User) => u.id === savedState.currentUserId) || null
      : null
  );

  // Admin auth state: separate secure admin session
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(
    savedState?.adminUserId
      ? (savedState?.users || initialUsers).find((u: User) => u.id === savedState.adminUserId && u.role === 'admin') || null
      : null
  );

  const [deposits, setDeposits] = useState<DepositTransaction[]>(savedState?.deposits || initialDeposits);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(savedState?.withdrawals || initialWithdrawals);
  const [plans, setPlans] = useState<InvestmentPlan[]>(savedState?.plans || initialPlans);
  const [investments, setInvestments] = useState<UserInvestment[]>(savedState?.investments || initialInvestments);
  const [referrals, setReferrals] = useState<ReferralRecord[]>(savedState?.referrals || initialReferrals);
  const [notifications, setNotifications] = useState<PlatformNotification[]>(savedState?.notifications || initialNotifications);
  const [settings, setSettings] = useState<PlatformSettings>(savedState?.settings || initialPlatformSettings);

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [adminTab, setAdminTab] = useState<string>('overview');

  // Keep state saved to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        users,
        currentUserId: currentUser?.id || null,
        adminUserId: currentAdmin?.id || null,
        deposits,
        withdrawals,
        plans,
        investments,
        referrals,
        notifications,
        settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore storage error
    }
  }, [users, currentUser, currentAdmin, deposits, withdrawals, plans, investments, referrals, notifications, settings]);

  // Initial load and comprehensive real-time synchronization with Firebase Firestore
  useEffect(() => {
    let isMounted = true;

    const initFirestoreData = async () => {
      try {
        // 1. Fetch users from Firestore
        const remoteUsers = await fetchCollectionFromFirestore<User>('users');
        if (isMounted && remoteUsers && remoteUsers.length > 0) {
          setUsers((prev) => {
            const map = new Map<string, User>();
            prev.forEach((u) => map.set(u.id, u));
            remoteUsers.forEach((u) => {
              if (u && u.id) map.set(u.id, u);
            });
            return Array.from(map.values());
          });
        }

        // 2. Fetch deposits from Firestore
        const remoteDeposits = await fetchCollectionFromFirestore<DepositTransaction>('deposits');
        if (isMounted && remoteDeposits && remoteDeposits.length > 0) {
          setDeposits((prev) => {
            const map = new Map<string, DepositTransaction>();
            prev.forEach((d) => map.set(d.id, d));
            remoteDeposits.forEach((d) => map.set(d.id, d));
            return Array.from(map.values());
          });
        }

        // 3. Fetch withdrawals from Firestore
        const remoteWithdrawals = await fetchCollectionFromFirestore<WithdrawalRequest>('withdrawals');
        if (isMounted && remoteWithdrawals && remoteWithdrawals.length > 0) {
          setWithdrawals((prev) => {
            const map = new Map<string, WithdrawalRequest>();
            prev.forEach((w) => map.set(w.id, w));
            remoteWithdrawals.forEach((w) => map.set(w.id, w));
            return Array.from(map.values());
          });
        }

        // 4. Fetch investments from Firestore
        const remoteInvestments = await fetchCollectionFromFirestore<UserInvestment>('investments');
        if (isMounted && remoteInvestments && remoteInvestments.length > 0) {
          setInvestments((prev) => {
            const map = new Map<string, UserInvestment>();
            prev.forEach((inv) => map.set(inv.id, inv));
            remoteInvestments.forEach((inv) => map.set(inv.id, inv));
            return Array.from(map.values());
          });
        }

        // 5. Fetch plans from Firestore (if none, seed initialPlans to Firestore)
        const remotePlans = await fetchCollectionFromFirestore<InvestmentPlan>('plans');
        if (isMounted && remotePlans && remotePlans.length > 0) {
          setPlans(remotePlans);
        } else {
          // Seed standard plans to Firestore for consistency
          initialPlans.forEach((p) => syncDocToFirestore('plans', p.id, p));
        }

        // 6. Fetch referrals from Firestore
        const remoteReferrals = await fetchCollectionFromFirestore<ReferralRecord>('referrals');
        if (isMounted && remoteReferrals && remoteReferrals.length > 0) {
          setReferrals(remoteReferrals);
        }

        // 7. Fetch platform settings from Firestore
        const remoteSettings = await fetchDocFromFirestore<PlatformSettings>('settings', 'global');
        if (isMounted && remoteSettings) {
          setSettings(remoteSettings);
        } else {
          syncDocToFirestore('settings', 'global', initialPlatformSettings);
        }

        // 8. Fetch notifications from Firestore
        const remoteNotifications = await fetchCollectionFromFirestore<PlatformNotification>('notifications');
        if (isMounted && remoteNotifications && remoteNotifications.length > 0) {
          setNotifications(remoteNotifications);
        }
      } catch (err) {
        console.warn('[Firestore] Initial hydration notice:', err);
      }
    };

    initFirestoreData();

    // Subscribe to real-time changes in Firestore users
    const unsubscribeUsers = subscribeToCollection<User>('users', (remoteUsers) => {
      if (isMounted && remoteUsers && remoteUsers.length > 0) {
        setUsers((prev) => {
          const map = new Map<string, User>();
          prev.forEach((u) => map.set(u.id, u));
          remoteUsers.forEach((u) => {
            if (u && u.id) map.set(u.id, u);
          });
          return Array.from(map.values());
        });
      }
    });

    // Subscribe to deposits
    const unsubscribeDeposits = subscribeToCollection<DepositTransaction>('deposits', (remoteDeposits) => {
      if (isMounted && remoteDeposits) {
        setDeposits(remoteDeposits);
      }
    });

    // Subscribe to withdrawals
    const unsubscribeWithdrawals = subscribeToCollection<WithdrawalRequest>('withdrawals', (remoteWithdrawals) => {
      if (isMounted && remoteWithdrawals) {
        setWithdrawals(remoteWithdrawals);
      }
    });

    // Subscribe to investments
    const unsubscribeInvestments = subscribeToCollection<UserInvestment>('investments', (remoteInvestments) => {
      if (isMounted && remoteInvestments) {
        setInvestments(remoteInvestments);
      }
    });

    // Subscribe to plans
    const unsubscribePlans = subscribeToCollection<InvestmentPlan>('plans', (remotePlans) => {
      if (isMounted && remotePlans && remotePlans.length > 0) {
        setPlans(remotePlans);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeUsers();
      unsubscribeDeposits();
      unsubscribeWithdrawals();
      unsubscribeInvestments();
      unsubscribePlans();
    };
  }, []);

  // Sync currentUser with users list when users change
  useEffect(() => {
    if (currentUser) {
      const fresh = users.find((u) => u.id === currentUser.id);
      if (fresh) {
        setCurrentUser(fresh);
      }
    }
  }, [users]);

  // Add notification helper
  const addNotification = (
    userId: string,
    title: string,
    message: string,
    type: PlatformNotification['type']
  ) => {
    const notif: PlatformNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
    syncDocToFirestore('notifications', notif.id, notif);
  };

  // Auth: Login with Email & Password (checks Local + Firestore & signs in to Firebase Auth)
  const login = async (email: string, password?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    let found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    // If not found in current state, attempt finding directly in Firestore
    if (!found) {
      try {
        const remoteUsers = await fetchCollectionFromFirestore<User>('users');
        found = remoteUsers.find((u) => u.email.toLowerCase() === cleanEmail);
        if (found) {
          setUsers((prev) => [...prev.filter((u) => u.id !== found!.id), found!]);
        }
      } catch (err) {
        console.warn('Login Firestore search notice:', err);
      }
    }

    if (!found) {
      return { success: false, message: 'Account not found. Please sign up first.' };
    }
    if (found.status === 'suspended') {
      return { success: false, message: 'This account has been suspended by administration.' };
    }
    if (password && found.password && found.password !== password) {
      return { success: false, message: 'Invalid password. Please verify credentials.' };
    }

    // Authenticate with Firebase in background
    loginWithFirebase(cleanEmail, password);

    setCurrentUser(found);
    navigateToRoute('user');
    setActiveTab('overview');
    addNotification(found.id, 'Session Authenticated', `Welcome back, ${found.username}! You are securely logged in.`, 'info');
    return { success: true };
  };

  // Dedicated Admin Auth Login
  const adminLogin = async (email: string, password?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    let found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      try {
        const remoteUsers = await fetchCollectionFromFirestore<User>('users');
        found = remoteUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      } catch {
        // fallback
      }
    }

    if (!found) {
      return { success: false, message: 'Administrative credentials not recognized.' };
    }
    if (found.role !== 'admin') {
      return { success: false, message: 'Access denied: User does not possess administrative privileges.' };
    }
    if (password && found.password && found.password !== password) {
      return { success: false, message: 'Invalid administrative password.' };
    }

    loginWithFirebase(cleanEmail, password);
    setCurrentAdmin(found);
    navigateToRoute('admin');
    addNotification(found.id, 'Admin Portal Session Started', 'Superuser administrative dashboard initialized.', 'admin');
    return { success: true };
  };

  const adminLogout = () => {
    setCurrentAdmin(null);
  };

  // Auth: Signup - Registers with Firebase Auth AND saves user document into Firestore!
  const signup = async (username: string, email: string, password?: string, referralCode?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    // 1. Register user with Firebase Authentication (creates user on Firebase server)
    const fbAuthRes = await registerWithFirebase(cleanEmail, password);
    const userId = fbAuthRes.uid || `user_${Date.now()}`;

    const uniqueCode = `TY-${username.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Check if inviter exists
    let inviter: User | undefined;
    if (referralCode && referralCode.trim()) {
      inviter = users.find((u) => u.referralCode.toUpperCase() === referralCode.trim().toUpperCase());
    }

    const newUser: User = {
      id: userId,
      username: username.trim(),
      email: cleanEmail,
      password: password || '123456',
      role: 'user',
      trc20Address: '',
      balance: 0.0, // Fresh account starts with 0 USD as required!
      totalDeposited: 0.0,
      totalWithdrawn: 0.0,
      totalProfitGenerated: 0.0,
      referralCode: uniqueCode,
      referredBy: inviter ? inviter.referralCode : null,
      referralCount: 0,
      referralEarnings: 0.0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    let updatedUsers = [...users, newUser];

    if (inviter) {
      // Update inviter referral count
      const updatedInviter: User = {
        ...inviter,
        referralCount: inviter.referralCount + 1,
      };

      updatedUsers = updatedUsers.map((u) =>
        u.id === inviter!.id ? updatedInviter : u
      );

      // Create referral record
      const newRefRecord: ReferralRecord = {
        id: `ref_${Date.now()}`,
        inviterId: inviter.id,
        referredUserId: newUser.id,
        referredUsername: newUser.username,
        referredEmail: newUser.email,
        joinedAt: new Date().toISOString(),
        totalDeposited: 0,
        commissionEarned: 0,
        tier: 1,
      };
      setReferrals((prev) => [newRefRecord, ...prev]);

      // Sync updated inviter and new referral to Firestore
      syncDocToFirestore('users', inviter.id, updatedInviter);
      syncDocToFirestore('referrals', newRefRecord.id, newRefRecord);

      addNotification(
        inviter.id,
        'New Referral Joined!',
        `User ${newUser.username} registered using your referral code (${inviter.referralCode}).`,
        'referral'
      );
    }

    setUsers(updatedUsers);
    setCurrentUser(newUser);

    // 2. CRITICAL: Await saving the new user profile directly to Firebase Firestore server!
    const firestoreOk = await syncDocToFirestore('users', newUser.id, newUser);
    console.log(`[Manual Signup] User ${newUser.email} (${newUser.id}) saved to Firestore:`, firestoreOk);

    navigateToRoute('user');
    setActiveTab('overview');

    const welcomeNotif: PlatformNotification = {
      id: `notif_${Date.now()}_welcome`,
      userId: newUser.id,
      title: 'Welcome to TronYield!',
      message: 'Your account has been registered with 0.00 USD starting balance. Make a TRC-20 deposit to start generating daily yield.',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);
    syncDocToFirestore('notifications', welcomeNotif.id, welcomeNotif);

    return { success: true };
  };

  // Google Authentication Action
  const loginWithGoogleAction = async (referralCode?: string) => {
    const res = await loginWithGoogle();
    if (!res.success || !res.user) {
      return { success: false, message: res.message || 'Google sign-in was canceled or failed.' };
    }

    const email = res.user.email?.toLowerCase().trim() || '';
    const existing = users.find((u) => u.email.toLowerCase() === email);

    if (existing) {
      setCurrentUser(existing);
      if (existing.role === 'admin') {
        setCurrentAdmin(existing);
      }
      navigateToRoute('user');
      addNotification(existing.id, 'Session Authenticated', `Welcome back, ${existing.username}!`, 'info');
      return { success: true };
    }

    // New Google account initialized with 0 USD balance
    const autoUsername = res.user.displayName || email.split('@')[0] || `User_${Math.floor(100 + Math.random() * 900)}`;
    return signup(autoUsername, email, 'firebase_google_auth', referralCode);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      if (target.role === 'admin') {
        setCurrentAdmin(target);
        navigateToRoute('admin');
      } else {
        navigateToRoute('user');
      }
    }
  };

  const updateProfile = (updates: { username?: string; trc20Address?: string; password?: string }) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updated : u))
    );
    setCurrentUser(updated);
    syncDocToFirestore('users', currentUser.id, updated);
    addNotification(currentUser.id, 'Profile Updated', 'Your account settings and TRC-20 wallet were saved successfully.', 'info');
  };

  // Submit Deposit
  const submitDeposit = (amount: number, txHash: string, proofNote?: string) => {
    if (!currentUser) return { success: false, message: 'You must be logged in to make a deposit.' };
    if (amount < settings.minDeposit) {
      return { success: false, message: `Minimum deposit requirement is ${settings.minDeposit} USDT.` };
    }
    if (!txHash || txHash.trim().length < 10) {
      return { success: false, message: 'Please provide a valid TRC-20 Transaction Hash (TxID).' };
    }

    const newDeposit: DepositTransaction = {
      id: `dep_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userEmail: currentUser.email,
      amount,
      network: 'TRC20',
      receivingAddress: settings.officialTrc20Address,
      txHash: txHash.trim(),
      proofNote: proofNote?.trim() || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setDeposits((prev) => [newDeposit, ...prev]);
    syncDocToFirestore('deposits', newDeposit.id, newDeposit);

    // Notify user
    addNotification(
      currentUser.id,
      'Deposit Submitted for Verification',
      `Your deposit of ${amount.toFixed(2)} USDT (TRC-20) is under manual verification by the administration.`,
      'deposit'
    );

    // Notify admin
    const admins = users.filter((u) => u.role === 'admin');
    admins.forEach((admin) => {
      addNotification(
        admin.id,
        'Action Required: New Deposit Verification',
        `User ${currentUser.username} submitted a deposit of ${amount.toFixed(2)} USDT (TxID: ${txHash.slice(0, 12)}...).`,
        'admin'
      );
    });

    return { success: true };
  };

  // Approve Deposit (Admin)
  const approveDeposit = (depositId: string, notes?: string) => {
    const targetDep = deposits.find((d) => d.id === depositId);
    if (!targetDep || targetDep.status !== 'pending') return;

    const approvedDep: DepositTransaction = {
      ...targetDep,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewNotes: notes || 'Verified on TronScan ledger. Credit approved.',
    };

    // 1. Update deposit status
    setDeposits((prev) =>
      prev.map((d) => (d.id === depositId ? approvedDep : d))
    );
    syncDocToFirestore('deposits', depositId, approvedDep);

    // 2. Credit user balance & totalDeposited
    setUsers((prevUsers) => {
      return prevUsers.map((u) => {
        if (u.id === targetDep.userId) {
          const credited = {
            ...u,
            balance: u.balance + targetDep.amount,
            totalDeposited: u.totalDeposited + targetDep.amount,
          };
          syncDocToFirestore('users', u.id, credited);
          return credited;
        }
        return u;
      });
    });

    // 3. Check for referral commission
    const depositingUser = users.find((u) => u.id === targetDep.userId);
    if (depositingUser && depositingUser.referredBy) {
      const inviter = users.find((u) => u.referralCode === depositingUser.referredBy);
      if (inviter) {
        const commission = (targetDep.amount * settings.referralTier1Percent) / 100;
        if (commission > 0) {
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.id === inviter.id
                ? {
                    ...u,
                    balance: u.balance + commission,
                    referralEarnings: u.referralEarnings + commission,
                  }
                : u
            )
          );

          // Update or add referral record
          setReferrals((prevRefs) => {
            const existing = prevRefs.find((r) => r.referredUserId === depositingUser.id && r.inviterId === inviter.id);
            if (existing) {
              return prevRefs.map((r) =>
                r.id === existing.id
                  ? {
                      ...r,
                      totalDeposited: r.totalDeposited + targetDep.amount,
                      commissionEarned: r.commissionEarned + commission,
                    }
                  : r
              );
            }
            return [
              {
                id: `ref_${Date.now()}`,
                inviterId: inviter.id,
                referredUserId: depositingUser.id,
                referredUsername: depositingUser.username,
                referredEmail: depositingUser.email,
                joinedAt: depositingUser.createdAt,
                totalDeposited: targetDep.amount,
                commissionEarned: commission,
                tier: 1,
              },
              ...prevRefs,
            ];
          });

          addNotification(
            inviter.id,
            'Referral Commission Earned!',
            `You received ${commission.toFixed(2)} USDT (${settings.referralTier1Percent}%) commission from ${depositingUser.username}'s approved deposit!`,
            'referral'
          );
        }
      }
    }

    // 4. Notify user
    addNotification(
      targetDep.userId,
      'Deposit Approved & Credited!',
      `${targetDep.amount.toFixed(2)} USDT has been credited to your active balance. You can now invest in yield plans.`,
      'deposit'
    );
  };

  // Reject Deposit (Admin)
  const rejectDeposit = (depositId: string, reason: string) => {
    const targetDep = deposits.find((d) => d.id === depositId);
    if (!targetDep || targetDep.status !== 'pending') return;

    const rejectedDep: DepositTransaction = {
      ...targetDep,
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewNotes: reason || 'Transaction could not be verified on Tron blockchain.',
    };

    setDeposits((prev) =>
      prev.map((d) => (d.id === depositId ? rejectedDep : d))
    );
    syncDocToFirestore('deposits', depositId, rejectedDep);

    addNotification(
      targetDep.userId,
      'Deposit Rejected',
      `Your deposit request for ${targetDep.amount.toFixed(2)} USDT was declined. Reason: ${reason}`,
      'deposit'
    );
  };

  // Submit Withdrawal
  const submitWithdrawal = (amount: number, payoutAddress: string) => {
    if (!currentUser) return { success: false, message: 'You must be logged in to request a withdrawal.' };
    if (amount < settings.minWithdrawal) {
      return { success: false, message: `Minimum withdrawal amount is ${settings.minWithdrawal} USDT.` };
    }
    if (currentUser.balance < amount) {
      return { success: false, message: `Insufficient balance. Available: ${currentUser.balance.toFixed(2)} USDT.` };
    }
    if (!payoutAddress || payoutAddress.trim().length < 15) {
      return { success: false, message: 'Please provide a valid TRC-20 wallet payout address.' };
    }

    const fee = (amount * settings.withdrawalFeePercent) / 100;
    const netAmount = amount - fee;

    // Deduct immediately from user balance (held in escrow pending admin verification)
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - amount,
      trc20Address: currentUser.trc20Address || payoutAddress.trim(),
    };
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );
    syncDocToFirestore('users', currentUser.id, updatedUser);

    const newWd: WithdrawalRequest = {
      id: `wd_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userEmail: currentUser.email,
      amount,
      fee,
      netAmount,
      payoutAddress: payoutAddress.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setWithdrawals((prev) => [newWd, ...prev]);
    syncDocToFirestore('withdrawals', newWd.id, newWd);

    addNotification(
      currentUser.id,
      'Withdrawal Request Received',
      `Your withdrawal for ${amount.toFixed(2)} USDT (Net: ${netAmount.toFixed(2)} USDT) is queued for manual admin verification.`,
      'withdrawal'
    );

    // Notify admins
    const admins = users.filter((u) => u.role === 'admin');
    admins.forEach((admin) => {
      addNotification(
        admin.id,
        'Action Required: Withdrawal Approval',
        `User ${currentUser.username} requested a withdrawal of ${amount.toFixed(2)} USDT to ${payoutAddress.slice(0, 10)}...`,
        'admin'
      );
    });

    return { success: true };
  };

  // Approve Withdrawal (Admin)
  const approveWithdrawal = (withdrawalId: string, txHash?: string, notes?: string) => {
    const targetWd = withdrawals.find((w) => w.id === withdrawalId);
    if (!targetWd || targetWd.status !== 'pending') return;

    const approvedWd: WithdrawalRequest = {
      ...targetWd,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      txHash: txHash || `tx_tron_${Date.now().toString(16)}`,
      reviewNotes: notes || 'Dispatched via automated Tron node.',
    };

    setWithdrawals((prev) =>
      prev.map((w) => (w.id === withdrawalId ? approvedWd : w))
    );
    syncDocToFirestore('withdrawals', withdrawalId, approvedWd);

    // Increment user totalWithdrawn
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetWd.userId) {
          const credited = { ...u, totalWithdrawn: u.totalWithdrawn + targetWd.amount };
          syncDocToFirestore('users', u.id, credited);
          return credited;
        }
        return u;
      })
    );

    addNotification(
      targetWd.userId,
      'Withdrawal Dispatched!',
      `Your withdrawal of ${targetWd.netAmount.toFixed(2)} USDT has been verified and sent to your TRC-20 wallet.`,
      'withdrawal'
    );
  };

  // Reject Withdrawal (Admin) -> Refund balance!
  const rejectWithdrawal = (withdrawalId: string, reason: string) => {
    const targetWd = withdrawals.find((w) => w.id === withdrawalId);
    if (!targetWd || targetWd.status !== 'pending') return;

    const rejectedWd: WithdrawalRequest = {
      ...targetWd,
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewNotes: reason || 'Address validation failed or security check flagged.',
    };

    setWithdrawals((prev) =>
      prev.map((w) => (w.id === withdrawalId ? rejectedWd : w))
    );
    syncDocToFirestore('withdrawals', withdrawalId, rejectedWd);

    // Refund funds back to user
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetWd.userId) {
          const refunded = { ...u, balance: u.balance + targetWd.amount };
          syncDocToFirestore('users', u.id, refunded);
          return refunded;
        }
        return u;
      })
    );

    addNotification(
      targetWd.userId,
      'Withdrawal Request Rejected',
      `Your withdrawal of ${targetWd.amount.toFixed(2)} USDT was declined: "${reason}". Full amount has been refunded to your active balance.`,
      'withdrawal'
    );
  };

  // Create Investment
  const createInvestment = (planId: string, amount: number) => {
    if (!currentUser) return { success: false, message: 'Please login to invest in yield plans.' };
    const plan = plans.find((p) => p.id === planId);
    if (!plan || plan.status !== 'active') {
      return { success: false, message: 'Selected plan is currently inactive or unavailable.' };
    }
    if (amount < plan.minDeposit) {
      return { success: false, message: `Minimum investment for ${plan.name} is ${plan.minDeposit} USDT.` };
    }
    if (amount > plan.maxDeposit) {
      return { success: false, message: `Maximum investment limit is ${plan.maxDeposit} USDT.` };
    }
    if (currentUser.balance < amount) {
      return { success: false, message: `Insufficient balance. Available: ${currentUser.balance.toFixed(2)} USDT. Please deposit first.` };
    }

    // Deduct balance
    const updatedUser = { ...currentUser, balance: currentUser.balance - amount };
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );
    syncDocToFirestore('users', currentUser.id, updatedUser);

    const dailyProfit = (amount * plan.dailyRoi) / 100;
    const totalExpectedProfit = dailyProfit * plan.durationDays;

    const newInvestment: UserInvestment = {
      id: `inv_${Date.now()}`,
      userId: currentUser.id,
      planId: plan.id,
      planName: plan.name,
      amountInvested: amount,
      dailyRoi: plan.dailyRoi,
      dailyProfit,
      totalExpectedProfit,
      profitClaimed: 0,
      unclaimedProfit: 0,
      durationDays: plan.durationDays,
      daysElapsed: 0,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + plan.durationDays * 86400000).toISOString(),
      lastAccrualDate: new Date().toISOString(),
      status: 'active',
    };

    setInvestments((prev) => [newInvestment, ...prev]);
    syncDocToFirestore('investments', newInvestment.id, newInvestment);

    addNotification(
      currentUser.id,
      'Investment Activated',
      `Successfully locked ${amount.toFixed(2)} USDT into ${plan.name}. You will generate ${dailyProfit.toFixed(2)} USDT (${plan.dailyRoi}%) daily!`,
      'investment'
    );

    return { success: true };
  };

  // Claim accumulated profit from active investment
  const claimInvestmentProfit = (investmentId: string) => {
    if (!currentUser) return;
    const targetInv = investments.find((i) => i.id === investmentId && i.userId === currentUser.id);
    if (!targetInv || targetInv.unclaimedProfit <= 0) return;

    const claimAmount = targetInv.unclaimedProfit;

    // Credit user's balance and total profit generated
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance + claimAmount,
      totalProfitGenerated: currentUser.totalProfitGenerated + claimAmount,
    };
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );
    syncDocToFirestore('users', currentUser.id, updatedUser);

    // Update investment unclaimed and claimed amounts
    const updatedInv = {
      ...targetInv,
      profitClaimed: targetInv.profitClaimed + claimAmount,
      unclaimedProfit: 0,
    };
    setInvestments((prev) =>
      prev.map((inv) => (inv.id === investmentId ? updatedInv : inv))
    );
    syncDocToFirestore('investments', investmentId, updatedInv);

    addNotification(
      currentUser.id,
      'Profit Collected!',
      `Successfully collected ${claimAmount.toFixed(2)} USDT yield to your active wallet balance.`,
      'investment'
    );
  };

  // Simulate 24H Yield Cycle (accrues 1 day of daily profit for all active investments)
  const simulateYieldCycle = () => {
    let totalAccruedForCurrent = 0;

    setInvestments((prev) =>
      prev.map((inv) => {
        if (inv.status !== 'active') return inv;
        const newDays = inv.daysElapsed + 1;
        const isCompleted = newDays >= inv.durationDays;
        const newUnclaimed = inv.unclaimedProfit + inv.dailyProfit;

        if (currentUser && inv.userId === currentUser.id) {
          totalAccruedForCurrent += inv.dailyProfit;
        }

        const updated = {
          ...inv,
          daysElapsed: newDays,
          unclaimedProfit: newUnclaimed,
          lastAccrualDate: new Date().toISOString(),
          status: isCompleted ? ('completed' as const) : ('active' as const),
        };
        syncDocToFirestore('investments', inv.id, updated);
        return updated;
      })
    );

    if (currentUser && totalAccruedForCurrent > 0) {
      addNotification(
        currentUser.id,
        '24H Yield Accrued',
        `Simulated 24H cycle: ${totalAccruedForCurrent.toFixed(2)} USDT profit generated ready to claim!`,
        'investment'
      );
    }
  };

  // Admin Controls
  const adminUpdateSettings = (newSettings: Partial<PlatformSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    syncDocToFirestore('settings', 'global', updated);
  };

  const adminCreatePlan = (planData: Omit<InvestmentPlan, 'id'>) => {
    const newPlan: InvestmentPlan = {
      ...planData,
      id: `plan_${Date.now()}`,
    };
    setPlans((prev) => [...prev, newPlan]);
    syncDocToFirestore('plans', newPlan.id, newPlan);
  };

  const adminUpdatePlan = (updatedPlan: InvestmentPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    syncDocToFirestore('plans', updatedPlan.id, updatedPlan);
  };

  const adminDeletePlan = (planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  const adminAdjustUserBalance = (userId: string, deltaAmount: number, reason: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newBalance = Math.max(0, u.balance + deltaAmount);
          const updated = { ...u, balance: newBalance };
          syncDocToFirestore('users', userId, updated);
          return updated;
        }
        return u;
      })
    );

    addNotification(
      userId,
      'Admin Balance Adjustment',
      `Your wallet balance was adjusted by ${deltaAmount >= 0 ? '+' : ''}${deltaAmount.toFixed(2)} USDT. Note: ${reason}`,
      'admin'
    );
  };

  const adminToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus: 'active' | 'suspended' = u.status === 'active' ? 'suspended' : 'active';
          const updated = { ...u, status: nextStatus };
          syncDocToFirestore('users', userId, updated);
          return updated;
        }
        return u;
      })
    );
  };

  // Notifications helpers
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id || n.userId === 'all' ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.filter((n) => n.userId !== currentUser.id && n.userId !== 'all')
    );
  };

  const unreadCount = notifications.filter(
    (n) => !n.read && (currentUser ? n.userId === currentUser.id || n.userId === 'all' : false)
  ).length;

  const resetPlatformData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsers(initialUsers);
    setCurrentUser(null);
    setDeposits([]);
    setWithdrawals([]);
    setPlans(initialPlans);
    setInvestments([]);
    setReferrals([]);
    setNotifications(initialNotifications);
    setSettings(initialPlatformSettings);
    setCurrentAdmin(null);
    navigateToRoute('user');
    setActiveTab('overview');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentAdmin,
        users,
        deposits,
        withdrawals,
        plans,
        investments,
        referrals,
        notifications,
        settings,
        activeTab,
        setActiveTab,
        adminTab,
        setAdminTab,
        currentRoute,
        navigateToRoute,
        login,
        signup,
        loginWithGoogleAction,
        logout,
        switchUser,
        updateProfile,
        adminLogin,
        adminLogout,
        submitDeposit,
        approveDeposit,
        rejectDeposit,
        submitWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        createInvestment,
        claimInvestmentProfit,
        simulateYieldCycle,
        adminUpdateSettings,
        adminCreatePlan,
        adminUpdatePlan,
        adminDeletePlan,
        adminAdjustUserBalance,
        adminToggleUserStatus,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        unreadCount,
        resetPlatformData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
