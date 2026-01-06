
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getEventSuggestions(eventType: string, guestCount: number) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest 3 unique themes and catering ideas for a ${eventType} with ${guestCount} guests in Pakistan. Provide details on decoration, vibe, and a specialty food item for each.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            themeName: { type: Type.STRING },
            vibe: { type: Type.STRING },
            decorIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
            foodSpecialty: { type: Type.STRING }
          },
          required: ['themeName', 'vibe', 'decorIdeas', 'foodSpecialty']
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
}
