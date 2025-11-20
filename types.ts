

export enum UserRole {
  GUEST = 'GUEST',
  EMPLOYEE = 'EMPLOYEE', // B2C
  EMPLOYER = 'EMPLOYER', // B2B
  MERCHANT = 'MERCHANT'  // B2B2C
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ALL_TRANSACTIONS = 'ALL_TRANSACTIONS',
  GOAL_DETAILS = 'GOAL_DETAILS',
  // New Views
  PROFILE_DETAILS = 'PROFILE_DETAILS',
  SECURITY = 'SECURITY',
  SETTINGS = 'SETTINGS',
  HELP = 'HELP'
}

export enum AppTheme {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system'
}

export enum ExpenseCategory {
  FOOD = 'Alimentación',
  TRANSPORT = 'Transporte',
  UTILITIES = 'Servicios',
  EDUCATION = 'Educación',
  ENTERTAINMENT = 'Entretenimiento',
  HEALTH = 'Salud',
  SHOPPING = 'Compras',
  OTHER = 'Otros'
}

export interface Expense {
  id: string;
  merchant: string;
  ruc?: string; // New: SUNAT Tax ID
  amount: number;
  date: string;
  category: ExpenseCategory;
  isFormal: boolean; // Determines IGV vs LostSavings
  igv?: number;
  lostSavings?: number;
  treevusEarned: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  image: string; 
  color: string; 
}

export enum OfferType {
  GLOBAL = 'GLOBAL',   // Offers from the general marketplace
  COMPANY = 'COMPANY'  // Exclusive rewards from the Employer (B2B)
}

export interface Offer {
  id: string;
  title: string;
  description: string; 
  merchantName: string;
  image: string; 
  discount: number; 
  costTreevus: number;
  redemptions: number;
  revenueGenerated: number; 
  isFlash?: boolean; // New: Flash Offer logic
  isCashback?: boolean; // New: Cashback/Monetary reward highlight
  expiresAt?: string; // New: Expiration timestamp
  type: OfferType; // New: Global vs Company
  // Analytics fields
  impressions?: number;
  clicks?: number;
}

export enum TreevuLevel {
  BROTE = 'Brote',
  PLANTON = 'Plantón',
  ARBUSTO = 'Arbusto',
  ROBLE = 'Roble',
  BOSQUE = 'Bosque'
}

// --- PRICING & SUBSCRIPTION TYPES ---

export enum SubscriptionTier {
  FREE = 'FREE',       // Starter (B2C), Connect (Merchant)
  PLUS = 'PLUS',       // Launch (B2B)
  PRO = 'PRO',         // Explorer (B2C), Growth (B2B), Amplify (Merchant)
  ENTERPRISE = 'ENTERPRISE' // Enterprise (B2B)
}

export interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PlanConfig {
  id: SubscriptionTier;
  name: string;
  priceMonthly: number; // Price in USD
  priceAnnual: number;  // Price in USD (Total for year or equivalent)
  priceUnit?: string;   // e.g., "/ usuario"
  slogan: string;
  features: PlanFeature[];
  recommended?: boolean;
  ctaText: string;
  isCustom?: boolean;   // For Enterprise
}

export interface UserProfile {
  name: string;
  email?: string; // Added
  bio?: string; // Added
  role: UserRole;
  avatarUrl: string;
  treevus: number;
  level: TreevuLevel;
  fwiScore: number; 
  monthlyBudget: number;
  squadId?: string;
  subscriptionTier: SubscriptionTier; // Track current plan
  lastPulseCheck?: string; // Date string of last mood check
  theme: AppTheme;
  // Settings
  notifications?: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy?: {
    publicProfile: boolean;
    shareStats: boolean;
  };
  // FWI Breakdown
  fwiBreakdown?: {
    formalScore: number;
    balanceScore: number;
    devScore: number;
  };
  // Streaks
  currentStreak?: number;
  lastActivityDate?: string;
}

export enum Department {
  GLOBAL = 'Global',
  SALES = 'Ventas',
  IT = 'Tecnología',
  HR = 'Recursos Humanos',
  OPERATIONS = 'Operaciones',
  MARKETING = 'Marketing'
}

export interface CompanyKPIs {
  avgFWI: number;
  flightRiskScore: number; 
  roiMultiplier: number;
  retentionSavings: number; 
  projectedENPS: number; 
  spendingIntent: { essential: number; desired: number };
  teamMoodScore: number; // 0-100 derived from Pulse
  // History & Trends
  trend?: {
    avgFWI: number;
    flightRiskScore: number;
    retentionSavings: number;
  };
  history?: {
    avgFWI: number[];
    flightRiskScore: number[];
    retentionSavings: number[];
    moodHistory?: number[]; // New for pulse check visualization
  };
  // Adoption Analytics
  adoption?: {
    active: number;
    sporadic: number;
    inactive: number;
  };
  kudosDelta?: number;
}

// --- New Social & Strategic Types ---

export enum MissionType {
  FISCAL = 'FISCAL', // e.g. Get formal receipts
  SOCIAL = 'SOCIAL', // e.g. Send kudos
  HABIT = 'HABIT'    // e.g. Log daily
}

export enum MissionStatus {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  COMPLETED = 'COMPLETED'
}

export interface Mission {
  id: string;
  title: string;
  description: string; 
  type: MissionType;
  status: MissionStatus;
  progress: number;
  target: number;
  rewardTreevus: number;
  icon?: string; // Emoji or icon name
}

export interface Squad {
  id: string;
  name: string;
  avatarUrl: string;
  totalTreevus: number;
  rank: number;
  members: { name: string; avatar: string, isMvp?: boolean }[];
  missions: Mission[]; // Replaces simple string fields
}

export interface Kudo {
  id: string;
  fromUser: string;
  toUser: string;
  message: string;
  timestamp: string;
  type: 'TEAMWORK' | 'INNOVATION' | 'HELP';
}

export interface SimulationResult {
  predictedFWI: number;
  predictedRetentionSavings: number;
  aiAnalysis: string;
}

// AI Types
export interface ReceiptScanResult {
  total: number;
  merchant: string;
  ruc?: string; // New field
  date: string;
  category: string;
  isFormal: boolean;
  isAutoCategorized?: boolean; // Logic: Was category inferred from memory?
  processingTimeMs?: number; // Telemetry for Free Plan analytics
}

// CSV Import Types
export interface ColumnMapping {
  dateIndex: number;
  merchantIndex: number;
  amountIndex: number;
}

export interface CsvRowRaw {
  data: string[];
  originalIndex: number;
}

export interface BulkCategoryGroup {
  merchantName: string;
  count: number;
  totalAmount: number;
  assignedCategory: ExpenseCategory;
  exampleRowIndex: number;
}

// Notification System
export interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

// --- API CONTRACT TYPES (B2C) ---

export enum SafeToSpendGranularity {
  DAILY = 'daily',
  WEEKLY = 'weekly'
  // biweekly could be added later
}

export interface DashboardSummaryResponse {
  user_name: string;
  safe_to_spend: {
    granularity: SafeToSpendGranularity;
    amount: number;
    currency: string;
    period_remaining_days: number;
    last_5_days_trend: number[];
  };
  fwi_score: number;
  fwi_breakdown: {
    health: number;
    balance: number;
    development: number;
  };
  ai_coach_message: string;
}

export interface ProjectionFocusResponse {
  focus_projection: {
    selected_categories: string[];
    spent_month_to_date: number;
    budgeted_for_group: number; // Estimated based on typical spend or 50/30/20 rule
    projected_end_of_month: number;
    status: 'OK' | 'WARNING' | 'EXCEEDING_RISK';
    projection_chart_data: { day: number; value: number }[];
  }
}

// --- MERCHANT SPECIFIC TYPES ---

export interface MerchantActivityLog {
  id: string;
  action: 'REDEMPTION' | 'VIEW' | 'REVIEW';
  userInitial: string;
  detail: string;
  timeAgo: string;
  value?: number;
}

export interface HourlyTrafficData {
  hour: string;
  volume: number; // 0-100
  isPeak: boolean;
}

// --- AI CONVERSATIONAL API CONTRACT ---

export interface AIActionPayload {
  [key: string]: any;
}

export interface AIAction {
  action_type: 'VIEW_CATEGORY_DETAILS' | 'CONFIRM_TRANSFER' | 'CREATE_GOAL' | 'NONE';
  action_label: string;
  action_payload: AIActionPayload;
}

export interface AIQueryResponse {
  ai_response_id: string;
  response_text: string;
  data_context?: {
    query_type: string;
    [key: string]: any;
  };
  suggested_action?: AIAction;
}