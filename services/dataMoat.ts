
import { MoatEventPayload } from "../types";

/**
 * DATA MOAT SERVICE
 * 
 * Centralized logging for the "Ground Truth" dataset.
 * This service acts as the interface for the Backend Analytics Ingestion.
 * 
 * In production, this would dispatch events to a queue (e.g., Segment, Kinesis).
 */

export const logCriticalEvent = (eventName: string, metadata: any, userContext?: { fwiScore: number }) => {
  const payload: MoatEventPayload = {
    event_name: eventName,
    timestamp: Date.now(),
    fwi_score_context: userContext?.fwiScore,
    metadata: metadata
  };

  // 1. Console Log for Dev Debugging (Standardized Prefix)
  console.log(`[DATA MOAT] ${eventName}`, payload);

  // 2. (TODO: Backend Handoff) Dispatch to API
  // navigator.sendBeacon('/api/v1/telemetry/log', JSON.stringify(payload));
};

export const MOAT_EVENTS = {
  // APP VIEW
  DASHBOARD_VIEW: 'DASHBOARD_VIEW_FREQUENCY',
  EXPENSE_DECLARED: 'EXPENSE_DECLARED',
  EXPENSE_INTENT: 'EXPENSE_TAB_ACTIVE_INTENT',
  MARKET_VIEW: 'MARKET_VIEW_FREQUENCY',
  GOAL_CONTRIBUTION: 'GOAL_CONTRIBUTION',
  
  // INTERVENTIONS & ALERTS
  ALERT_TRIGGERED: 'ALERT_TRIGGERED',
  NUDGE_COMMITMENT: 'BEHAVIOR_CHANGE_COMMITTED',
  STRESS_DECLARED: 'GROUND_TRUTH_CAPTURED',
  
  // EWA (RISK SIGNALS)
  EWA_INITIATED: 'EWA_REQUEST_INITIATED',
  EWA_POLICY_CHECK: 'B2B_POLICY_RESULT',
  
  // B2B VIEW
  INTERVENTION_LOGGED: 'INTERVENTION_LOGGED'
};