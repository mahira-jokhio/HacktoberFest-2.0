import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { roomType } = await req.json();

    if (!roomType) {
      return new Response("Room type is required", { status: 400 });
    }

    // Use Gemini AI to analyze the room and provide organization suggestions
    const analysisPrompt = `You are a professional interior organizer. I need you to analyze a ${roomType} and provide detailed, practical organization suggestions.

    Based on typical ${roomType} layouts and common organization challenges, please provide:

    1. Assessment of current layout issues
    2. Furniture rearrangement recommendations
    3. Storage solutions and organization systems
    4. Space optimization strategies
    5. Daily maintenance tips
    6. Budget-friendly improvement ideas

    Make these suggestions specific, actionable, and realistic for a typical ${roomType}.`;

    // Generate AI-powered organization suggestions using Gemini
    const aiResponse = await generateText({
      model: google("gemini-2.0-flash-lite"),
      prompt: analysisPrompt,
    });

    return new Response(
      JSON.stringify({
        aiDescription: aiResponse.text,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Room organization error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to organize room",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Fallback tips for when AI is unavailable
function getFallbackTips(roomType: string): string[] {
  const fallbackTips: Record<string, string[]> = {
    living_room: [
      "Place the sofa against the longest wall to create a focal point",
      "Use area rugs to define different zones in the room",
      "Install floating shelves for books and decorative items",
      "Position the TV at eye level, opposite the main seating area",
      "Add storage ottomans that double as coffee tables",
      "Use vertical space with tall bookcases or wall-mounted storage",
      "Create a reading nook with a comfortable chair and good lighting",
      "Organize remotes and small items in decorative baskets",
    ],
    bedroom: [
      "Position the bed against the center of the main wall for symmetry",
      "Use under-bed storage containers for seasonal items",
      "Install bedside tables with drawers for personal items",
      "Add a dresser or armoire for clothing storage",
      "Create a dedicated workspace if needed",
      "Use closet organizers and hanging shelves",
      "Add a full-length mirror on the back of the door",
      "Install dimmable lighting for different moods",
    ],
    kitchen: [
      "Organize cabinets by frequency of use",
      "Install pull-out drawers in lower cabinets",
      "Use vertical space with hanging pot racks",
      "Add a kitchen island for additional workspace",
      "Install magnetic strips for knife storage",
      "Use clear containers for pantry organization",
      "Add a spice rack near the cooking area",
      "Install recycling and waste bins under the sink",
    ],
    office: [
      "Position desk to face natural light or away from distractions",
      "Use cable management solutions for a clean workspace",
      "Install wall-mounted shelves for books and files",
      "Add ergonomic seating and proper lighting",
      "Create zones for different activities (computer work, reading, etc.)",
      "Use drawer organizers for office supplies",
      "Install a corkboard or whiteboard for notes and reminders",
      "Add plants for better air quality and reduced stress",
    ],
  };

  return fallbackTips[roomType] || fallbackTips.living_room;
}
