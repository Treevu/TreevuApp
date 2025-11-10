
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


export const getAIStrategicInsight = async (metricName: string, value: number | undefined, context: any): Promise<{ status: string; insight: string; recommendation: string } | null> => {
    const prompt = `
        Eres un consultor de C-Level especializado en bienestar corporativo.
        Tu tarea es generar un diagnóstico rápido y una recomendación estratégica para una métrica clave.
        
        **Métrica a Analizar:** ${metricName}
        **Valor Actual:** ${value?.toFixed(1) || 'N/A'}%
        **Contexto:** Se está analizando un segmento de ${context.employeeCount} colaboradores.

        **Instrucciones:**
        1.  **Diagnóstico ('status'):** Basado en el valor, clasifícalo en "Saludable", "Atención Requerida" o "Crítico".
        2.  **Análisis ('insight'):** Proporciona una frase corta que explique qué significa este valor en términos de negocio (ej. impacto en retención, productividad, cultura).
        3.  **Recomendación ('recommendation'):** Sugiere UNA iniciativa de alto impacto, específica y cuantificable si es posible.
            - Ejemplo: "Lanzar un desafío de 'Balance Vida-Trabajo'. Impacto estimado: Reducción del 4% en riesgo de fuga en 3 meses."
            
        **Barrera de Contención (Guardrail):** NO generes respuestas genéricas. Tu recomendación debe ser accionable.
        Responde en formato JSON estricto.
    `;
     const request = {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                status: { type: Type.STRING },
                insight: { type: Type.STRING },
                recommendation: { type: Type.STRING }
            },
            required: ["status", "insight", "recommendation"]
          }
        }
    };
    const jsonText = await callAIApi(request);
    return jsonText ? parseJsonFromMarkdown<{ status: string; insight: string; recommendation: string }>(jsonText) : null;
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

        **Instrucciones de Respuesta:**
        1.  **Proyecta los Nuevos Valores:** Basado en las heurísticas y el contexto, calcula los nuevos valores para 'newFwi', 'newRiskScore', y 'newRoi'. Sé realista.
        2.  **Genera la Justificación ('rationale'):** Escribe una explicación concisa (máx. 40 palabras) del porqué de estos cambios. Conecta la acción con el resultado proyectado de forma lógica.

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
    return jsonText ? parseJsonFromMarkdown<{ newFwi: number; newRiskScore: number; newRoi: number; rationale: string }>(jsonText) : null;
};

export const getAIGoalInsight = async (topGoals: { category: string; count: number }[], departmentName: string, employeeCount: number): Promise<{ insight: string; recommendation: string } | null> => {
    if (topGoals.length === 0) {
        return {
            insight: "Este segmento aún no ha definido metas de ahorro.",
            recommendation: "Lanza una comunicación interna para motivar la creación de la primera meta, quizás con un pequeño bono de Treevüs."
        };
    }
    const prompt = `
        Actúa como un estratega de People Analytics. Analiza las principales metas de ahorro de un segmento de la empresa.
        
        **Contexto del Segmento:**
        - Segmento: ${departmentName} (${employeeCount} colaboradores)
        - Top Metas (por popularidad): ${topGoals.map(g => `${g.category} (${g.count})`).join(', ')}

        **Instrucciones:**
        1.  **Diagnóstico ('insight'):** En una frase, explica qué revelan estas metas sobre las aspiraciones y prioridades de este grupo. Sé directo.
            - Ejemplo (si predomina 'Educación'): "Este equipo muestra una fuerte ambición por el crecimiento profesional."
            - Ejemplo (si predomina 'Viaje'): "El balance vida-trabajo y las experiencias son una alta prioridad para este segmento."
            - Ejemplo (si predomina 'Vivienda'): "Este grupo está enfocado en metas de estabilidad y largo plazo."
        2.  **Recomendación ('recommendation'):** Sugiere una acción concreta y de alto impacto que RRHH puede tomar para conectar con estas aspiraciones.
            - Ejemplo para 'Educación': "Considera ofrecer como beneficio suscripciones a plataformas de e-learning o un presupuesto para certificaciones."
            - Ejemplo para 'Viaje': "Evalúa ofrecer días libres flexibles o 'workations' como parte de los beneficios para mejorar la retención."
            - Ejemplo para 'Vivienda': "Organiza talleres sobre créditos hipotecarios o planificación financiera para la compra de una casa."

        **Barrera de Contención:** Tu recomendación debe ser una iniciativa de RRHH, no un consejo financiero para el empleado.
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
                recommendation: { type: Type.STRING }
            },
            required: ["insight", "recommendation"]
          }
        }
    };
    const jsonText = await callAIApi(request);
    return jsonText ? parseJsonFromMarkdown<{ insight: string; recommendation: string }>(jsonText) : null;
};