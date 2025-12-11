
export interface UserProfile {
  name: string;
  role: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED'; // RBAC Status
  fwiScore: number;
  treePoints: number;
  streakDays: number;
  level: number;
  monthlyIncome: number;
  availableEwa: number; // The calculated limit based on days worked
}

export type EwaStatus = 'pending_approval' | 'processing_transfer' | 'disbursed' | 'rejected';

export interface EwaRequest {
  id: string;
  amount: number;
  date: string;
  status: EwaStatus;
  fee: number;
  estimatedArrival: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  isDiscretionary: boolean;
  aiConfidence?: number;
}

export interface ExpenseAnalysis {
  merchant: string;
  amount: number;
  category: string;
  isDiscretionary: boolean;
  confidence: number;
  dateContext?: 'today' | 'yesterday' | 'past';
  // New Operational Hub Fields
  budgetImpact?: {
    categoryLimit: number;
    remainingAfter: number;
    percentUsed: number; // 0-100
    status: 'safe' | 'warning' | 'critical';
  };
  suggestedAction?: {
    type: 'save' | 'offer';
    title: string;
    description: string;
    actionId: string; // Links to MarketOffer ID or Goal ID
  };
}

export interface MarketOffer {
  id: string;
  title: string;
  description: string;
  costPoints: number;
  category: 'Financial' | 'Lifestyle' | 'Emergency' | 'Investment';
  targetFwiSegment: 'low' | 'mid' | 'high' | 'all';
  discountValue?: string;
  origin: 'corporate' | 'global';
  imageUrl?: string; // Visual enrichment
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'Emergency' | 'Vacation' | 'Purchase' | 'Investment';
  priority: boolean;
  lastContribution?: number; // timestamp
  imageUrl?: string; // Visual enrichment
}

export interface B2BMetric {
  metric: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  delta: string;
}

export interface EmployeeRisk {
  id: string;
  name: string;
  department: string;
  fwiScore: number;
  absenteeismRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  ewaFrequency: number;
  workModality: 'Remote' | 'Hybrid' | 'On-site';
  age: number;
  tenure: number; // Years in company (Antigüedad)
  turnoverPropensity?: number; // DaaS: IPR (0-100)
}

export interface RiskCluster {
  department: string;
  count: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  projectedLoss: number;
  avgIpr: number; // Average Turnover Propensity
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export interface AiAdviceCard {
  id: string;
  type: 'risk' | 'opportunity' | 'insight';
  title: string;
  description: string;
  actionLabel: string;
  icon?: string;
}

export enum ViewMode {
  EMPLOYEE = 'EMPLOYEE',
  B2B_ADMIN = 'B2B_ADMIN',
  MERCHANT = 'MERCHANT',
}

export enum MerchantRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export interface MerchantProfile {
  id: string;
  name: string;
  level: 'Gold' | 'Silver' | 'Bronze';
  role: MerchantRole;
}

export interface MerchantTPStats {
  balance: number;
  totalPurchased: number;
  totalDistributed: number;
  attributedSales: number;
  roi: number;
}

// TreePoints Module Types
export interface TreePointStats {
  totalIssued: number;
  redemptionRate: number; // Percentage
  fwiImpact: number; // Delta points
  budgetUtilization: number; // Percentage
}

export interface TreePointHeatmap {
  department: string;
  pointsIssued: number;
  redemptionRate: number;
  avgFwi: number;
  impactLabel: 'High' | 'Medium' | 'Low';
}

export interface TreePointIssuance {
  targetType: 'Individual' | 'Department' | 'All';
  targetId: string;
  amount: number;
  reason: string;
}

// --- BACKEND HANDOFF CONTRACTS (DTOs) ---

export interface UserSyncResponse {
  success: boolean;
  userProfile: UserProfile;
  alerts: AppAlert[]; 
  updatedTransactions?: Transaction[]; 
}

export interface AppAlert {
  id: string;
  type: 'liquidity_warning' | 'fwi_drop' | 'achievement' | 'policy_rejection';
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface MoatEventPayload {
  event_name: string;
  timestamp: number;
  user_id_hash?: string;
  fwi_score_context?: number;
  metadata: Record<string, any>;
}