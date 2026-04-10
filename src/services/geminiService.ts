import { GoogleGenAI, Type } from "@google/genai";
import { Workout, FitnessLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateTrainingPlan = async (
  goal: string,
  targetTime: string,
  fitnessLevel: FitnessLevel,
  availability: any,
  startDate: string
): Promise<Partial<Workout>[]> => {
  const prompt = `
    Generate a 12-week half marathon training plan for a ${fitnessLevel} runner.
    Goal: ${goal}
    Target Time: ${targetTime}
    Start Date: ${startDate}
    User Availability: ${JSON.stringify(availability)}
    
    The plan should include:
    - Easy runs
    - One long run per week (usually weekends)
    - One speed workout per week (intervals or tempo)
    - Strength training sessions
    - Rest days
    
    Return the plan as a JSON array of workout objects.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: "ISO date string YYYY-MM-DD" },
            type: { type: Type.STRING, enum: ["easy_run", "long_run", "speed", "strength", "rest"] },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            targetDistance: { type: Type.NUMBER, description: "Distance in km" },
            targetPace: { type: Type.STRING, description: "Target pace range" }
          },
          required: ["date", "type", "title", "description"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const getCoachingAdvice = async (
  recentWorkouts: Workout[],
  sleepData: any,
  weather: any
): Promise<string> => {
  const prompt = `
    You are a supportive but realistic running coach.
    Recent Workouts: ${JSON.stringify(recentWorkouts)}
    Sleep Data: ${JSON.stringify(sleepData)}
    Weather: ${JSON.stringify(weather)}
    
    Provide a short (2-3 sentence) piece of actionable advice for today's training.
    If sleep was poor or weather is extreme, suggest adjustments.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are Pavio, a high-performance fitness coach. Your advice is data-driven, technical, and precise. You focus on efficiency and long-term athletic development. Be concise and professional."
    }
  });

  return response.text || "Keep up the great work! Consistency is key.";
};
