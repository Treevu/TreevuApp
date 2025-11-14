export const DEPARTMENTS = [
    'Ventas y Marketing', 
    'Tecnología e Innovación', 
    'Operaciones y Logística',
    'Finanzas y Contabilidad', 
    'Recursos Humanos', 
    'Administración y Legal',
    'Dirección Ejecutiva'
] as const;
export type Department = typeof DEPARTMENTS[number];

export const TENURES = ['< 1 año', '1-5 años', '> 5 años'] as const;
export type Tenure = typeof TENURES[number];

export const MODALITIES = ['Presencial', 'Híbrido', 'Remoto'] as const;
export type Modality = typeof MODALITIES[number];

export const AGE_RANGES = ['18-24', '25-29', '30-39', '40-49', '50-59', '60+'] as const;
export type AgeRange = typeof AGE_RANGES[number];

export interface Challenge {
    id: string;
    title: string;
    description: string;
    targetMetric: 'financialWellnessIndex' | 'formalityScore';
    targetValue: number;
    department: 'all' | string; // 'all' or a specific department name
    reward: string;
}

export interface CompanyAlliance {
    id: string;
    name: string;
    validDomains: string[];
    validCodes: string[];
    branding: {
        primaryColor: string;
        logoUrl?: string;
    }
}

export type AdminUser = {
    name: string;
    role: 'admin';
};

export type AreaManagerUser = {
    name: string;
    role: 'area_manager';
    department: Department;
};

export type CurrentUserType = AdminUser | AreaManagerUser;