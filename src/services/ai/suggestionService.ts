import { Type } from '@google/genai';
import { callAIApi } from './api';
import { parseJsonFromMarkdown } from '../../utils';

import { CategoriaGasto, TipoComprobante } from '@/types/common';
import { Expense, Product } from '@/types/expense';
import { AISplitSuggestion } from '@/types/ai';

export const getSmartCategorySuggestion = async (razonSocial: string, tipoComprobante: TipoComprobante, previousExpenses: Expense[]): Promise<CategoriaGasto | null> => {
    const similarExpense = previousExpenses.find(e => e.razonSocial.toLowerCase() === razonSocial.toLowerCase());
    if (similarExpense) {
        return similarExpense.categoria;
    }

    const prompt = `Basado en el nombre de un comercio en Perú, ¿cuál es la categoría de gasto más probable? Sé conciso.
    Comercio: "${razonSocial}"
    Tipo de Comprobante: "${tipoComprobante}"
    
    **Contexto de comercios peruanos (Aprendizaje con ejemplos):**
    - Supermercados (ej. 'Wong', 'Plaza Vea', 'Tottus'): Alimentación
    - Grifos (ej. 'Repsol', 'Primax', 'Petroperú'): Transporte
    - Ocio (ej. 'Cineplanet', 'Starbucks', 'Bembos'): Ocio
    - Tiendas de conveniencia (ej. 'Tambo+', 'Oxxo'): Consumos
    - Mejoras del hogar (ej. 'Promart', 'Sodimac'): Vivienda
    - **Barrera de Contención (Guardrail):** Pasarelas de pago (ej. 'Mercado Pago', 'Yape', 'Plin', 'PagoEfectivo'): Si el nombre es uno de estos, la categoría es muy ambigua. En este caso específico, devuelve 'Otros' para que el usuario verifique manualmente.

    Responde únicamente con una de estas opciones en formato JSON: ${Object.values(CategoriaGasto).join(', ')}. Ejemplo: {"category": "Alimentación"}`;
    
     const request = {
      contents: prompt,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  category: { type: Type.STRING }
              }
          }
      }
    };
    
    const text = await callAIApi(request);
    const result = text ? parseJsonFromMarkdown<{ category: CategoriaGasto }>(text.trim()) : null;
    return result?.category || null;
};

export const suggestExpenseSplit = async (products: Product[]): Promise<AISplitSuggestion[] | null> => {
    const prompt = `
        Eres un asistente de compras inteligente. Analiza esta lista de productos y agrúpalos por la categoría de gasto más lógica.
        
        **Lista de Productos:**
        ${JSON.stringify(products)}

        **Instrucciones:**
        1.  Agrupa los productos en categorías lógicas de la lista: ${Object.values(CategoriaGasto).join(', ')}.
        2.  Calcula el subtotal para cada categoría.
        3.  Devuelve un array de objetos en formato JSON estricto. Cada objeto debe tener 'category', 'total', y 'productNames'.
        4.  **Guardrail:** Si todos los productos pertenecen a una sola categoría, devuelve un array con un solo elemento.
    `;
    
    const request = {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                total: { type: Type.NUMBER },
                productNames: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["category", "total", "productNames"]
            }
          }
        }
    };
    const jsonText = await callAIApi(request);
    return jsonText ? parseJsonFromMarkdown<AISplitSuggestion[]>(jsonText) : null;
};
