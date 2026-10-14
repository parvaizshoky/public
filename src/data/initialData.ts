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

export const initialPlatformSettings: PlatformSettings = {
  officialTrc20Address: 'TXq8aNm7K5gQ2zR7wX9q8bV4NmJkKpLp6X',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=TXq8aNm7K5gQ2zR7wX9q8bV4NmJkKpLp6X',
  minDeposit: 20,
  minWithdrawal: 15,
  withdrawalFeePercent: 1.5,
  referralTier1Percent: 8,
  referralTier2Percent: 3,
  announcement: 'TronYield TRC-20 Protocol active. Manual admin verification guarantees asset security and audit-grade settlement.',
  supportTelegram: '@TronYieldSupport',
};

// Updated Investment Plans with explicitly calibrated daily earnings (e.g. $30 plan -> Daily Earning $3 Hogi)
export const initialPlans: InvestmentPlan[] = [
  {
    id: 'plan_starter_30',
    name: 'Starter Plan - $30',
    tagline: 'Ideal for newcomers. Daily earning $3.00 Hogi on minimum $30 investment.',
    dailyRoi: 10.0, // 10% of $30 = $3.00 Daily
    durationDays: 15,
    minDeposit: 30,
    maxDeposit: 100,
    principalReturn: true,
    status: 'active',
    badge: 'Daily $3 Hogi',
    colorScheme: 'emerald',
  },
  {
    id: 'plan_growth_50',
    name: 'Growth Plan - $50',
    tagline: 'Balanced duration. Daily earning $5.00 Hogi on minimum $50 investment.',
    dailyRoi: 10.0, // 10% of $50 = $5.00 Daily
    durationDays: 20,
    minDeposit: 50,
    maxDeposit: 250,
    principalReturn: true,
    status: 'active',
    badge: 'Daily $5 Hogi',
    colorScheme: 'cyan',
  },
  {
    id: 'plan_advanced_100',
    name: 'Advanced Staking - $100',
    tagline: 'Accelerated profit tier. Daily earning $12.00 Hogi on minimum $100 investment.',
    dailyRoi: 12.0, // 12% of $100 = $12.00 Daily
    durationDays: 25,
    minDeposit: 100,
    maxDeposit: 500,
    principalReturn: true,
    status: 'active',
    badge: 'Daily $12 Hogi',
    colorScheme: 'purple',
  },
  {
    id: 'plan_elite_300',
    name: 'Elite Yield - $300',
    tagline: 'High liquidity yield pool. Daily earning $45.00 Hogi on minimum $300 investment.',
    dailyRoi: 15.0, // 15% of $300 = $45.00 Daily
    durationDays: 30,
    minDeposit: 300,
    maxDeposit: 1500,
    principalReturn: true,
    status: 'active',
    badge: 'Daily $45 Hogi',
    colorScheme: 'amber',
  },
  {
    id: 'plan_vip_500',
    name: 'VIP Reserve - $500',
    tagline: 'Institutional stakers. Daily earning $90.00 Hogi on minimum $500 investment.',
    dailyRoi: 18.0, // 18% of $500 = $90.00 Daily
    durationDays: 35,
    minDeposit: 500,
    maxDeposit: 5000,
    principalReturn: true,
    status: 'active',
    badge: 'Daily $90 Hogi',
    colorScheme: 'emerald',
  },
  {
    id: 'plan_whale_1000',
    name: 'Whale Apex - $1,000',
    tagline: 'Maximum platform reward rate. Daily earning $200.00 Hogi on minimum $1,000 investment.',
    dailyRoi: 20.0, // 20% of $1,000 = $200.00 Daily
    durationDays: 40,
    minDeposit: 1000,
    maxDeposit: 25000,
    principalReturn: true,
    status: 'active',
    badge: 'Daily $200 Hogi',
    colorScheme: 'purple',
  },
];

// All initial demo funds removed! Fresh zero balances for all accounts.
export const initialUsers: User[] = [
  {
    id: 'admin_root',
    username: 'PlatformAdmin',
    email: 'admin@tronyield.io',
    password: 'admin123',
    role: 'admin',
    trc20Address: 'TXq8aNm7K5gQ2zR7wX9q8bV4NmJkKpLp6X',
    balance: 0.0, // 0 Demo funds
    totalDeposited: 0.0,
    totalWithdrawn: 0.0,
    totalProfitGenerated: 0.0,
    referralCode: 'TY-ADMIN99',
    referralCount: 0,
    referralEarnings: 0.0,
    status: 'active',
    createdAt: '2026-08-15T00:00:00.000Z',
  },
];

// Zero demo deposits - clean state
export const initialDeposits: DepositTransaction[] = [];

// Zero demo withdrawals - clean state
export const initialWithdrawals: WithdrawalRequest[] = [];

// Zero demo investments - clean state
export const initialInvestments: UserInvestment[] = [];

// Zero demo referrals - clean state
export const initialReferrals: ReferralRecord[] = [];

export const initialNotifications: PlatformNotification[] = [
  {
    id: 'notif_welcome',
    userId: 'all',
    title: 'TronYield TRC-20 Protocol Active',
    message: 'Welcome to TronYield. Deposit USDT (TRC-20) to activate staking plans and earn guaranteed daily yield.',
    type: 'admin',
    read: false,
    createdAt: new Date().toISOString(),
  },
];
