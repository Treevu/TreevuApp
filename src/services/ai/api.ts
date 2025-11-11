// La URL de nuestro backend que actúa como proxy seguro
const API_BASE_URL = '/api/gemini';
const API_TIMEOUT_MS = 30000; // 30 segundos de timeout

/**
 * Llama a nuestro backend proxy, que a su vez llama a la API de Gemini de forma segura.
 * Incluye un timeout para evitar que la aplicación se congele.
 * @param requestBody El cuerpo de la solicitud que se enviará a la API de Gemini.
 * @returns El texto de la respuesta de la IA.
 * @throws Lanza un error si la petición falla, es abortada (timeout), o la respuesta no es OK.
 */
export const callAIApi = async (requestBody: any): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ requestBody }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[CLIENT] API Error Response:', errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.text;
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.error('[CLIENT] API call timed out.');
            throw new Error('La solicitud a la IA ha tardado demasiado en responder.');
        }
        console.error('[CLIENT] Failed to call AI API:', error);
        throw error;
    }
};
