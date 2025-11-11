import { Type } from '@google/genai';
import { callAIApi } from './api';
import { parseJsonFromMarkdown } from '../../utils';
import { levelData } from '../gamificationService';

import { CategoriaGasto } from '@/types/common';
import { User, Reward } from '@/types/user';
import { Expense } from '@/types/expense';
import { Goal } from '@/types/goal';
import { AISavingOpportunity } from '@/types/ai';

export const getAIGreeting = async (user: User): Promise<string> => {
    const fwi = user.progress.formalityIndex;
    const prompt = `
        Eres treevü coach, un asistente financiero personal para un usuario en Perú. Eres proactivo, amigable y empático.
        Tu misión es dar una bienvenida cálida y personalizada. Varía tus saludos para no ser repetitivo. Usa emojis con moderación.
        Tu tono debe ser el de un copiloto amigable, no solo un asistente.
        
        **Contexto del Usuario (${user.name.split(' ')[0]}):**
        - Nivel: ${levelData[user.level].name}
        - Racha: ${user.streak?.count || 0} días.
        - Índice de Bienestar Financiero (FWI): ${fwi.toFixed(0)}%
        - Trofeos enviados: ${user.kudosSent}
        - Hora local: ${new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}

        **Instrucciones de Respuesta:**
        1.  Crea un saludo corto y personalizado. Si tiene una racha > 1, ¡felicítalo! Si es de noche, deséale buenas noches.
        2.  En 'conversationBody', pregunta de forma abierta cómo puedes ayudarlo hoy.
        3.  Genera 3 'suggestions' que sean acciones comunes y útiles como "Registrar un gasto", "Ver mi presupuesto", "¿Cómo gano más Treevüs?".
        4.  Genera un 'insight' y 'challenge' breves y motivadores para el 'header'.
        5.  Responde siempre en el formato JSON estricto. Asegúrate de incluir el FWI del usuario en 'fwi'.
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
                            level: { type: Type.STRING, description: `El nivel del usuario: "${levelData[user.level].name}"` },
                            fwi: { type: Type.STRING, description: `El FWI actual del usuario en formato 'XX%'` },
                            insight: { type: Type.STRING, description: "Un dato curioso o insight financiero breve." },
                            challenge: { type: Type.STRING, description: "Un pequeño reto para hoy, ej: 'Otorga un reconocimiento a un compañero'." },
                        },
                        required: ["level", "fwi", "insight", "challenge"]
                    },
                    conversationBody: {
                        type: Type.STRING,
                        description: "El saludo y pregunta conversacional para el usuario."
                    },
                    suggestions: {
                        type: Type.ARRAY,
                        description: "Un array de 3 preguntas de seguimiento comunes.",
                        items: {
                            type: Type.STRING
                        }
                    }
                },
                required: ["header", "conversationBody", "suggestions"]
            }
        }
    };
    
    return await callAIApi(request);
};

export const getAIEducationalTip = async (): Promise<string> => {
    const prompt = `Actúa como un coach financiero amigable en Perú. Da un consejo de finanzas personales corto, práctico y motivador (máximo 20 palabras). El consejo debe ser fácil de aplicar. No uses formato de negritas (**).`;
    try {
        const text = await callAIApi({ contents: prompt });
        return text.trim();
    } catch (error) {
        console.error("Failed to get AI educational tip:", error);
        return "Revisa tus gastos hormiga, ¡pueden sumar una gran cantidad a fin de mes!";
    }
};

export const getAINextStepTip = async (user: User, expenses: Expense[], goals: Goal[]): Promise<string | null> => {
    
    const lastExpense = expenses.length > 0 ? expenses[0] : null;
    const nextLevelData = levelData[user.level].nextLevel ? levelData[levelData[user.level].nextLevel!] : null;
    
    let nextLevelGoal = '';
    if (nextLevelData?.goals.expensesCount && user.progress.expensesCount < nextLevelData.goals.expensesCount) {
        const remaining = nextLevelData.goals.expensesCount - user.progress.expensesCount;
        nextLevelGoal = `Estás a ${remaining} gastos de evolucionar a '${nextLevelData.name}'.`;
    }

    const prompt = `
      Actúa como "treevü", un copiloto financiero que habla el lenguaje de la gamificación. Eres amigable y proactivo.
      Tu tarea es generar un consejo como "Tu Próximo Paso" (máximo 25 palabras, sin negritas). Usa términos como "cosechar Treevüs", "evolucionar", "bono".
      
      **Contexto del Usuario:**
      - Nivel: ${levelData[user.level].name}
      - Último gasto registrado: ${lastExpense ? `S/ ${lastExpense.total.toFixed(2)} en '${lastExpense.categoria}' (${lastExpense.esFormal ? 'Formal' : 'Informal'})` : 'Ninguno'}
      - Próximo nivel: ${nextLevelGoal || 'Nivel máximo alcanzado'}

      **Instrucciones y Barreras de Contención (Guardrails):**
      1.  **SI el último gasto es anómalo** (ej. total menor a S/ 1.00):
          - IGNORA ese gasto específico.
          - Da un consejo general sobre la próxima meta de nivel. Ejemplo: "¡Cada registro te acerca a tu próxima evolución! Sigue así."
      2.  **SI hay una meta de próximo nivel:** Conecta el último gasto con esa meta.
          - Ejemplo: "¡Gasto registrado! +10 Treevüs a tu cosecha. ${nextLevelGoal}"
      3.  **SI el último gasto fue informal:**
          - Anímalo a que el próximo sea formal para ganar más.
          - Ejemplo: "¡Registro completado! Para tu próxima compra, pide boleta y cosecha hasta 10x más Treevüs."
      4.  **SI NO hay meta de nivel (es nivel máximo):**
          - Da un consejo de maestría.
          - Ejemplo: "¡Registro de maestro! Revisa tus metas para ver cómo este gasto impacta tu progreso."
      5.  **SI es el primer gasto del historial:**
          - Dale una bienvenida especial al ecosistema.
          - Ejemplo: "¡Tu primer registro! Has plantado tu primera semilla. ¡Sigue así para ver crecer tu árbol financiero!"

      Responde solo con la frase del consejo.
    `;
    try {
        const text = await callAIApi({ contents: prompt });
        return text ? text.trim() : null;
    } catch (error) {
        console.error("Failed to get AI next step tip:", error);
        return null;
    }
};

export const getAIWeeklySummary = async (user: User, lastWeekExpenses: Expense[]): Promise<string> => {
    if (lastWeekExpenses.length < 2) {
        return "Registra más gastos esta semana para recibir un resumen detallado. ¡Cada boleta cuenta!";
    }
    const totalSpent = lastWeekExpenses.reduce((sum, e) => sum + e.total, 0);
    const topCategory = [...lastWeekExpenses].sort((a, b) => b.total - a.total)[0].categoria;

    const prompt = `
      Actúa como "treevü", un coach financiero amigable para ${user.name} en Perú.
      Analiza sus gastos de la última semana. Total gastado: S/ ${totalSpent.toFixed(2)} en ${lastWeekExpenses.length} transacciones.
      La categoría con más gasto fue ${topCategory}.
      Basado en esto, escribe un resumen de 2 a 3 frases cortas:
      1. Un insight principal sobre su gasto. Si el gasto está bien distribuido, celebra ese balance.
      2. Una sugerencia corta y accionable.
      El tono debe ser motivador. Recuerda que el gasto en 'Ocio' es vital para el bienestar; enfoca la sugerencia en el balance, no en la prohibición. No uses markdown ni negritas.
    `;
    const text = await callAIApi({ contents: prompt });
    return text?.trim() ?? "No se pudo generar tu resumen. ¡Sigue registrando gastos para obtener insights!";
};

export const getAIBudgetProjection = async (expenses: Expense[], budget: number): Promise<{ projectedSpending: number; insight: string; } | null> => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();
    const expensesThisMonth = expenses.filter(e => {
        const expenseDate = new Date(e.fecha);
        return expenseDate.getFullYear() === today.getFullYear() && expenseDate.getMonth() === today.getMonth();
    });
    const totalSpentThisMonth = expensesThisMonth.reduce((sum, e) => sum + e.total, 0);

    if (currentDay < 3 || expensesThisMonth.length < 3) return null;

    const projectedSpending = (totalSpentThisMonth / currentDay) * daysInMonth;
    const isOverBudgetNow = totalSpentThisMonth > budget;
    const remainingBudget = budget - totalSpentThisMonth;

    const prompt = `
        Actúa como un analista financiero predictivo, empático y conciso para un usuario en Perú. Tu tono debe ser directo pero siempre de apoyo.

        **Contexto Financiero Actual (Día ${currentDay} de ${daysInMonth}):**
        - Presupuesto mensual: S/ ${budget.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        - Gasto hasta hoy: S/ ${totalSpentThisMonth.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        - Estado actual: ${isOverBudgetNow ? `Excedido en S/ ${Math.abs(remainingBudget).toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : `Restante S/ ${remainingBudget.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
        - Gasto proyectado a fin de mes: S/ ${projectedSpending.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        - Historial reciente de gastos: ${JSON.stringify(expensesThisMonth.slice(-5).map(e => ({ cat: e.categoria, total: e.total })))}

        **Instrucciones Clave (analiza en este orden estricto - Chain-of-Thought):**
        1.  **SI el estado actual es "Excedido":**
            - Tu respuesta DEBE empezar con un tono de alerta. Analiza la categoría principal que contribuyó al exceso.
            - Genera un insight de control de daños (máx. 25 palabras). Usa frases como "estamos a tiempo de ajustar" o "revisemos juntos".
            - Ejemplo: "¡Alerta! Ya excediste tu presupuesto. Revisa tus próximos gastos, sobre todo en '[categoría]', para minimizar el impacto."

        2.  **SI el estado actual NO es "Excedido", PERO el gasto proyectado es MAYOR al presupuesto:**
            - Tu respuesta debe ser una advertencia proactiva. Identifica la categoría que más influye.
            - Genera un insight de advertencia (máx. 25 palabras).
            - Ejemplo: "Cuidado, proyectas exceder tu presupuesto. Modera tus gastos en '[categoría]' para mantenerte en verde."

        3.  **SI el gasto proyectado es MENOR O IGUAL al presupuesto:**
            - Tu respuesta debe ser positiva y de refuerzo.
            - Calcula el ahorro proyectado (presupuesto - gasto proyectado).
            - Genera un insight de celebración (máx. 25 palabras).
            - Ejemplo: "¡Excelente ritmo! Proyectas terminar el mes con un ahorro de S/ [ahorro proyectado]."

        **Reglas Adicionales:**
        - NO uses markdown, negritas ni saltos de línea. La respuesta debe ser una sola frase.
        - Identifica siempre la categoría más relevante en el contexto y menciónala por su nombre (ej. 'Ocio', 'Alimentación').
    `;
    const insightText = await callAIApi({ contents: prompt });
    return insightText ? { projectedSpending, insight: insightText.trim() } : null;
};

export const getAIGoalCoaching = async (goal: Goal, expenses: Expense[]): Promise<{ plan: string; insight: string } | null> => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    
    // Simple analysis of spending patterns
    const totalSpentLast30Days = expenses
        .filter(e => new Date(e.fecha) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((sum, e) => sum + e.total, 0);
    
    const discretionarySpending = expenses
        .filter(e => [CategoriaGasto.Ocio, CategoriaGasto.Consumos].includes(e.categoria))
        .reduce((sum, e) => sum + e.total, 0);

    const prompt = `
      Eres un coach financiero motivacional. Tu objetivo es dar un plan de acción y un insight para ayudar a un usuario a alcanzar su meta.
      Tu tono es el de un partner estratégico: inteligente, empático y orientado a la acción.
      
      **Contexto de la Meta: "${goal.name}"**
      - Progreso: ${progress.toFixed(0)}%
      - Restante: S/ ${remaining.toFixed(2)}
      - Gasto total (últimos 30 días): S/ ${totalSpentLast30Days.toFixed(2)}
      - Gasto discrecional (Ocio, Consumos): S/ ${discretionarySpending.toFixed(2)}

      **Tu Playbook de Estrategias (Elige la más adecuada):**
      - **Reducir:** Identifica una categoría específica donde se pueda recortar (ej. 'Ocio'). Sugiere reducirlo temporalmente. Es la opción clásica.
      - **Optimizar:** En lugar de cortar, sugiere encontrar una alternativa más barata. (ej. 'optimiza tu gasto en Transporte buscando rutas más eficientes').
      - **Generar:** Si el progreso es alto y falta poco, sugiere una forma de generar un ingreso extra pequeño (ej. 'vender algo que no uses').
      - **Reestructurar:** Si hay múltiples metas, sugiere pausar una menos prioritaria para acelerar esta. (Dado el contexto, puedes asumir que esta es la prioritaria).

      **Instrucciones de Respuesta:**
      1.  **"plan":** Una frase de acción directa (máx. 15 palabras). Debe ser concreta.
          - Ejemplo: "Reduce S/ 50 de tu gasto en 'Ocio' esta semana."
          - Ejemplo: "Genera ingresos extra vendiendo algo que no uses."
          - Ejemplo: "Optimiza tu gasto en 'Alimentación' cocinando en casa."
      2.  **"insight":** Una frase motivacional que conecte el plan con el resultado (máx. 25 palabras).
          - Ejemplo: "Ese pequeño ajuste es el empujón final que necesitas para lograr tu meta este mes. ¡Vamos!"

      **Barreras de Contención (Guardrails):**
      - NO generes planes genéricos como "ahorra más". Sé específico.
      - Si sugieres reducir, incluye la categoría entre comillas simples (ej. 'Ocio') para que la UI pueda detectarla.
      - Elige la estrategia que tenga más sentido según el contexto provisto.

      Responde en formato JSON estricto.
    `;
    const request = {
      contents: prompt,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  plan: { type: Type.STRING },
                  insight: { type: Type.STRING }
              },
              required: ["plan", "insight"]
          }
      }
    };

    const jsonText = await callAIApi(request);
    return jsonText ? parseJsonFromMarkdown<{ plan: string; insight: string }>(jsonText) : null;
};

export const getAISavingOpportunity = async (expense: Expense, goals: Goal[]): Promise<AISavingOpportunity | null> => {
    if (goals.length === 0) return null;
    
    const prompt = `
      Actúa como "treevü", un copiloto financiero que busca momentos oportunos para potenciar el ahorro del usuario.
      Tu tono es gamificado y motivador.
      
      **Contexto:**
      - El usuario acaba de registrar un gasto de S/ ${expense.total.toFixed(2)} en '${expense.razonSocial}'.
      - El usuario tiene ${goals.length} meta(s) de ahorro activas.
      - La meta más cercana a completarse es "${goals[0].name}".

      **Tarea:**
      1.  Genera un "suggestionText" que sea una llamada a la acción corta, emocionante y contextual al gasto recién hecho. Usa frases como "Ahorro Rápido", "super-impulso", "cosechar Treevüs extra".
      2.  Genera un array "suggestedAmounts" con 3 montos de ahorro pequeños y razonables, basados en el total del gasto. Los montos deben ser atractivos (ej. 5, 10, 20) y no superar el 50% del gasto.
      
      **Ejemplo de respuesta para un gasto de S/ 80:**
      {
        "suggestionText": "¡Acabas de registrar un gasto! Activa un 'Ahorro Rápido' para darle un super-impulso a tu meta y cosechar Treevüs extra.",
        "suggestedAmounts": [5, 10, 20]
      }
      
      Responde siempre en formato JSON estricto.
    `;
    
     const request = {
      contents: prompt,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  suggestionText: { type: Type.STRING },
                  suggestedAmounts: { 
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER }
                  }
              },
              required: ["suggestionText", "suggestedAmounts"]
          }
      }
    };
    const jsonText = await callAIApi(request);
    return jsonText ? parseJsonFromMarkdown<AISavingOpportunity>(jsonText) : null;
};

export const getAINotificationContent = async (
    type: 'spending_anomaly' | 'goal_milestone',
    context: { category?: CategoriaGasto; goalName?: string; percentage?: number }
): Promise<{ title: string; message: string } | null> => {
    let prompt = '';
    if (type === 'spending_anomaly') {
        prompt = `
            Genera una notificación corta y amigable para alertar al usuario sobre un gasto anómalo.
            Categoría: '${context.category}'
            Instrucciones: El título debe ser una alerta directa y el mensaje una sugerencia sutil para revisar su presupuesto.
        `;
    } else if (type === 'goal_milestone') {
        prompt = `
            Genera una notificación motivadora para celebrar un hito en una meta de ahorro.
            Meta: "${context.goalName}"
            Hito: ${context.percentage}%
            Instrucciones: El título debe ser celebratorio y el mensaje un empujón final para completar la meta.
        `;
    }

    if (!prompt) return null;

    const request = {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            message: { type: Type.STRING }
          },
          required: ["title", "message"]
        }
      }
    };
    const jsonText = await callAIApi(request);
    return jsonText ? parseJsonFromMarkdown<{ title: string; message: string }>(jsonText) : null;
};