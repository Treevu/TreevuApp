
import { TreevuLevel } from "../types";

// Level Thresholds
const LEVEL_THRESHOLDS = {
  [TreevuLevel.BROTE]: 0,
  [TreevuLevel.PLANTON]: 500,
  [TreevuLevel.ARBUSTO]: 1500,
  [TreevuLevel.ROBLE]: 3000,
  [TreevuLevel.BOSQUE]: 6000
};

export const calculateLevel = (currentPoints: number): TreevuLevel => {
  if (currentPoints >= LEVEL_THRESHOLDS[TreevuLevel.BOSQUE]) return TreevuLevel.BOSQUE;
  if (currentPoints >= LEVEL_THRESHOLDS[TreevuLevel.ROBLE]) return TreevuLevel.ROBLE;
  if (currentPoints >= LEVEL_THRESHOLDS[TreevuLevel.ARBUSTO]) return TreevuLevel.ARBUSTO;
  if (currentPoints >= LEVEL_THRESHOLDS[TreevuLevel.PLANTON]) return TreevuLevel.PLANTON;
  return TreevuLevel.BROTE;
};

export const getNextLevelThreshold = (currentLevel: TreevuLevel): number => {
  switch (currentLevel) {
    case TreevuLevel.BROTE: return LEVEL_THRESHOLDS[TreevuLevel.PLANTON];
    case TreevuLevel.PLANTON: return LEVEL_THRESHOLDS[TreevuLevel.ARBUSTO];
    case TreevuLevel.ARBUSTO: return LEVEL_THRESHOLDS[TreevuLevel.ROBLE];
    case TreevuLevel.ROBLE: return LEVEL_THRESHOLDS[TreevuLevel.BOSQUE];
    case TreevuLevel.BOSQUE: return LEVEL_THRESHOLDS[TreevuLevel.BOSQUE] * 1.5; // Arbitrary cap extension
  }
};

export const getLevelProgressPercentage = (currentPoints: number, currentLevel: TreevuLevel): number => {
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
  const nextThreshold = getNextLevelThreshold(currentLevel);
  
  if (currentLevel === TreevuLevel.BOSQUE) return 100; // Max level

  const range = nextThreshold - currentThreshold;
  const pointsInLevel = currentPoints - currentThreshold;
  
  return Math.min(100, Math.max(0, (pointsInLevel / range) * 100));
};

export const calculateStreak = (lastActivityDateStr?: string, currentStreak: number = 0): number => {
  if (!lastActivityDateStr) return 1;

  const today = new Date();
  const last = new Date(lastActivityDateStr);
  
  // Normalize to midnight for date comparison
  today.setHours(0,0,0,0);
  last.setHours(0,0,0,0);

  const diffTime = Math.abs(today.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Activity already recorded today, keep streak
    return currentStreak; 
  } else if (diffDays === 1) {
    // Consecutive day
    return currentStreak + 1;
  } else {
    // Broken streak
    return 1;
  }
};

export const calculateExpensePoints = (isFormal: boolean, amount: number): number => {
  // Base points for logging
  let points = 10; 
  
  // Formal bonus (Incentive)
  if (isFormal) {
    points += 25; // Increased reward for formal to drive behavior
  }
  
  return points;
};
