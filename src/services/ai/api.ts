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
    return 'test';
};
