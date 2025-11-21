/// <reference types="vite/client" />
import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Product } from "../types";

let chatSession: ChatSession | null = null;
let genAI: GoogleGenerativeAI | null = null;

export const initializeChat = (productsContext?: string): ChatSession => {
  // If we have a session but want to update context (or first init)
  // Note: The JS SDK doesn't easily allow updating system instruction of an open chat.
  // For this demo, we will create a new session if a specific context is provided to ensure accuracy.
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    throw new Error("API Key is missing. Please set VITE_GEMINI_API_KEY environment variable.");
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }

  const finalSystemInstruction = productsContext 
    ? `${SYSTEM_INSTRUCTION}\n\nCURRENT LIVE INVENTORY:\n${productsContext}`
    : SYSTEM_INSTRUCTION;

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction: finalSystemInstruction,
  });

  chatSession = model.startChat({
    history: [],
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

    // Re-initialize chat if we have product data to ensure Hootie knows about it
    // In a production app you might handle context differently, but for this storefront
    // ensuring the AI knows the exact inventory is key.
    if (productsContext) {
       chatSession = initializeChat(productsContext);
    } else if (!chatSession) {
       chatSession = initializeChat();
    }

    // Send the message to the chat session
    const chat = chatSession!;
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    return text || "Woof! I'm not sure how to answer that right now.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "Ruh-roh! Something went wrong. Please try again later.";
  }
};
