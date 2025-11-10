export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    icon: string; // Emoji
    createdAt: string; // ISO Date string
}
