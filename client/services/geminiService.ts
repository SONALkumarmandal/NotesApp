import { GoogleGenAI, Type } from "@google/genai";
import { Note } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FAST = 'gemini-2.5-flash';
const MODEL_SMART = 'gemini-2.5-flash'; 

export const generateTitle = async (content: string): Promise<string> => {
  try {
    if (!content.trim()) return "untitled vibe";
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Generate a super short, aesthetic title (max 4 words) for this content. Lowercase only. No quotes. Content: ${content.substring(0, 1000)}`,
    });
    return response.text?.trim() || "untitled vibe";
  } catch (error) {
    console.error("Error generating title:", error);
    return "untitled vibe";
  }
};

export const generateTags = async (content: string): Promise<string[]> => {
  try {
    if (!content.trim()) return [];
    
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Generate 4 relevant, trendy one-word tags for this text.`,
      config: {
        systemInstruction: `Analyze the text and return a JSON array of strings. Lowercase. Example: ["inspo", "plans"].`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) return [];
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating tags:", error);
    return [];
  }
};

export const summarizeNote = async (content: string): Promise<string> => {
  try {
    if (!content.trim()) return "nothing to summarize bestie.";
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Give me a tl;dr of this note. Keep it punchy and casual.`,
      config: {
        systemInstruction: `You are a casual, smart assistant. Provide a very concise summary. Use lowercase mostly.`
      }
    });
    return response.text || "couldn't summarize rn.";
  } catch (error) {
    return "error generating summary.";
  }
};

export const polishContent = async (content: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Rewrite this to have better flow and grammar but keep it authentic. Don't make it sound like a corporate robot.`,
      config: {
        systemInstruction: "Return only the rewritten text, no conversational filler."
      }
    });
    return response.text || content;
  } catch (error) {
    console.error("Error polishing content:", error);
    throw error;
  }
};

export const streamChat = async function* (history: { role: 'user' | 'model'; text: string }[], newMessage: string, currentNoteContext: string) {
  try {
    const chat = ai.chats.create({
      model: MODEL_SMART,
      config: {
        systemInstruction: `You are a helpful, chill AI assistant inside a notetaking app. 
        You have access to the user's current note content:
        ---
        ${currentNoteContext}
        ---
        Answer questions based on this note. Be concise, use lowercase often, and match a Gen Z vibe. No cringe slang, just casual.`
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessageStream({ message: newMessage });
    
    for await (const chunk of result) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error in stream chat", error);
    yield "sorry, my brain glitched.";
  }
};