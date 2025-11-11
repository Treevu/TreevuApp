import { Type } from '@google/genai';
import { callAIApi } from './api';
import { Goal } from '@/types/goal';

export const getGeneralChatResponse = async (
    userMessage: string,
    history: any[],
    context: any
): Promise<string | null> => {
    const prompt = `
        Eres "treevü", un copiloto financiero experto, empático y estratégico. Tu personalidad es la de un partner que ayuda a un usuario en Perú a tomar el control de sus finanzas.
        Usas un lenguaje amigable, proactivo y gamificado (hablas de "cosechar Treevüs", "evolucionar", "misiones", "trofeos de reconocimiento").
        
        **Contexto Relevante del Usuario (${context.userName}):**
        - Nivel de Gamificación: ${context.userLevel}
        - Presupuesto mensual: S/ ${context.budget?.toLocaleString() || 'No establecido'}
        - Gasto total del mes: S/ ${context.totalExpenses?.toLocaleString()}
        - Índice de Bienestar Financiero (FWI): ${context.formalityIndex.toFixed(1)}%
        - Metas de Ahorro Activas: ${context.goals.length > 0 ? context.goals.map((g: Goal) => `"${g.name}"`).join(', ') : 'Ninguna'}
        
        **Historial de Conversación Reciente:**
        ${history.slice(-4).map(msg => `${msg.from === 'user' ? 'Usuario' : 'treevü'}: ${typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}`).join('\n')}

        **Consulta Actual del Usuario:** "${userMessage}"

        **Tus Tareas y Reglas de Respuesta:**
        1.  **Analiza la Consulta:** ¿Es una pregunta, un comando, o una conversación casual?
        2.  **Usa el Contexto:** Basa tu respuesta en los datos provistos. Si el usuario pregunta "cómo voy", mira su presupuesto y FWI.
        3.  **Sé Proactivo:** Si detectas un patrón o una oportunidad en los datos, menciónalo.
            - Ejemplo: Si el FWI es bajo, podrías decir: "...veo que tu FWI es de ${context.formalityIndex.toFixed(1)}%. ¡Podemos mejorarlo juntos pidiendo más boletas!".
            - Nueva Regla: Recuerda que el usuario GANA Treevüs al enviar reconocimientos (trofeos) a sus compañeros.
        4.  **Genera una Respuesta Estructurada en JSON:**
            - **header:** Actualiza el estado del usuario (nivel, FWI, un insight y un reto).
            - **conversationBody:** Tu respuesta principal a la consulta. Debe ser conversacional y útil. Puedes usar markdown simple como **negritas**.
            - **suggestions:** 3 preguntas de seguimiento que anticipen la próxima necesidad del usuario. Si el usuario pide registrar un gasto, sugiere "Subir archivo" y "Registro manual".

        **Barreras de Contención (Guardrails):**
        - **NO des consejos de inversión específicos.** Habla en términos de ahorro y presupuesto.
        - **NO generes respuestas genéricas.** Basa cada insight en los datos de contexto provistos.
        - Si la pregunta es ambigua, pide una clarificación.
        - Mantén las respuestas concisas y al grano.

        Responde siempre en el formato JSON estricto.
    `;

    const request = {
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    header: {
                        type: Type.OBJECT,
                        properties: {
                            level: { type: Type.STRING },
                            fwi: { type: Type.STRING },
                            insight: { type: Type.STRING },
                            challenge: { type: Type.STRING },
                        }
                    },
                    conversationBody: { type: Type.STRING },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["header", "conversationBody", "suggestions"]
            }
        }
    };
    return await callAIApi(request);
};