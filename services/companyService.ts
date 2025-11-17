import { CompanyAlliance } from "../types/employer";

// Mock database of partner companies
// FIX: Export MOCK_ALLIANCES to make it available for import in other modules.
export const MOCK_ALLIANCES: CompanyAlliance[] = [
    {
        id: 'acme-corp-123',
        name: 'Acme Corp',
        validDomains: ['acme.com', 'acmecorp.pe'],
        validCodes: ['ACME123'],
        branding: {
            primaryColor: '#3b82f6', // blue-500
            logoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500'
        }
    },
    {
        id: 'stark-industries-456',
        name: 'Stark Industries',
        validDomains: ['stark.com', 'starkindustries.io'],
        validCodes: ['STARK456'],
        branding: {
            primaryColor: '#ef4444', // red-500
            logoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=red&shade=500'
        }
    }
];

/**
 * Simulates calling a backend to verify a company code or corporate email.
 * @param codeOrEmail The code or email provided by the user.
 * @returns A promise that resolves with the CompanyAlliance object if valid.
 * @throws An error if the code or email is invalid.
 */
export const verifyCompanyAlliance = (codeOrEmail: string): Promise<CompanyAlliance> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const normalizedInput = codeOrEmail.toLowerCase().trim();
            const isEmail = normalizedInput.includes('@');

            const foundAlliance = MOCK_ALLIANCES.find(alliance => {
                if (isEmail) {
                    const domain = normalizedInput.split('@')[1];
                    return alliance.validDomains.includes(domain);
                } else {
                    return alliance.validCodes.map(c => c.toLowerCase()).includes(normalizedInput);
                }
            });

            if (foundAlliance) {
                resolve(foundAlliance);
            } else {
                reject(new Error('El código o email no pertenece a una empresa aliada.'));
            }
        }, 1000); // Simulate network delay
    });
};