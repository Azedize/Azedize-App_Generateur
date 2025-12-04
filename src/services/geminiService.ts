import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure API Key is available
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const getSecurityAdvice = async (query: string): Promise<string> => {
  if (!API_KEY) {
    return "API Key is missing. Please configure the application with a valid Gemini API Key.";
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: "You are an expert cybersecurity consultant named XPass Advisor. Give concise, practical, and easy-to-understand advice about password security and online safety. Keep answers under 150 words."
    });

    const result = await model.generateContent(query);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Connection Error: ${error.message || "Unknown error"}. Please check your API Key and network connection.`;
  }
};