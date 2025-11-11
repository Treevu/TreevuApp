import { TreevuLevel } from './common';
import { Department, Tenure, Modality, AgeRange } from './employer';

export interface RedeemedReward {
    rewardId: string;
    title: string;
    icon: string;
    date: string; // ISO string of redemption date
    costInTreevus: number;
    description: string;
}

export interface Reward {
    id: string;
    title: string;
    description: string;
    costInTreevus: number;
    icon: string; // Could be an emoji or an icon name
    category: 'Bienestar' | 'Educación' | 'Ocio' | 'Impacto Social';
    minLevel?: TreevuLevel;
}

export type BadgeType = 'pioneer' | 'level' | 'streak' | 'kudos';

export interface User {
    id: string;
    name: string;
    email: string;
    picture: string;
    documentId?: string;
    level: TreevuLevel;
    progress: {
        expensesCount: number;
        formalityIndex: number; // Based on amount
    };
    treevus: number;
    isProfileComplete: boolean;
    redeemedRewards?: RedeemedReward[];
    streak?: {
        count: number;
        lastDate: string; // YYYY-MM-DD
    };
    department?: Department;
    tenure?: Tenure;
    modality?: Modality;
    ageRange?: AgeRange;
    tribeId?: string;
    kudosSent: number;
    kudosReceived: number;
    featuredBadge?: BadgeType;
    role?: string;
    company?: string;
    prestigeLevel?: number;
    completedLessons?: string[];
    // --- NEW FIELDS FOR ML ---
    registrationDate: string; // ISO Date string
    lastActivityDate: string; // ISO Date string
    rewardsClaimedCount: number;
    engagementScore: number; // Derived: 0-100
    fwiTrend: 'improving' | 'stable' | 'declining'; // Derived
}
