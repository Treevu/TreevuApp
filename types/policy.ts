import { Expense } from './expense';

export interface PolicyViolation {
  policyId: string;
  policyName: string;
  message: string;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  check: (expense: Expense) => PolicyViolation | null;
}
