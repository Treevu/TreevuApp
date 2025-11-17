import { CategoriaGasto, TipoComprobante } from './common';
import { PolicyViolation } from './policy';

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'yape/plin' | 'otro';

export interface Expense {
    id: string;
    razonSocial: string;
    ruc: string;
    fecha: string;
    total: number;
    categoria: CategoriaGasto;
    tipoComprobante: TipoComprobante;
    imageUrl?: string;
    esFormal: boolean;
    ahorroPerdido: number;
    igv: number;
    isCorporate?: boolean;
    isProductScan?: boolean;
    mensaje?: string;
    intent?: 'essential' | 'desired' | 'unclassified';
    violations?: PolicyViolation[];
    isMissionContribution?: boolean;
    // --- NEW FIELDS FOR ML ---
    paymentMethod?: PaymentMethod;
    isRecurring?: boolean;
    notes?: string;
}

export type ExpenseData = Omit<Expense, 'id' | 'imageUrl' | 'violations' | 'isMissionContribution'>;

export interface Product {
  productName: string;
  estimatedPrice: number;
}

export interface VerificationCheck {
    item: string;
    valid: boolean;
    reason: string;
}

export interface VerificationResult {
    checks: VerificationCheck[];
    isValidForDeduction: boolean;
    overallVerdict: string;
    reasonForInvalidity: string | null;
}