import { GoogleGenAI } from "@google/genai";

const apiKey =
  (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ||
  (import.meta.env.GEMINI_API_KEY as string | undefined) ||
  (process.env.GEMINI_API_KEY as string | undefined) ||
  (process.env.API_KEY as string | undefined);

const useDemoMode = !apiKey;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Analyzes a base64 image frame using Gemini, or returns a demo message when no API key is configured.
 */
export const analyzeFrame = async (base64Image: string): Promise<string> => {
  if (useDemoMode) {
    return "Demo mode active: visual analysis is simulated. Upload a frame or use the local preview to see the interface respond.";
  }

  try {
    // Remove data URL prefix if present for clean base64
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai!.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          {
            text: "You are the AI OS for a pair of smart glasses. Briefly describe what is visible in this frame to the user. Keep it concise, futuristic, and helpful (e.g., 'Object detected: Red sports car. Speed: Static. Danger level: Low.')."
          }
        ]
      }
    });

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error analyzing visual data. Systems offline.";
  }
};
