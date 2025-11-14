import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

// --- Configuration ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
// Enable CORS for all routes to allow frontend requests
app.use(cors());
// Increase payload limit to handle base64 images
app.use(express.json({ limit: '10mb' }));

// --- Gemini API Setup ---
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is not defined in the .env file.");
  console.error("Please create a .env file in the /server directory with the line: API_KEY=your_api_key");
  process.exit(1); // Exit if the key is missing
}
const ai = new GoogleGenAI({ apiKey });

/**
 * Wraps the Gemini API call with an exponential backoff retry mechanism.
 * This function now lives on the server to handle API-side rate limits directly.
 * @param {object} request - The request object for the Gemini API.
 * @param {number} retries - The number of remaining retries.
 * @param {number} delay - The delay in ms for the next retry.
 * @returns {Promise<any>} The response from the Gemini API.
 */
const generateWithBackoff = async (request, retries = 3, delay = 1000) => {
    try {
        const response = await ai.models.generateContent(request);
        return response;
    } catch (error) {
        // Check error message for common retriable HTTP status codes
        const errorMessage = error.toString();
        const isRetriable = errorMessage.includes('429') || errorMessage.includes('503') || errorMessage.includes('RESOURCE_EXHAUSTED');
        
        if (retries > 0 && isRetriable) {
            console.warn(`[Server] Gemini API retriable error detected. Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(res => setTimeout(res, delay));
            return generateWithBackoff(request, retries - 1, delay * 2);
        } else {
            console.error('[Server] Gemini API call failed after retries or with a non-retriable error:', error);
            throw error;
        }
    }
};

// --- Simulated RUC Database ---
const RUC_DATABASE = {
    '20548874679': 'La Lucha Sanguchería Criolla S.A.C.',
    '20332093952': 'Cencosud Retail Peru S.A. (Wong/Metro)',
    '20508565934': 'Hipermercados Tottus S.A.',
    '20100070970': 'Supermercados Peruanos S.A. (Plaza Vea/Vivanda)',
    '20258092771': 'Repsol Comercial S.A.C.',
    '20334861678': 'Corporacion Primax S.A.',
    '20100128218': 'Petroleos del Peru S.A.',
    '20101114670': 'Bembos S.A.C.',
    '20513451859': 'Starbucks Coffee Peru S.R.L.',
    '20100169887': 'Delosi S.A. (KFC/Pizza Hut/Chilis)',
    '20429683581': 'Cineplex S.A. (Cineplanet)',
    '20331901499': 'Cinemark del Peru S.R.L.',
    '20333235661': 'Sodimac Peru S.A.',
    '20536557858': 'Tiendas del Mejoramiento del Hogar S.A. (Promart)',
    '20100128056': 'Saga Falabella S.A.',
    '20100053897': 'Tiendas por Departamento Ripley S.A.',
    '20493020618': 'Tiendas Peruanas S.A. (Oechsle)',
    '20100259589': 'America Movil Peru S.A.C. (Claro)',
    '20100017491': 'Telefonica del Peru S.A.A. (Movistar)',
    '20106205226': 'Entel Peru S.A.',
    '20331923291': 'Luz del Sur S.A.A.',
    '20100152356': 'Servicio de Agua Potable y Alcantarillado de Lima (Sedapal)',
    '20550020681': 'InRetail Pharma S.A. (Inkafarma)',
    '20502353393': 'Boticas y Salud S.A.C.',
    '20562517101': 'Tambo+ S.A.C.',
    '20422899231': 'Minvest, Sociedad Minera S.A.C. (Gildemeister)',
};


// --- API Endpoint ---
app.post('/api/gemini', async (req, res) => {
    const { requestBody } = req.body;

    if (!requestBody || !requestBody.contents) {
        return res.status(400).json({ error: 'INVALID_REQUEST', message: 'Invalid request body. "requestBody" with "contents" is required.' });
    }
    
    // Dynamically select the model from the request, defaulting to flash for efficiency
    const { model: requestedModel = 'gemini-2.5-flash', ...restOfRequestBody } = requestBody;

    console.log(`[${new Date().toISOString()}] Received request for Gemini model: ${requestedModel}...`);

    try {
        const geminiResponse = await generateWithBackoff({
            model: requestedModel,
            ...restOfRequestBody // Spread the rest of the contents and config
        });

        // Explicitly check for safety blocks from the API response
        if (geminiResponse?.candidates?.[0]?.finishReason === 'SAFETY') {
            console.warn(`[${new Date().toISOString()}] Gemini request blocked for safety reasons.`);
            return res.status(400).json({
                error: 'SAFETY_BLOCK',
                message: 'La solicitud o su respuesta fue bloqueada por los filtros de seguridad de la IA. Intenta reformular tu pregunta.'
            });
        }
        
        // Correctly extract text according to the latest @google/genai SDK guidelines.
        const text = geminiResponse.text;

        if (text === undefined || text === null) {
             throw new Error("La respuesta de la IA no contiene texto o está vacía.");
        }
        
        console.log(`[${new Date().toISOString()}] Successfully received response from Gemini.`);
        res.json({ text });
        
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error calling Gemini API:`, error.message);
        // Propagate a more specific error structure to the frontend
        const status = error.message.includes('429') ? 429 : 500;
        res.status(status).json({ 
            error: status === 429 ? 'RATE_LIMIT_EXCEEDED' : 'GEMINI_API_ERROR', 
            message: 'No se pudo obtener una respuesta del servicio de IA en este momento.', 
            details: error.message 
        });
    }
});

// --- RUC Validation Endpoint ---
// In a real app, this would call an external API. Here we simulate it.
app.get('/api/sunat/validate-ruc/:ruc', async (req, res) => {
    const { ruc } = req.params;

    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    if (!ruc || ruc.length !== 11) {
        return res.status(400).json({ isValid: false, message: 'RUC debe tener 11 dígitos.' });
    }
    
    const razonSocial = RUC_DATABASE[ruc];

    if (razonSocial) {
        res.json({ isValid: true, razonSocial, message: 'RUC Válido' });
    } else {
        res.status(404).json({ isValid: false, message: 'RUC no encontrado en la base de datos.' });
    }
});

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log('Ready to proxy requests to Gemini API.');
});