
import { GoogleGenAI, Type } from "@google/genai";
import { ExpenseAnalysis } from "../types";

// Initialize the client using the environment variable directly as per guidelines.
// This allows the bundler to replace process.env.API_KEY inline without needing a process polyfill.
let ai: GoogleGenAI | null = null;
try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } else {
    console.warn("API_KEY is missing. Gemini features will use fallback mocks.");
  }
} catch (e) {
  console.warn("Failed to initialize GoogleGenAI. Using fallback mocks.", e);
}

export const classifyExpense = async (inputText: string): Promise<ExpenseAnalysis> => {
  try {
    if (!ai) throw new Error("AI not initialized");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Actúa como el motor financiero de Treevü. Analiza este gasto: "${inputText}". 
      1. Extrae comercio, monto y categoría (Alimentos, Transporte, Ocio, Servicios, Salud).
      2. Determina si es discrecional.
      3. Simula un "Impacto Presupuestario" lógico para esa categoría (ej: si es Ocio, asume un presupuesto semanal de 100).
      4. Sugiere una "Acción Inteligente": Si es gasto hormiga -> sugerir Ahorro. Si es compra recurrente -> sugerir Oferta.
      Responde SOLO en JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            isDiscretionary: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
            dateContext: { type: Type.STRING, enum: ['today', 'yesterday', 'past'] },
            budgetImpact: {
              type: Type.OBJECT,
              properties: {
                categoryLimit: { type: Type.NUMBER },
                remainingAfter: { type: Type.NUMBER },
                percentUsed: { type: Type.NUMBER },
                status: { type: Type.STRING, enum: ['safe', 'warning', 'critical'] }
              },
              required: ['categoryLimit', 'remainingAfter', 'percentUsed', 'status']
            },
            suggestedAction: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ['save', 'offer'] },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                actionId: { type: Type.STRING }
              },
              required: ['type', 'title', 'description', 'actionId']
            }
          },
          required: ["merchant", "amount", "category", "isDiscretionary", "confidence", "dateContext", "budgetImpact", "suggestedAction"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const analysis = JSON.parse(text) as ExpenseAnalysis;
    
    // Simulate Data Moat logging
    console.log("[DATA MOAT] EXPENSE_DECLARED_AI_PROCESSED", {
      input_method: 'nlp_text',
      processing_latency_ms: Math.floor(Math.random() * 500) + 200, // Simulated
      ai_confidence: analysis.confidence
    });

    return analysis;
  } catch (error) {
    console.error("Gemini classification failed:", error);
    // Fallback for demo purposes if API key fails or network error
    return {
      merchant: "Comercio Desconocido",
      amount: 0,
      category: "General",
      isDiscretionary: true,
      confidence: 0,
      dateContext: 'today',
      budgetImpact: {
        categoryLimit: 200,
        remainingAfter: 150,
        percentUsed: 25,
        status: 'safe'
      },
      suggestedAction: {
        type: 'save',
        title: 'Ahorra el cambio',
        description: 'Redondea y guarda en tu meta.',
        actionId: 'g1'
      }
    };
  }
};

export const getFinancialAdvice = async (fwiScore: number, recentTransactions: any[]) => {
   try {
    if (!ai) throw new Error("AI not initialized");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `El usuario tiene un Puntaje de Bienestar Financiero de ${fwiScore}/100. Transacciones recientes: ${JSON.stringify(recentTransactions.slice(0, 3))}. Dame una sola frase corta (Nudge) de recomendación o aliento en español latino neutro.`,
    });
    return response.text || "Revisa tus gastos hormiga para mejorar tu puntaje esta semana.";
   } catch (error) {
     return "Revisa tus gastos hormiga para mejorar tu puntaje esta semana.";
   }
};

export const getOfferPitch = async (offerTitle: string, fwiScore: number) => {
  try {
    if (!ai) throw new Error("AI not initialized");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Eres un redactor UX experto. Escribe un pitch de venta PERSUASIVO de máximo 8 palabras para la oferta: "${offerTitle}".
      Contexto Usuario: Score Financiero ${fwiScore}/100.
      Instrucción CRÍTICA: Responde SOLAMENTE con el texto del pitch. NO uses markdown, NO uses negritas (**), NO uses comillas, NO des explicaciones previas ni posteriores. Solo el texto plano.`,
    });
    
    let text = response.text || "Oferta exclusiva para ti.";
    // Post-processing to strip any accidental markdown or quotes
    text = text.replace(/\*\*/g, '').replace(/"/g, '').replace(/^Pitch:\s*/i, '').trim();
    
    return text;
  } catch (error) {
    return "Oferta exclusiva para ti.";
  }
};

export const chatWithFinancialAdvisor = async (userMessage: string, fwiScore: number, income: number, transactions: any[]) => {
  try {
    if (!ai) throw new Error("AI not initialized");
    const context = `
      Eres "Treevü Brain", un asistente financiero experto y empático.
      PERFIL DEL USUARIO:
      - FWI Score: ${fwiScore}/100 (Indice de Bienestar Financiero)
      - Ingreso Mensual: $${income}
      - Transacciones recientes: ${JSON.stringify(transactions.slice(0, 5))}
      
      OBJETIVO:
      Ayuda al usuario a tomar mejores decisiones. Sé conciso, directo y usa emojis ocasionalmente. 
      Si el usuario pregunta por gastos, analiza sus transacciones recientes.
      Si el usuario pregunta cómo mejorar su score, sugiere reducir gastos discrecionales o ahorrar.
      Responde en español latino neutro. Mantén la respuesta bajo 50 palabras si es posible.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: 'user', parts: [{ text: context }] },
        { role: 'user', parts: [{ text: userMessage }] }
      ]
    });
    return response.text || "Lo siento, estoy recalculando mis redes neuronales. ¿Puedes preguntar de nuevo?";
  } catch (error) {
    console.error("Chat error:", error);
    return "Tengo problemas conectando con el servidor de análisis. Intenta más tarde.";
  }
};

export const generateSmartOffer = async (topOffers: { title: string, conversions: number }[]) => {
  try {
    if (!ai) throw new Error("AI not initialized");
    
    const prompt = `
      Actúa como un experto en Marketing para Comercios. 
      Basado en estas ofertas exitosas anteriores del comercio: ${JSON.stringify(topOffers)},
      sugiere una NUEVA oferta (Smart Offer) diseñada para maximizar conversiones.
      
      La oferta debe ser atractiva pero sostenible.
      Responde SOLO en JSON con este formato:
      {
        "suggestedTitle": "Título corto y pegadizo",
        "suggestedDiscount": "ej: 25% OFF o 2x1",
        "rationale": "Breve explicación de por qué funcionará (basado en los datos)"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedTitle: { type: Type.STRING },
            suggestedDiscount: { type: Type.STRING },
            rationale: { type: Type.STRING }
          },
          required: ["suggestedTitle", "suggestedDiscount", "rationale"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    return JSON.parse(text) as { suggestedTitle: string, suggestedDiscount: string, rationale: string };

  } catch (error) {
    console.error("Smart Offer generation failed", error);
    return {
      suggestedTitle: "Pack Ahorro Familiar",
      suggestedDiscount: "15% OFF",
      rationale: "Basado en el éxito de tus ofertas de canasta básica."
    };
  }
};
