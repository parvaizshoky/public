export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  trc20Address: string;
  balance: number; // In USDT / USD
  totalDeposited: number;
  totalWithdrawn: number;
  totalProfitGenerated: number;
  referralCode: string;
  referredBy?: string | null;
  referralCount: number;
  referralEarnings: number;
  status: 'active' | 'suspended';
  createdAt: string;
}

export type DepositStatus = 'pending' | 'approved' | 'rejected';

export interface DepositTransaction {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  amount: number;
  network: 'TRC20';
  receivingAddress: string;
  txHash: string;
  proofNote?: string;
  status: DepositStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  amount: number;
  fee: number;
  netAmount: number;
  payoutAddress: string;
  status: WithdrawalStatus;
  createdAt: string;
  reviewedAt?: string;
  txHash?: string;
  reviewNotes?: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  tagline: string;
  dailyRoi: number; // e.g., 2.5 for 2.5%
  durationDays: number; // e.g., 7 days
  minDeposit: number; // in USDT
  maxDeposit: number;
  principalReturn: boolean;
  status: 'active' | 'inactive';
  badge?: string;
  colorScheme: 'emerald' | 'cyan' | 'amber' | 'purple';
  websiteUrl?: string; // External website link for the plan
}

export interface UserInvestment {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amountInvested: number;
  dailyRoi: number;
  dailyProfit: number;
  totalExpectedProfit: number;
  profitClaimed: number;
  unclaimedProfit: number;
  durationDays: number;
  daysElapsed: number;
  startDate: string;
  endDate: string;
  lastAccrualDate: string;
  status: 'active' | 'completed';
}

export interface ReferralRecord {
  id: string;
  inviterId: string;
  referredUserId: string;
  referredUsername: string;
  referredEmail: string;
  joinedAt: string;
  totalDeposited: number;
  commissionEarned: number;
  tier: 1 | 2;
}

export interface DailyTask {
  id: string;
  userId: string;
  investmentId: string;
  planName: string;
  question: string;
  options: number[];
  correctAnswer: number;
  rewardAmount: number;
  completed: boolean;
  completedAt?: string;
  dayIndex: number;
}

export type NotificationType = 'deposit' | 'withdrawal' | 'investment' | 'referral' | 'admin' | 'info' | 'task';

export interface PlatformNotification {
  id: string;
  userId: string; // user specific or 'all'
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export interface PlatformSettings {
  officialTrc20Address: string;
  qrCodeUrl: string;
  minDeposit: number;
  minWithdrawal: number;
  withdrawalFeePercent: number;
  referralTier1Percent: number; // e.g. 8%
  referralTier2Percent: number; // e.g. 3%
  announcement: string;
  supportTelegram: string;
}
