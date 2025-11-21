
import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Product } from "../types";

let chatSession: Chat | null = null;

export const initializeChat = (productsContext?: string): Chat => {
  // If we have a session but want to update context (or first init)
  // Note: The JS SDK doesn't easily allow updating system instruction of an open chat.
  // For this demo, we will create a new session if a specific context is provided to ensure accuracy.
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const finalSystemInstruction = productsContext 
    ? `${SYSTEM_INSTRUCTION}\n\nCURRENT LIVE INVENTORY:\n${productsContext}`
    : SYSTEM_INSTRUCTION;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: finalSystemInstruction,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string, products?: Product[]): Promise<string> => {
  try {
    // Format product context if available
    let productsContext = '';
    if (products && products.length > 0) {
      productsContext = JSON.stringify(products.map(p => 
        `${p.name} ($${p.price}) [${p.category}]`
      )).replace(/"/g, "'");
    }

    // Re-initialize chat if we have new product data to ensure Hootie knows about it
    // In a production app you might handle context differently, but for this storefront
    // ensuring the AI knows the exact inventory is key.
    if (productsContext && !chatSession) {
       initializeChat(productsContext);
    } else if (!chatSession) {
       initializeChat();
    }

    // Fallback: If session exists, we just send the message. 
    // Ideally we would inject context into the prompt if the session was already open,
    // but re-init is cleaner for this specific "Storefront" use case where inventory loads once.
    
    const chat = chatSession!;
    const response = await chat.sendMessage({ message });
    return response.text || "Woof! I'm not sure how to answer that right now.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "Ruh-roh! Something went wrong. Please try again later.";
  }
};
