/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getAISuggestions = async (goal: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Break down the following goal into 5-8 actionable subtasks with estimated durations and priorities (High, Medium, Low). Goal: "${goal}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              priority: { type: "string", enum: ["High", "Medium", "Low"] },
              duration: { type: "string" },
            },
            required: ["title", "priority"],
          },
        },
      },
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const planMyDay = async (tasks: string[], freeSlots: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Plan my day by scheduling these tasks into these free time slots. Tasks: ${tasks.join(', ')}. Free Slots: ${freeSlots.join(', ')}.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              task: { type: "string" },
              time: { type: "string" },
            },
            required: ["task", "time"],
          },
        },
      },
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const askDopaChat = async (query: string, history: { role: string; text: string }[]) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction: "You are Dopa, a high-energy, Gen Z-friendly productivity coach. You celebrate small wins loudly and use Gen Z slang like 'crushed it', 'stacking tokens', 'boss energy', etc. Keep responses short, punchy, and motivating.",
      },
    });

    // Note: sendMessage only accepts message parameter
    const response = await chat.sendMessage({ message: query });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oops, something slipped — let's try again! 👑";
  }
};
