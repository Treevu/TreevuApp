export interface TribeMember {
    id: string;
    name: string;
    avatarInitial: string;
    kudosReceived: number;
}

export type MissionMetric = 'formalExpenseCount' | 'kudosSentCount' | 'lessonsCompletedCount';

export interface Mission {
    id: string;
    title: string;
    description: string;
    metric: MissionMetric;
    target: number;
    reward: number; // Treevus reward for the whole team
    icon: string;
    valueForEmployee: string;
    valueForCompany: string;
}

export interface Tribe {
    id: string;
    name: string;
    icon: string;
    members: TribeMember[];
    collectiveKudos: number;
    activeMissionId?: string;
    missionProgress?: number;
    goal?: {
        title: string;
        target: number;
        reward: string;
    };
}