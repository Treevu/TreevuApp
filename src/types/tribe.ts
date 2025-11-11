export interface TribeMember {
    id: string;
    name: string;
    avatarInitial: string;
    kudosReceived: number;
}

export type MissionMetric = 'formalExpenseCount' | 'kudosSentCount';

export interface Mission {
    id: string;
    title: string;
    description: string;
    metric: MissionMetric;
    target: number;
    reward: number; // Treevus reward for the whole team
    icon: string;
}

export interface Tribe {
    id: string;
    name: string;
    icon: string;
    members: TribeMember[];
    collectiveKudos: number;
    activeMissionId?: string;
    missionProgress?: number;
}
