import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local and .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envPath = path.join(__dirname, '..', '.env');

dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are Demargo Assistant, the friendly AI helper on the Demargo Interior Contractors website in Ghana. Answer any question the client asks — interior design, renovations, materials, décor ideas, general knowledge, or anything else. Be warm, clear, and helpful.

When questions relate to Demargo, use these facts:
- Services: interior design, home renovation, 3D rendering, curtains and blinds, smart home installation, POP ceilings, painting, tiling, and cleaning
- Contact: 0546478040, demargo1987@gmail.com, WhatsApp wa.me/233546478040
- Address: HM8Q+XJR, Gbawe, Accra
- Hours: Mon–Fri 8AM–5PM, Sat 8AM–4PM
- Service areas: Accra, Kumasi, Tema, Takoradi, Cape Coast, and nearby locations
- Fabric Collection page: Users can view our extensive collection of premium fabrics (100% blackout, sheers, etc.) at [Fabric Collection](/fabric-collection).
- Track Project page: Users can track their project status (from measurement, estimate, fabric selection, tailoring to installation) using their phone number at [Track Project](/track).

Always recommend these pages using standard markdown link syntax like [Fabric Collection](/fabric-collection) or [Track Project](/track) when clients ask about fabric choices, curtain materials, or their current order/project status.

For Demargo pricing or bookings, explain that cost depends on scope and encourage a free consultation. Do not invent company-specific facts. If unsure about Demargo details, say so and suggest contacting the team directly.`;

// Initialize the client with API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  console.error('Make sure .env.local file exists in project root with GEMINI_API_KEY=your_key');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  try {
    // Build conversation history
    let conversation = message;
    if (history && Array.isArray(history) && history.length > 0) {
      const historyText = history
        .slice(-8)
        .filter(entry => entry.text && entry.text.trim())
        .map(entry => `${entry.role === 'user' ? 'User' : 'Assistant'}: ${entry.text}`)
        .join('\n');
      conversation = `${historyText}\nUser: ${message}`;
    }

    // Generate response using Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: conversation,
      config: {
        systemInstruction: SYSTEM_PROMPT
      }
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error('Error generating chat content:', error);
    
    // Provide friendly fallback messages
    if (error.message?.includes('API key')) {
      return res.status(200).json({ 
        reply: 'The assistant is not configured correctly yet. Please call 0546478040 or email demargo1987@gmail.com and our team will assist you.' 
      });
    }
    
    res.status(500).json({ error: 'Internal server error while processing chat.' });
  }
});

// For Vercel serverless function export
export default app;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Chatbot server running at http://localhost:${PORT}`);
});
