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
  announcement: 'Online Earning Protocol Active · Earn money from home with secure USDT TRC-20 staking contracts.',
  supportTelegram: '@TronYieldSupport',
};

// Professional Investment Plans with Guaranteed Daily Income
export const initialPlans: InvestmentPlan[] = [
  {
    id: 'plan_starter_30',
    name: 'Starter Plan - $30',
    tagline: 'Ideal for beginners earning money from home. Earn $3.00 daily income with a $30 investment.',
    dailyRoi: 10.0, // 10% of $30 = $3.00 Daily
    durationDays: 15,
    minDeposit: 30,
    maxDeposit: 100,
    principalReturn: true,
    status: 'active',
    badge: 'Earn $3.00 / Day',
    colorScheme: 'emerald',
  },
  {
    id: 'plan_growth_50',
    name: 'Growth Plan - $50',
    tagline: 'Balanced online earning contract. Earn $5.00 daily income with a $50 investment.',
    dailyRoi: 10.0, // 10% of $50 = $5.00 Daily
    durationDays: 20,
    minDeposit: 50,
    maxDeposit: 250,
    principalReturn: true,
    status: 'active',
    badge: 'Earn $5.00 / Day',
    colorScheme: 'cyan',
  },
  {
    id: 'plan_advanced_100',
    name: 'Advanced Staking - $100',
    tagline: 'Accelerated home earning tier. Earn $12.00 daily income with a $100 investment.',
    dailyRoi: 12.0, // 12% of $100 = $12.00 Daily
    durationDays: 25,
    minDeposit: 100,
    maxDeposit: 500,
    principalReturn: true,
    status: 'active',
    badge: 'Earn $12.00 / Day',
    colorScheme: 'purple',
  },
  {
    id: 'plan_elite_300',
    name: 'Elite Yield - $300',
    tagline: 'High liquidity online wealth generation. Earn $45.00 daily income with a $300 investment.',
    dailyRoi: 15.0, // 15% of $300 = $45.00 Daily
    durationDays: 30,
    minDeposit: 300,
    maxDeposit: 1500,
    principalReturn: true,
    status: 'active',
    badge: 'Earn $45.00 / Day',
    colorScheme: 'amber',
  },
  {
    id: 'plan_vip_500',
    name: 'VIP Reserve - $500',
    tagline: 'Executive home investor staking. Earn $90.00 daily income with a $500 investment.',
    dailyRoi: 18.0, // 18% of $500 = $90.00 Daily
    durationDays: 35,
    minDeposit: 500,
    maxDeposit: 5000,
    principalReturn: true,
    status: 'active',
    badge: 'Earn $90.00 / Day',
    colorScheme: 'emerald',
  },
  {
    id: 'plan_whale_1000',
    name: 'Whale Apex - $1,000',
    tagline: 'Maximum platform reward rate. Earn $200.00 daily income with a $1,000 investment.',
    dailyRoi: 20.0, // 20% of $1,000 = $200.00 Daily
    durationDays: 40,
    minDeposit: 1000,
    maxDeposit: 25000,
    principalReturn: true,
    status: 'active',
    badge: 'Earn $200.00 / Day',
    colorScheme: 'purple',
  },
];

// All initial demo funds removed - fresh zero balances
export const initialUsers: User[] = [
  {
    id: 'admin_root',
    username: 'PlatformAdmin',
    email: 'admin@tronyield.io',
    password: 'admin123',
    role: 'admin',
    trc20Address: 'TXq8aNm7K5gQ2zR7wX9q8bV4NmJkKpLp6X',
    balance: 0.0,
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

export const initialDeposits: DepositTransaction[] = [];
export const initialWithdrawals: WithdrawalRequest[] = [];
export const initialInvestments: UserInvestment[] = [];
export const initialReferrals: ReferralRecord[] = [];

export const initialNotifications: PlatformNotification[] = [
  {
    id: 'notif_welcome',
    userId: 'all',
    title: 'Welcome to Online Earning with TronYield',
    message: 'Start earning money from your home today! Deposit USDT (TRC-20) and activate an automated daily yield plan.',
    type: 'admin',
    read: false,
    createdAt: new Date().toISOString(),
  },
];
