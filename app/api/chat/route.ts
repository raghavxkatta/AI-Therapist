import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { createClient } from "@/lib/supabase/server"
import { detectCrisis } from "@/lib/crisis-detection"

export async function POST(request: NextRequest) {
  try {
    const { message, userId, sessionId } = await request.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const geminiModel = google("gemini-2.0-flash");

    // Crisis detection
    const crisisResult = detectCrisis(message)

    // Create system prompt based on crisis detection
    const systemPrompt = crisisResult.detected
      ? `You are a compassionate AI therapist trained in crisis intervention. The user may be experiencing ${crisisResult.level} level distress. Respond with immediate empathy, validate their feelings, and gently guide them toward professional help if needed. Be supportive but clear about the importance of professional crisis support when appropriate.

User message: "${message}"`
      : `You are a compassionate AI therapist. Provide empathetic, therapeutic guidance. Listen actively, validate emotions, and offer helpful coping strategies. Keep responses supportive and professional.

User message: "${message}"`

    const { text } = await generateText({
      model: geminiModel,
      prompt: systemPrompt,
      maxTokens: 500,
      temperature: 0.7,
    })

    // Save to database if sessionId provided
    if (sessionId) {
      const supabase = await createClient()

      // Save AI response to database
      await supabase.from("messages").insert({
        content: text,
        role: "assistant",
        session_id: sessionId,
        user_id: userId,
      })

      // Log crisis event if detected
      if (crisisResult.detected) {
        await supabase.from("crisis_events").insert({
          user_id: userId,
          session_id: sessionId,
          message_content: message,
          crisis_level: crisisResult.level,
          keywords_detected: crisisResult.keywords,
        })
      }
    }

    return NextResponse.json({
      response: text,
      crisisDetected: crisisResult.detected,
      crisisLevel: crisisResult.level,
    })
  }  catch (error) {
  console.error("Chat API Error:", error)
  // You can also add more details to the response for debugging
  return NextResponse.json(
    {
      error: "Failed to generate response",
      details: (error as Error).message || "An unknown error occurred.",
      response: "I'm here to listen and support you. Could you tell me more about what's on your mind?",
    },
    { status: 500 },
  )
}
}