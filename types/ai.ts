import { CategoriaGasto } from './common';

export type AISavingOpportunity = {
    suggestionText: string;
    suggestedAmounts: number[];
};

export interface AISplitSuggestion {
    category: CategoriaGasto;
    total: number;
    productNames: string[];
}
