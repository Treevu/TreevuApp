export interface RucValidationResponse {
    isValid: boolean;
    razonSocial?: string;
    message: string;
}

const API_BASE_URL = '/api/sunat';

/**
 * Calls the backend proxy to validate a RUC against a simulated SUNAT database.
 * @param ruc The 11-digit RUC to validate.
 * @returns A promise that resolves to the validation result.
 */
export const validateRuc = async (ruc: string): Promise<RucValidationResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/validate-ruc/${ruc}`);
        
        // For known error statuses like 404 (not found), the API returns a structured message.
        // We parse it to display the specific reason to the user.
        if (!response.ok) {
            const errorJson: RucValidationResponse = await response.json();
            return {
                isValid: false,
                message: errorJson.message || `Error de red: ${response.statusText}`
            };
        }
        
        return await response.json();
    } catch (error) {
        console.error("Failed to validate RUC:", error);
        return { isValid: false, message: 'Error de conexión al validar RUC.' };
    }
};