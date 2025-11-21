
import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptScanResult, CompanyKPIs, Expense, SavingsGoal, UserProfile, Offer, AIQueryResponse } from "../types";

const API_KEY = process.env.API_KEY || '';

const getClient = () => {
  if (!API_KEY) return null;
  return new GoogleGenAI({ apiKey: API_KEY });
};

// B2C: OCR Scanner using Flash for speed
export const scanReceipt = async (imageBase64: string): Promise<ReceiptScanResult> => {
  const start = performance.now(); // Telemetry Start
  const ai = getClient();
  
  // Fallback immediately if no key, but for demo purposes we want to show speed
  if (!ai) {
      return {
          total: 0,
          merchant: "Error: No API Key",
          ruc: "",
          date: new Date().toISOString(),
          category: "Otros",
          isFormal: false,
          processingTimeMs: 0
      };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
            { text: `
              Extract transaction data from this image. It could be a formal tax receipt (Factura/Boleta) OR a digital wallet screenshot (Yape/Plin).
              
              Rules:
              1. **Yape/Plin**: Extract the recipient name as 'merchant'. Extract amount and date. 'isFormal' is usually false.
              2. **Tax Receipt**: Look specifically for 'RUC' (11 digits). If RUC is found, 'isFormal' is TRUE. Extract 'merchant' (business name), 'total', 'date'.
              3. **Category**: Infer the best category based on the merchant name (e.g., 'Starbucks' -> 'Food & Dining').
              
              Return JSON.
              ` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            total: { type: Type.NUMBER },
            merchant: { type: Type.STRING },
            ruc: { type: Type.STRING, description: "The 11-digit RUC number if found" },
            date: { type: Type.STRING },
            category: { type: Type.STRING },
            isFormal: { type: Type.BOOLEAN }
          },
          required: ["total", "merchant", "isFormal"]
        }
      }
    });

    const end = performance.now(); // Telemetry End
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text) as ReceiptScanResult;
    result.processingTimeMs = Math.round(end - start);
    return result;

  } catch (error) {
    console.error("Gemini Scan Error:", error);
    // Fallback mock for demo stability if AI fails
    return {
      total: 0,
      merchant: "Error de Lectura (IA)",
      ruc: "",
      date: new Date().toISOString(),
      category: "Otros",
      isFormal: false,
      processingTimeMs: 0
    };
  }
};

// B2B: Daily Morning Brief
export const generateDailyBrief = async (kpis: CompanyKPIs): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Configura tu API Key para ver el resumen diario.";

  try {
    const context = `
      Genera un "Daily Brief" para un Gerente de RRHH en ESPAÑOL.
      
      Datos del día:
      - Animo del equipo: ${kpis.teamMoodScore}/100
      - Riesgo de Fuga: ${kpis.flightRiskScore}%
      - FWI Promedio: ${kpis.avgFWI}
      
      Formato requerido:
      1. Un saludo corto y energizante.
      2. El insight más crítico del día (ej: si el ánimo bajó o el riesgo subió).
      3. Una acción recomendada de un clic (ej: "Enviar Kudos" o "Programar reunión").
      
      Máximo 60 palabras. Usa emojis. Sé directo.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });

    return response.text || "Todo se ve estable hoy. ¡Buen día!";
  } catch (error) {
    console.error("Gemini Brief Error:", error);
    return "Resumen no disponible temporalmente.";
  }
};

// B2B: Dashboard Assistant using Pro for reasoning
export const analyzeDashboard = async (kpis: CompanyKPIs, query: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Por favor configura tu API Key para usar el Asistente AI.";

  try {
    const context = `
      Analiza estos KPIs de Bienestar Financiero para una empresa (Vista Ejecutiva):
      
      MÉTRICAS FINANCIERAS DURAS (Enfoque CFO):
      - Ahorro Est. Retención: S/ ${kpis.retentionSavings} (Dinero ahorrado al reducir rotación)
      - Multiplicador ROI: ${kpis.roiMultiplier}x
      
      MÉTRICAS DE PERSONAS (Enfoque RRHH):
      - FWI Promedio: ${kpis.avgFWI} / 100
      - Riesgo de Fuga (Flight Risk): ${kpis.flightRiskScore} / 100 (Alto es malo)
      - eNPS Financiero: ${kpis.projectedENPS} (Lealtad basada en bienestar financiero)
      
      DATOS DE COMPORTAMIENTO:
      - Intención de Gasto: ${kpis.spendingIntent.essential}% Esencial vs ${kpis.spendingIntent.desired}% Deseos.
      
      Consulta del Usuario: ${query}
      
      Provee un resumen ejecutivo conciso en ESPAÑOL. Si el ahorro por retención es alto, destácalo como éxito clave. Conecta el eNPS con el ROI. Usa un tono profesional y estratégico.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: context,
    });

    return response.text || "No se generaron insights.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Actualmente tengo problemas para analizar los datos. Por favor intenta de nuevo.";
  }
};

// B2B: Impact Simulator
export const simulateImpact = async (currentKpis: CompanyKPIs, action: string, investment: number): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Configura API Key para simular.";

  try {
    const context = `
      Actúa como un Estratega de Recursos Humanos y Finanzas.
      
      Situación Actual:
      - FWI: ${currentKpis.avgFWI}
      - Riesgo de Fuga: ${currentKpis.flightRiskScore}%
      - Ahorro Retención: S/ ${currentKpis.retentionSavings}
      
      Acción Propuesta: "${action}"
      Inversión Estimada: S/ ${investment} por empleado.
      
      TAREA:
      Predice el impacto en 3 líneas:
      1. Impacto en FWI (Estimado).
      2. Impacto en Riesgo de Fuga (Reducción estimada).
      3. Justificación financiera breve (ROI proyectado).
      
      Sé realista, no optimista ciego. Responde en Español.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: context,
    });

    return response.text || "Simulación no disponible.";
  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    return "Error al simular el escenario.";
  }
};

// B2C: Personal Financial Coach (Simple Advice)
export const getPersonalFinanceAdvice = async (user: UserProfile, expenses: Expense[], goals: SavingsGoal[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Configura tu API Key para recibir consejos.";

  try {
    // Summarize expenses
    const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
    const categories = expenses.map(e => e.category).join(", ");
    const goalNames = goals.map(g => `${g.title} (Faltan S/${g.targetAmount - g.currentAmount})`).join(", ");

    const context = `
      Actúa como un Coach Financiero Personal llamado "Treevü IA".
      
      Perfil del Usuario:
      - Nombre: ${user.name}
      - Puntaje FWI: ${user.fwiScore} (Bienestar)
      - Gasto Reciente Total: S/ ${totalSpent}
      - Categorías de Gasto: ${categories}
      
      Metas de Ahorro Activas:
      ${goalNames}
      
      TAREA:
      Analiza los gastos recientes y compáralos con sus metas.
      Dame UN solo consejo breve, amigable y ultra-específico (máximo 2 frases) para ayudarle a alcanzar su meta más cercana.
      Usa emojis. Tono motivador, no de regaño. Habla en Español.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });

    return response.text || "¡Sigue ahorrando para alcanzar tus metas!";
  } catch (error) {
    console.error("Gemini Coach Error:", error);
    return "¡Concéntrate en tu meta más importante y reduce gastos hormiga!";
  }
};

// B2C: Conversational Agent (Structured Response)
export const queryFinancialAgent = async (
  user: UserProfile, 
  expenses: Expense[], 
  goals: SavingsGoal[], 
  query: string
): Promise<AIQueryResponse> => {
    const ai = getClient();
    if (!ai) return { 
        ai_response_id: 'err', 
        response_text: "Configura tu API Key para chatear conmigo." 
    };

    const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
    const expenseSummary = expenses.slice(0, 20).map(e => `${e.category}: S/${e.amount}`).join(', ');
    const goalSummary = goals.map(g => `Meta ${g.title} (ID: ${g.id}): S/${g.currentAmount} de S/${g.targetAmount}`).join('; ');

    const context = `
        You are Treevü's Financial Assistant.
        User: ${user.name}. Budget: S/${user.monthlyBudget}.
        Total Spent this month: S/${totalSpent}.
        Recent Expenses: ${expenseSummary}
        Goals: ${goalSummary}
        
        User Query: "${query}"
        
        Instructions:
        1. Answer the user's question in Spanish. Be helpful and concise.
        2. Determine if the user's intent matches a specific action type:
           - VIEW_CATEGORY_DETAILS: User asks about specific category spending.
           - CONFIRM_TRANSFER: User wants to save money or add to a goal.
           - CREATE_GOAL: User wants to start saving for something new.
           - NONE: General question.
        3. Return a JSON object strictly matching this schema:
           {
             "response_text": "string",
             "suggested_action": {
                "action_type": "string", 
                "action_label": "string", 
                "action_payload": {} 
             } 
           }
        4. If action_type is NONE, omit suggested_action or set it to null.
        5. Do not use markdown code blocks. Just return the JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: context,
            config: { responseMimeType: "application/json" }
        });

        const text = response.text;
        if (!text) throw new Error("No AI response");
        
        const result = JSON.parse(text);
        return {
            ai_response_id: `resp-${Date.now()}`,
            response_text: result.response_text,
            suggested_action: result.suggested_action
        };

    } catch (error) {
        console.error("Agent Error:", error);
        return {
            ai_response_id: 'err',
            response_text: "Lo siento, tuve un problema procesando tu consulta. Intenta reformularla."
        };
    }
};

// B2B2C: Merchant Marketing Assistant
export const getMarketingAdvice = async (offers: Offer[], metrics: { revenue: number, ticketAvg: number }): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Configura tu API Key para ver estrategias.";

  try {
    const offerSummary = offers.map(o => `${o.title} (Desc: ${o.discount}%, Redenciones: ${o.redemptions})`).join('; ');

    const context = `
      Actúa como un Experto en Growth Marketing para Comercios.
      
      Datos del Negocio:
      - Ingresos (Periodo): S/ ${metrics.revenue}
      - Ticket Promedio: S/ ${metrics.ticketAvg}
      - Ofertas Activas: ${offerSummary}
      
      TAREA:
      Analiza el rendimiento y sugiere UNA estrategia táctica concreta para aumentar el Ticket Promedio o las Redenciones la próxima semana.
      Sugiere un tipo de oferta (ej: Flash, 2x1, Cross-selling).
      Sé breve (máximo 3 líneas). Tono de negocios, motivador. Español.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });

    return response.text || "Lanza una oferta Flash para aumentar tráfico hoy.";
  } catch (error) {
    console.error("Gemini Merchant Error:", error);
    return "Analiza tus horarios pico y lanza ofertas cuando tengas capacidad ociosa.";
  }
};
