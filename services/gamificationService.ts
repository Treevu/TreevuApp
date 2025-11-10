import { TreevuLevel } from '../types/common';
import { User } from '../types/user';
import { Expense } from '../types/expense';

export interface LevelInfo {
    level: TreevuLevel;
    name: string;
    icon: string;
    description: string;
    nextLevel: TreevuLevel | null;
    goals: Partial<Record<keyof User['progress'], number>>;
    requirements: string[];
}

export const levelData: Record<TreevuLevel, LevelInfo> = {
    [TreevuLevel.Brote]: {
        level: TreevuLevel.Brote,
        name: "Brote Novato",
        icon: "🌱",
        description: "El primer paso en tu senda. ¡Sigue registrando para crecer!",
        nextLevel: TreevuLevel.Plantón,
        goals: { expensesCount: 5 },
        requirements: ["Registra 5 gastos"]
    },
    [TreevuLevel.Plantón]: {
        level: TreevuLevel.Plantón,
        name: "Plantón Aspirante",
        icon: "🌳",
        description: "Tu árbol financiero empieza a tomar forma.",
        nextLevel: TreevuLevel.Arbusto,
        goals: {
            expensesCount: 15,
            formalityIndex: 60,
        },
        requirements: ["Registra 15 gastos", "Alcanza 60% de formalidad"]
    },
    [TreevuLevel.Arbusto]: {
        level: TreevuLevel.Arbusto,
        name: "Arbusto Consciente",
        icon: "🌿",
        description: "Demuestras constancia y un buen ojo para la formalidad.",
        nextLevel: TreevuLevel.Roble,
        goals: {
            expensesCount: 40,
            formalityIndex: 75,
        },
        requirements: ["Registra 40 gastos", "Alcanza 75% de formalidad"]
    },
    [TreevuLevel.Roble]: {
        level: TreevuLevel.Roble,
        name: "Roble Formal",
        icon: "🌲",
        description: "Tus finanzas son fuertes y están bien arraigadas.",
        nextLevel: TreevuLevel.Bosque,
        goals: {
            expensesCount: 100,
            formalityIndex: 90,
        },
        requirements: ["Registra 100 gastos", "Alcanza 90% de formalidad"]
    },
    [TreevuLevel.Bosque]: {
        level: TreevuLevel.Bosque,
        name: "Bosque Ancestral",
        icon: "🏞️",
        description: "¡Maestría alcanzada! Eres un guardián de la salud financiera.",
        nextLevel: null,
        goals: {},
        requirements: ["Has completado la senda"]
    }
};

// --- B2B2C Treevu Logic ---

type ActionType = 'add_expense' | 'level_up' | 'read_article' | 'complete_lesson';
type ActionPayload = {
    expense?: Expense;
    level?: TreevuLevel;
};

const TREEVU_REWARDS = {
    ADD_INFORMAL_EXPENSE: 1,
    LEVEL_UP_BONUS: 100,
    READ_ARTICLE: 20, // Deprecated, use complete_lesson
    COMPLETE_LESSON: 20,
    FORMAL_EXPENSE_REWARD_MIN: 8,
    FORMAL_EXPENSE_REWARD_MAX: 12,
};

export const STREAK_BONUS_CONFIG = {
    MULTIPLIER: 2,
    MAX_BONUS: 10,
    MIN_STREAK_FOR_BONUS: 2,
};


/**
 * Calculates the number of "treevus" earned for a specific user action.
 * This is the core of the Betterfly-like B2B2C model.
 * @param actionType The type of action performed by the user.
 * @param payload Additional data related to the action.
 * @returns The number of treevus earned.
 */
export const calculateTreevusForAction = (actionType: ActionType, payload: ActionPayload = {}): number => {
    switch (actionType) {
        case 'add_expense':
            if (payload.expense) {
                if (payload.expense.esFormal) {
                    const { FORMAL_EXPENSE_REWARD_MIN, FORMAL_EXPENSE_REWARD_MAX } = TREEVU_REWARDS;
                    return Math.floor(Math.random() * (FORMAL_EXPENSE_REWARD_MAX - FORMAL_EXPENSE_REWARD_MIN + 1)) + FORMAL_EXPENSE_REWARD_MIN;
                }
                return TREEVU_REWARDS.ADD_INFORMAL_EXPENSE;
            }
            return 0;
        
        case 'level_up':
            // A bonus for reaching a new level of financial mastery.
            return TREEVU_REWARDS.LEVEL_UP_BONUS;

        case 'read_article': // Kept for backward compatibility, but new logic uses complete_lesson
        case 'complete_lesson':
            // Reward for engaging with educational content.
            return TREEVU_REWARDS.COMPLETE_LESSON;

        default:
            return 0;
    }
};