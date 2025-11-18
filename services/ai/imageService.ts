
import { Type } from '@google/genai';
import { callAIApi } from './api';
import { parseJsonFromMarkdown } from '../../utils';

import { CategoriaGasto, TipoComprobante } from '../../types/common';
import { ExpenseData, Product, VerificationResult } from '../../types/expense';

export const KNOWN_RUCS: { [key: string]: string } = {
    'wong': '20332093952',
    'metro': '20332093952', // Cencosud
    'tottus': '20508565934',
    'plaza vea': '20100070970',
    'vivanda': '20100070970', // Supermercados Peruanos S.A.
    'mass': '20100070970',
    'repsol': '20258092771',
    'primax': '20334861678',
    'petroperu': '20100128218',
    'la lucha sangucheria criolla': '20548874679',
    'la lucha sanguchería': '20548874679',
    'la lucha': '20548874679',
    'bembos': '20101114670',
    'starbucks': '20513451859',
    'kfc': '20100169887',
    'pizza hut': '20100169887', // Delosi S.A.
    'chilis': '20100169887',
    'madam tusan': '20100169887',
    'cineplanet': '20429683581',
    'cinemark': '20331901499',
    'sodimac': '20333235661',
    'promart': '20536557858',
    'saga falabella': '20100128056',
    'ripley': '20100053897',
    'oechsle': '20493020618',
    'claro': '20100259589',
    'movistar': '20100017491',
    'entel': '20106205226',
    'luz del sur': '20331923291',
    'sedapal': '20100152356',
    'inkafarma': '20550020681',
    'boticas y salud': '20502353393',
    'tambo': '20562517101',
    'gildemeister': '20422899231'
};

export const normalizeName = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/s\.a\.c\.|s\.a\.|e\.i\.r\.l\./g, '') // remove company suffixes
        .replace(/[.,-]/g, '') // remove punctuation
        .trim();
};

export const extractExpenseDataFromImage = async (base64Image: string, mimeType: string): Promise<ExpenseData | null> => {
    const prompt = `Actúa como un data entry experto y meticuloso, especializado en comprobantes de pago peruanos. Analiza la imagen y extrae la información en formato JSON estricto.
    
    **Reglas Clave y Barreras de Contención (Guardrails):**
    - Para 'razonSocial', extrae el nombre comercial principal.
    - Para 'ruc', si no es visible, usa "N/A".
    - Para 'fecha', normaliza a formato YYYY-MM-DD. Si es ambiguo, usa la fecha de hoy.
    - Para 'total', extrae solo el número, ignora símbolos de moneda (S/, $).
    - **Si la imagen es completamente ilegible o no es un comprobante, devuelve null en todos los campos en lugar de inventar datos.**
    - El 'mensaje' debe ser una frase CORTA y siempre alineada con la gamificación (ej. '¡Cosecha registrada!', '¡Otra semilla plantada!').

    **Campos a extraer:**
    - razonSocial (string)
    - ruc (string)
    - fecha (string en formato YYYY-MM-DD)
    - total (number)
    - categoria (enum: ${Object.values(CategoriaGasto).join(', ')})
    - tipoComprobante (enum: ${Object.values(TipoComprobante).join(', ')})
    - esFormal (boolean)
    - ahorroPerdido (number, calcula el 18% del total si es informal, si no, 0)
    - igv (number, calcula el 18/118 del total si es formal, si no, 0)
    - mensaje (string)
    
    El JSON debe ser \`\`\`json\n{...}\`\`\``;
    
    const request = {
      model: 'gemini-2.5-pro',
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: base64Image } }
        ]
      }],
       config: {
         responseMimeType: "application/json",
         responseSchema: {
            type: Type.OBJECT,
            properties: {
                razonSocial: { type: Type.STRING },
                ruc: { type: Type.STRING },
                fecha: { type: Type.STRING },
                total: { type: Type.NUMBER },
                categoria: { type: Type.STRING },
                tipoComprobante: { type: Type.STRING },
                esFormal: { type: Type.BOOLEAN },
                ahorroPerdido: { type: Type.NUMBER },
                igv: { type: Type.NUMBER },
                mensaje: { type: Type.STRING },
            }
         }
      }
    };

    const jsonText = await callAIApi(request);
    let expenseData = jsonText ? parseJsonFromMarkdown<ExpenseData>(jsonText) : null;

    // --- Post-processing to enrich with known RUCs ---
    if (expenseData && expenseData.razonSocial && (!expenseData.ruc || expenseData.ruc === 'N/A')) {
        const normalizedRazonSocial = normalizeName(expenseData.razonSocial);
        
        // Find if any key in KNOWN_RUCS is a substring of the normalized name
        const knownMerchantKey = Object.keys(KNOWN_RUCS).find(key => normalizedRazonSocial.includes(key));
        
        if (knownMerchantKey) {
            expenseData.ruc = KNOWN_RUCS[knownMerchantKey];
            console.log(`[RUC Enrichment] Matched "${expenseData.razonSocial}" to known RUC: ${expenseData.ruc}`);
        }
    }
    
    return expenseData;
};

export const extractProductsFromImage = async (base64Image: string, mimeType: string): Promise<Product[] | null> => {
    const prompt = `Analiza esta imagen, que puede ser una foto de productos o un recibo informal. Extrae una lista de productos con su precio estimado. El formato debe ser un array JSON estricto: \`\`\`json\n[{"productName": "string", "estimatedPrice": number}]\`\`\`. Si no puedes identificar productos, devuelve un array vacío.`;
    
    const request = {
      model: 'gemini-2.5-pro',
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: base64Image } }
        ]
      }],
       config: {
         responseMimeType: "application/json",
         responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    productName: { type: Type.STRING },
                    estimatedPrice: { type: Type.NUMBER },
                }
            }
         }
      }
    };
    const jsonText = await callAIApi(request);
    return jsonText ? parseJsonFromMarkdown<Product[]>(jsonText) : null;
};

export const suggestReceiptType = async (source: { base64: string, mimeType: string } | { url: string }): Promise<TipoComprobante | null> => {
    const prompt = `Analiza la imagen de este comprobante y determina el tipo de comprobante más probable. Responde solo con una de estas opciones en formato JSON: ${Object.values(TipoComprobante).join(', ')}. Ejemplo: {"receiptType": "Boleta de Venta Electrónica"}`;

    const contentParts: any[] = [{ text: prompt }];
    if ('base64' in source) {
         contentParts.push({ inlineData: { data: source.base64, mimeType: source.mimeType } });
    }

    const request = {
      model: 'gemini-2.5-flash',
      contents: [{ parts: contentParts }],
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  receiptType: { type: Type.STRING }
              }
          }
      }
    };
    
    const text = await callAIApi(request);
    const result = text ? parseJsonFromMarkdown<{ receiptType: TipoComprobante }>(text.trim()) : null;
    return result?.receiptType || null;
};

export const verifyReceiptValidity = async (base64Image: string, mimeType: string): Promise<VerificationResult | null> => {
    const today = new Date().toISOString().split('T')[0];
    const prompt = `
      Actúa como un experto de SUNAT. La fecha actual es ${today} Analiza esta imagen de un comprobante de pago peruano.
      Valida los puntos clave para determinar si podría ser usado para la deducción de impuestos.
      
      **Checklist de Verificación (Chain-of-Thought):**
      1.  **RUC Válido:** ¿Es visible y parece tener 11 dígitos?
      2.  **Razón Social Legible:** ¿Se puede leer el nombre del comercio?
      3.  **Fecha Clara:** ¿La fecha es visible?
      4.  **Monto Visible:** ¿Se puede leer el monto total?
      5.  **Tipo Identificable:** ¿Se puede identificar si es Boleta, Factura, Recibo, etc.?
      6.  **Parece Electrónico:** ¿Incluye frases como "representación impresa de la boleta de venta electrónica"?
      
      **Instrucciones de Respuesta:**
      - Completa el array 'checks' con 'valid: true/false' y una 'reason' corta para cada item.
      - Determina 'isValidForDeduction' (true si la mayoría de los puntos clave son válidos).
      - Escribe un 'overallVerdict' conciso.
      - Si no es válido, explica el problema principal en 'reasonForInvalidity'.
      
      Responde en formato JSON estricto.
    `;
    const request = {
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }, { inlineData: { data: base64Image, mimeType } }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                checks: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            item: { type: Type.STRING },
                            valid: { type: Type.BOOLEAN },
                            reason: { type: Type.STRING }
                        }
                    }
                },
                isValidForDeduction: { type: Type.BOOLEAN },
                overallVerdict: { type: Type.STRING },
                reasonForInvalidity: { type: Type.STRING, nullable: true }
            }
          }
        }
    };
    const jsonText = await callAIApi(request);
    return jsonText ? parseJsonFromMarkdown<VerificationResult>(jsonText) : null;
};