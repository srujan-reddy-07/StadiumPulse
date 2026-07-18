import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MOCK_TRANSLATIONS = {
  en: {
    gate: (seat) => `Gate A is currently experiencing high congestion (about a 28-minute wait). For faster entry to your seat at ${seat}, we recommend routing to Gate B (7 min wait) or Gate D (9 min wait).`,
    medical: () => `The nearest medical cooling bay is in Section 224 on the Upper Level East Corridor. If you feel unwell, please notify the nearest stadium host immediately.`,
    concession: () => `For concessions, Stand 1 (Jersey Eats) and Stand 2 (Liberty Grill) are running optimally with wait times under 7 minutes. Stand 4 is currently experiencing queue delays.`,
    default: (seat) => `Hello! Welcome to MetLife Stadium for the FIFA World Cup 2026. You are seated in ${seat}. How can I assist you with navigation, concessions, or stadium facilities today?`
  },
  es: {
    gate: (seat) => `La Puerta A (Gate A) está experimentando una congestión alta (espera de 28 minutos). Para un ingreso más rápido a su asiento en ${seat}, le recomendamos dirigirse a la Puerta B (7 min de espera) o la Puerta D (9 min de espera).`,
    medical: () => `El centro de enfriamiento médico más cercano se encuentra en la Sección 224, en el corredor este del nivel superior. Si no se siente bien, busque a un asistente de hospitalidad de inmediato.`,
    concession: () => `Para alimentos y bebidas, el Puesto 1 (Jersey Eats) y el Puesto 2 (Liberty Grill) operan de manera óptima con esperas menores a 7 minutos. El Puesto 4 registra demoras en este momento.`,
    default: (seat) => `¡Hola! Bienvenido al MetLife Stadium para la Copa Mundial de la FIFA 2026. Su asiento está en ${seat}. ¿En qué puedo ayudarle hoy respecto a navegación, comida o servicios del estadio?`
  },
  fr: {
    gate: (seat) => `La porte A (Gate A) connaît actuellement un fort encombrement (environ 28 minutes d'attente). Pour un accès plus rapide à votre siège en ${seat}, nous vous conseillons de passer par la porte B (7 min d'attente) ou la porte D (9 min d'attente).`,
    medical: () => `Le poste de rafraîchissement médical le plus proche est situé dans la section 224, dans le couloir est du niveau supérieur. Si vous ne vous sentez pas bien, veuillez contacter immédiatement un agent d'accueil.`,
    concession: () => `Pour la restauration, le stand 1 (Jersey Eats) et le stand 2 (Liberty Grill) fonctionnent de manière optimale avec moins de 7 minutes d'attente. Le stand 4 est actuellement ralenti.`,
    default: (seat) => `Bonjour ! Bienvenue au MetLife Stadium pour la Coupe du Monde de la FIFA 2026. Votre siège est situé en ${seat}. Comment puis-je vous aider aujourd'hui concernant l'orientation, les concessions ou les services ?`
  }
};

/**
 * Chat Endpoint
 * Receives the fan's message, language, and seat location context,
 * then returns a localized assistant response from Gemini or mock fallback.
 */
export async function POST(request) {
  try {
    const { message = "", language = "en", seat = "General Admission" } = await request.json();
    const normalizedLang = ["en", "es", "fr"].includes(language.toLowerCase()) ? language.toLowerCase() : "en";
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY missing from environment. Using local multilingual concierge engine.");
      return NextResponse.json({
        success: true,
        reply: generateMockReply(message, normalizedLang, seat),
        source: "Local Multilingual Mock Engine"
      });
    }

    const systemPrompt = `You are the Multilingual FIFA World Cup 2026 Concierge at MetLife Stadium.
Your primary role is to assist global fans attending the match.
You should provide clear, polite, and helpful responses in the fan's requested language.
Address details about gate queues (recommending Gate B/C/D over congested Gate A), concessions (recommending Stand 1/2 over Stand 4), medical bays, safety notices, and navigation.

Fan Context:
- Language Preference: ${normalizedLang}
- Seat Location: ${seat}

Provide answers tailored to their seat location. Keep responses concise, supportive, and under 3-4 sentences. Format the response directly in the target language (${normalizedLang}).`;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const chat = model.startChat({
        history: [],
        generationConfig: { maxOutputTokens: 250 }
      });

      const prompt = `System instructions: ${systemPrompt}\nFan message: "${message}"`;
      const result = await chat.sendMessage(prompt);
      const replyText = result.response.text().trim();

      return NextResponse.json({
        success: true,
        reply: replyText,
        source: "Google Gemini API (gemini-1.5-flash)"
      });
    } catch (apiError) {
      console.error("Gemini API Chat routing failed. Falling back to local concierge. Details:", apiError);
      return NextResponse.json({
        success: true,
        reply: generateMockReply(message, normalizedLang, seat),
        source: `Local Fallback Engine (Error: ${apiError.message})`
      });
    }
  } catch (error) {
    console.error("Error in StadiumPulse Chat API:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

// Selects the best localized matching mock response
function generateMockReply(message, lang, seat) {
  const query = message.toLowerCase();
  const dict = MOCK_TRANSLATIONS[lang] || MOCK_TRANSLATIONS.en;

  if (query.includes("gate") || query.includes("puerta") || query.includes("porte") || query.includes("ingress") || query.includes("entrer")) {
    return dict.gate(seat);
  }
  if (query.includes("medical") || query.includes("cooling") || query.includes("médical") || query.includes("salud") || query.includes("secours")) {
    return dict.medical();
  }
  if (query.includes("concession") || query.includes("food") || query.includes("drink") || query.includes("comida") || query.includes("manger") || query.includes("boire")) {
    return dict.concession();
  }
  return dict.default(seat);
}
