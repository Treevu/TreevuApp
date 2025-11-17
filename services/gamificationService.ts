import { TreevuLevel } from '../types/common';
// FIX: Re-export BadgeType to make it available to other modules importing from gamificationService.
import { User, BadgeType } from '../types/user';
import { Expense } from '../types/expense';
import { RocketLaunchIcon, TrophyIcon, FireIcon, HandThumbUpIcon } from '../components/Icons';
import React from 'react';

export type { BadgeType } from '../types/user';

export interface LevelInfo {
    level: TreevuLevel;
    name: string;
    icon: string;
    description: string;
    nextLevel: TreevuLevel | null;
    goals: Partial<Record<keyof User['progress'], number>>;
    requirements: string[];
    benefits: string[];
}

export interface Badge {
    icon: React.FC<{className?: string}>;
    title: string;
    description: string;
    isUnlocked: (user: User) => boolean;
}

export const badgeData: Record<BadgeType, Badge> = {
    pioneer: {
        icon: RocketLaunchIcon,
        title: "Pionero Fundador",
        description: "Por ser uno de los primeros en unirte a la expedición de treevü. ¡Gracias por tu confianza!",
        isUnlocked: (user) => true // Unlocked for all demo users
    },
    level: {
        icon: TrophyIcon,
        title: "Maestro del Bosque",
        description: "Has alcanzado el nivel máximo de maestría financiera. Tu sabiduría es legendaria.",
        isUnlocked: (user) => user.level >= TreevuLevel.Bosque
    },
    streak: {
        icon: FireIcon,
        title: "Corazón de Fuego",
        description: "¡Imparable! Has mantenido una racha de registros de 7 días o más.",
        isUnlocked: (user) => (user.streak?.count || 0) >= 7
    },
    kudos: {
        icon: HandThumbUpIcon,
        title: "Corazón Generoso",
        description: "Has reconocido el esfuerzo de tus compañeros de equipo al menos 10 veces. ¡Un verdadero pilar de la comunidad!",
        isUnlocked: (user) => user.kudosSent >= 10
    },
};

export const levelData: Record<TreevuLevel, LevelInfo> = {
    [TreevuLevel.Brote]: {
        level: TreevuLevel.Brote,
        name: "Brote Novato",
        icon: "🌱",
        description: "El primer paso en tu senda. ¡Sigue registrando para crecer!",
        nextLevel: TreevuLevel.Plantón,
        goals: { expensesCount: 5 },
        requirements: ["Registra 5 hallazgos"],
        benefits: ["Acceso a registro de gastos", "Gana Treevüs con cada acción"]
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
        requirements: ["Registra 15 hallazgos", "Alcanza 60% de formalidad"],
        benefits: ["Análisis de gastos por categoría", "Bonificación de +50 Treevüs"]
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
        requirements: ["Registra 40 hallazgos", "Alcanza 75% de formalidad"],
        benefits: ["Activa la herramienta 'Devolución de Impuestos'", "Bonificación de +100 Treevüs"]
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
        requirements: ["Registra 100 hallazgos", "Alcanza 90% de formalidad"],
        benefits: ["Recompensas exclusivas en la Tienda", "Bonificación de +200 Treevüs"]
    },
    [TreevuLevel.Bosque]: {
        level: TreevuLevel.Bosque,
        name: "Bosque Ancestral",
        icon: "🏞️",
        description: "¡Maestría alcanzada! Eres un guardián de la salud financiera.",
        nextLevel: null,
        goals: {},
        requirements: ["Has completado la senda"],
        benefits: ["Desbloquea el modo 'Forjar Leyenda'", "Multiplicador de Treevüs permanente"]
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