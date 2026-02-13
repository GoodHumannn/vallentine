import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Image Editing: Uses Gemini 2.5 Flash Image (Nano Banana)
export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from input
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};

// Thinking Mode: Uses Gemini 3 Pro Preview with Thinking Budget
export const generateLoveStory = async (memories: string[]): Promise<string> => {
  try {
    const memoryText = memories.join("\n");
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `We have completed a Valentine's Quest. Here are the notes and memories collected:\n${memoryText}\n\nWrite a short, whimsical, and deeply romantic story summarizing this journey for Devanshi. Keep it under 200 words.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    
    return response.text || "Our story is written in the stars...";
  } catch (error) {
    console.error("Gemini Story Error:", error);
    return "Even AI can't express how much I love you (API Error).";
  }
};
