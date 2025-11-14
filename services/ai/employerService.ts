import { Type } from '@google/genai';
import { callAIApi } from './api';
import { parseJsonFromMarkdown } from '../../utils';

import { Challenge } from '../../types/employer';

export const getAIEmployerResponse = async (query: string, data: any): Promise<string | null> => {
    const sortedByFwi = data.kpisByDepartment && data.kpisByDepartment.length > 0
        ? [...data.kpisByDepartment].sort((a: any, b: any) => b.fwi - a.fwi)
        : [];
    const highestFwiDept = sortedByFwi.length > 0 ? sortedByFwi[0].department : 'N/A';
    const lowestFwiDept = sortedByFwi.length > 0 ? sortedByFwi[sortedByFwi.length - 1].department : 'N/A';
    
    const prompt = `
        Eres un estratega de RRHH y analista de datos para una empresa que usa treevü. Tu nombre es "Asistente Estratégico".
        Tu misión es analizar datos agregados y anónimos del equipo para generar insights de alto valor o borradores de comunicación.
        
        **Contexto de Datos del Segmento Actual:**
        - Total de colaboradores en el segmento: ${data.filteredActiveEmployees}
        - FWI (Índice de Bienestar Financiero) promedio: ${data.financialWellnessIndex.toFixed(1)}
        - Riesgo de Fuga de Talento: ${data.talentFlightRisk}
        - Porcentaje de Gasto Esencial: ${data.essentialVsDesiredBreakdown.essentialPercent.toFixed(1)}%
        - ROI del programa de beneficios: ${data.roiMultiplier.toFixed(1)}x
        - Tasa de adopción de metas de ahorro: ${data.goalAdoptionRate.toFixed(1)}%
        - Departamentos con mayor y menor FWI: ${highestFwiDept} (más alto), ${lowestFwiDept} (más bajo)

        **Consulta del Líder:** "${query}"

        **Instrucciones de Respuesta (Chain-of-Thought):**
        1.  **Interpreta la Intención:** ¿El líder quiere un análisis de datos o un borrador de comunicación?
        
        2.  **SI es un ANÁLISIS:**
            - Conecta la pregunta con los datos de contexto.
            - **Regla Clave:** Si el 'Riesgo de Fuga' es 'Medio' o 'Alto' Y el 'Porcentaje de Gasto Esencial' es > 70%, tu 'keyFinding' DEBE resaltar esta correlación como un posible indicador de estrés financiero.
            - Responde con un 'analysisResponse' que contenga un 'title', 'keyFinding' (el insight principal), 'recommendation' (una acción concreta y de alto impacto) y 'dataPoints' (2-4 métricas clave que sustenten el hallazgo).
            - **Guardrail:** NO inventes datos. Si no tienes la información, indícalo.

        3.  **SI es un BORRADOR de COMUNICACIÓN:**
            - Infiere el público y el canal (email o Slack).
            - Responde con un 'communicationDraft' que contenga 'platform', 'subject' (si es email), y 'body'.
            - El tono debe ser profesional, empático y alineado con una cultura de bienestar.
            - **Guardrail:** No uses nombres de empleados. Habla siempre en términos de equipo o departamento.

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


export const getAIStrategicInsights = async (data: any): Promise<{ metricName: string; status: string; insight: string; recommendation: string }[] | null> => {
    const prompt = `
        Eres un consultor de C-Level especializado en bienestar corporativo.
        Tu tarea es generar un diagnóstico rápido y una recomendación estratégica para cada una de las siguientes métricas clave.

        **Métricas a Analizar:**
        - Salud Financiera (valor: ${data.formalityScore?.toFixed(1) || 'N/A'}%)
        - Balance Vida-Trabajo (valor: ${data.workLifeBalanceScore?.toFixed(1) || 'N/A'}%)
        - Desarrollo Profesional (valor: ${data.selfDevScore?.toFixed(1) || 'N/A'}%)
        - Adopción y Engagement (valor: ${data.activationRate?.toFixed(1) || 'N/A'}%)

        **Instrucciones:**
        Para CADA UNA de las cuatro métricas:
        1.  **Diagnóstico ('status'):** Clasifícalo en "Saludable", "Atención Requerida" o "Crítico".
        2.  **Análisis ('insight'):** Proporciona una frase corta que explique qué significa este valor en términos de negocio (ej. impacto en retención, productividad, cultura).
        3.  **Recomendación ('recommendation'):** Sugiere UNA iniciativa de alto impacto, específica y accionable.
        
        **Barrera de Contención (Guardrail):** NO generes respuestas genéricas. Tu recomendación debe ser accionable.
        Responde en formato JSON estricto con un array de 4 objetos. Cada objeto debe tener: 'metricName', 'status', 'insight', 'recommendation'.
    `;
     const request = {
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    metricName: { type: Type.STRING },
                    status: { type: Type.STRING },
                    insight: { type: Type.STRING },
                    recommendation: { type: Type.STRING }
                },
                required: ["metricName", "status", "insight", "recommendation"]
            }
          }
        }
    };
    const jsonText = await callAIApi(request);
    return jsonText ? parseJsonFromMarkdown<any[]>(jsonText) : null;
};

export const getAIChallengeSuggestion = async (data: any): Promise<Omit<Challenge, 'id'> | null> => {
    const sortedDepts = data.kpisByDepartment && data.kpisByDepartment.length > 0 
        ? [...data.kpisByDepartment].sort((a:any,b:any) => a.fwi - b.fwi)
        : [];
    const lowestFwiDept = sortedDepts.length > 0 ? sortedDepts[0].department : 'N/A';

    const prompt = `
        Eres un estratega de gamificación. Analiza estos datos de bienestar de un equipo y sugiere una "Expedición" (desafío) para mejorar la métrica más débil.
        
        **Datos del Equipo:**
        - FWI Promedio: ${data.financialWellnessIndex.toFixed(1)}
        - Componentes del FWI: 
          - Salud Financiera (Índice de Formalidad): ${data.formalityScore.toFixed(1)}%
          - Balance Vida-Trabajo (Gasto Ocio vs. Esencial): ${data.workLifeBalanceScore.toFixed(1)}%
          - Desarrollo Profesional (Gasto Educación): ${data.selfDevScore.toFixed(1)}%
        - Departamento con menor FWI: ${lowestFwiDept}

        **Instrucciones:**
        1.  Identifica la métrica MÁS BAJA o el área con MÁS OPORTUNIDAD de mejora.
        2.  Crea un 'title' para la misión que sea emocionante (ej. "Misión Equilibrio: Tec & Innovación").
        3.  Escribe una 'description' corta que explique el "porqué" de la misión.
        4.  Define el 'department': 'all' o el departamento específico con la oportunidad.
        5.  Selecciona la 'targetMetric' ('financialWellnessIndex' o 'formalityScore') que la misión busca impactar.
        6.  Establece un 'targetValue' realista (un 5-10% de mejora sobre el valor actual).
        7.  Crea una 'reward' atractiva y alineada con la misión.

        Responde en formato JSON estricto.
    `;
    const request = {
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                department: { type: Type.STRING },
                targetMetric: { type: Type.STRING },
                targetValue: { type: Type.NUMBER },
                reward: { type: Type.STRING }
            },
            required: ["title", "description", "department", "targetMetric", "targetValue", "reward"]
          }
        }
    };
     const jsonText = await callAIApi(request);
    return jsonText ? parseJsonFromMarkdown<Omit<Challenge, 'id'>>(jsonText) : null;
};

export const getAIImpactProjection = async (simulationParams: {
    currentData: any;
    action: 'challenge' | 'bonus' | 'workshop';
    department: string;
    parameter: number;
}): Promise<{ newFwi: number; newRiskScore: number; newRoi: number; rationale: string; } | null> => {
    const { currentData, action, parameter } = simulationParams;

    const prompt = `
        Actúa como un analista de People Analytics predictivo y experto en comportamiento organizacional.
        Tu tarea es proyectar el impacto de una iniciativa de RRHH en los KPIs de bienestar de un equipo.

        **Contexto del Equipo (Data Actual):**
        - FWI (Índice de Bienestar Financiero): ${currentData.financialWellnessIndex.toFixed(1)}
        - Riesgo de Fuga: ${currentData.flightRiskScore.toFixed(1)}%
        - ROI del Programa: ${currentData.roiMultiplier.toFixed(1)}x

        **Iniciativa Propuesta a Simular:**
        - Acción: ${action}
        - Parámetro: ${parameter} ${action === 'challenge' ? 'semanas' : action === 'bonus' ? '% del salario' : 'sesiones'}
        
        **Tu Base de Conocimiento (Heurísticas):**
        - Un 'challenge' de ahorro de 4 semanas típicamente aumenta el FWI en 2-4 pts al fomentar hábitos. El impacto en el riesgo de fuga es de -1 a -3 pts.
        - Un 'bonus' tiene un impacto inmediato en FWI (+3 a +6 pts), pero su efecto es temporal. Aumenta el ROI a corto plazo. Impacto moderado en riesgo de fuga (-1 pt).
        - Un 'workshop' de educación financiera tiene un impacto sostenido pero lento en el FWI (+1-2 pts por trimestre) y un impacto bajo en el riesgo de fuga a corto plazo.
        - El impacto es un 20% mayor si se enfoca en un departamento con bajo FWI.
    `;
    // FIX: Completed the function implementation to call the AI and return a value.
    const request = {
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    newFwi: { type: Type.NUMBER },
                    newRiskScore: { type: Type.NUMBER },
                    newRoi: { type: Type.NUMBER },
                    rationale: { type: Type.STRING }
                },
                required: ["newFwi", "newRiskScore", "newRoi", "rationale"]
            }
        }
    };

    const jsonText = await callAIApi(request);
    return jsonText ? parseJsonFromMarkdown<any>(jsonText) : null;
};

// FIX: Added missing function 'getAIGoalInsight'
export const getAIGoalInsight = async (
    savingsByCategory: { category: string; amount: number }[],
    department: string,
    employeeCount: number
): Promise<{ insight: string; recommendation: string } | null> => {
    const topGoal = savingsByCategory.length > 0 ? savingsByCategory[0].category : 'ninguna';

    const prompt = `
        Actúa como un estratega de People Analytics. Analiza los siguientes datos sobre las metas de ahorro de un segmento de empleados.

        **Contexto del Segmento:**
        - Segmento: ${department}
        - Número de colaboradores: ${employeeCount}
        - Distribución del Ahorro: ${JSON.stringify(savingsByCategory)}
        - Meta principal (donde más se ahorra): ${topGoal}

        **Instrucciones:**
        1.  **'insight':** Genera una observación clave sobre las aspiraciones del equipo. ¿Qué revela la meta principal sobre sus prioridades? (ej: "El equipo prioriza la estabilidad a largo plazo", "Hay un fuerte deseo de desarrollo profesional").
        2.  **'recommendation':** Sugiere una acción concreta que la empresa puede tomar para apoyar estas aspiraciones. (ej: "Considera ofrecer talleres sobre inversión inmobiliaria", "Evalúa crear un programa de becas para postgrados").
        
        Responde en formato JSON estricto.
    `;
    const request = {
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    insight: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                },
                required: ['insight', 'recommendation'],
            }
        }
    };

    const jsonText = await callAIApi(request);
    return jsonText ? parseJsonFromMarkdown<{ insight: string; recommendation: string }>(jsonText) : null;
};

// FIX: Added missing function 'getAIStrategicReportSummary'
export const getAIStrategicReportSummary = async (data: any): Promise<{ executiveSummary: string; recommendations: { title: string; detail: string }[] } | null> => {
    const prompt = `
        Eres un consultor de estrategia de alto nivel (C-Level) para RRHH. Analiza los siguientes KPIs de un segmento de la empresa y genera un informe ejecutivo.

        **Datos del Segmento:**
        - FWI (Índice de Bienestar Financiero) promedio: ${data.financialWellnessIndex.toFixed(1)}
        - Riesgo de Fuga de Talento: ${data.talentFlightRisk} (${data.flightRiskScore.toFixed(1)}%)
        - Tasa de Activación: ${data.activationRate.toFixed(1)}%
        - ROI del Programa: ${data.roiMultiplier.toFixed(1)}x
        - Componentes del FWI:
            - Salud Financiera: ${data.formalityScore.toFixed(1)}%
            - Balance Vida-Trabajo: ${data.workLifeBalanceScore.toFixed(1)}%
            - Desarrollo Profesional: ${data.selfDevScore.toFixed(1)}%

        **Instrucciones de Respuesta:**
        1.  **'executiveSummary':** Escribe un resumen ejecutivo de 2-3 frases. Debe identificar el estado general (saludable, en riesgo, etc.), mencionar la métrica más fuerte y la de mayor oportunidad.
        2.  **'recommendations':** Genera un array de 2 o 3 recomendaciones estratégicas. Cada una debe tener un 'title' (la iniciativa) y un 'detail' (el porqué y el impacto esperado).
        
        **Barreras de Contención (Guardrails):**
        - Sé conciso y directo, como si hablaras con un CEO.
        - Basa tus recomendaciones en los datos. Si el Riesgo de Fuga es alto, una recomendación debe abordarlo. Si el Desarrollo Profesional es bajo, sugiere una iniciativa de L&D.

        Responde en formato JSON estricto.
    `;
    const request = {
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    executiveSummary: { type: Type.STRING },
                    recommendations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                detail: { type: Type.STRING },
                            },
                            required: ['title', 'detail'],
                        },
                    },
                },
                required: ['executiveSummary', 'recommendations'],
            }
        }
    };
    const jsonText = await callAIApi(request);
    return jsonText ? parseJsonFromMarkdown<any>(jsonText) : null;
};
