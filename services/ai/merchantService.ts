import { Type } from '@google/genai';
import { callAIApi } from './api';

export const getAIMerchantResponse = async (query: string, history: any[], context: any): Promise<string | null> => {
    const prompt = `
        Eres un consultor de marketing y datos para un comercio local en Perú. Tu nombre es "Asistente de Comercio".
        Tu misión es ayudar al dueño del comercio a entender y atraer a los valiosos colaboradores de la red treevü, que son clientes con mayor poder adquisitivo y lealtad.

        **Contexto de Datos del Comercio:**
        - Canjes totales: ${context.analytics.totalRedemptions}
        - Vistas totales: ${context.analytics.totalViews}
        - Tasa de conversión: ${context.analytics.conversionRate.toFixed(1)}%
        - Valor generado (estimado): S/ ${context.analytics.valueGenerated.toFixed(2)}
        - Ofertas con mejor rendimiento: ${context.analytics.topPerformingOffers.map((o: any) => `"${o.title}"`).join(', ')}

        **Consulta del Dueño:** "${query}"

        **Instrucciones de Respuesta (Chain-of-Thought):**
        1.  **Interpreta la Intención:** ¿El dueño quiere un análisis, una sugerencia de nueva oferta, o un borrador de comunicación?

        2.  **SI es un ANÁLISIS:**
            - Conecta la pregunta con los datos de contexto.
            - **Regla Clave:** Si la tasa de conversión es baja (< 5%), tu 'keyFinding' DEBE mencionar esto como una oportunidad para hacer las ofertas más atractivas o las condiciones más claras.
            - Responde con un 'analysisResponse' que contenga 'title', 'keyFinding', 'recommendation' y 'dataPoints' relevantes.

        3.  **SI es un BORRADOR de COMUNICACIÓN o una NUEVA OFERTA:**
            - Infiere el objetivo (ej. aumentar tráfico, liquidar stock).
            - Responde con un 'communicationDraft' que contenga 'platform' (sugerir 'treevu_app'), un 'subject' (título de la oferta) y un 'body' (descripción y condiciones).
            - El tono debe ser atractivo para el consumidor final.
            - **Guardrail:** Las ofertas deben ser claras y concisas.

        Responde en formato JSON estricto según la estructura definida.
    `;
    const request = {
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                analysisResponse: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        keyFinding: { type: Type.STRING },
                        recommendation: { type: Type.STRING },
                        dataPoints: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, value: { type: Type.STRING } } } }
                    }
                },
                communicationDraft: {
                    type: Type.OBJECT,
                    properties: {
                        platform: { type: Type.STRING },
                        subject: { type: Type.STRING, nullable: true },
                        body: { type: Type.STRING },
                        suggestedDeepLink: { type: Type.STRING, nullable: true }
                    }
                }
            }
          }
        }
    };
    return await callAIApi(request);
};