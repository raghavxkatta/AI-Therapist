# MindfulAI

MindfulAI is an AI-powered therapy and mental health support platform. It provides users with empathetic, therapeutic guidance, mood tracking, and crisis detection using advanced AI models.

## Features

- **AI Therapist Chat**: Users interact with a compassionate AI therapist for mental health support.
- **Crisis Detection**: Automatically detects crisis situations and responds with appropriate empathy and guidance.
- **Session Logging**: Stores chat sessions and crisis events securely in a Supabase database.
- **Modern UI**: Uses custom fonts and theming for a clean, accessible interface.
- **Analytics**: Integrated with Vercel Analytics for usage tracking.

## Tech Stack

- **Next.js** (App Router)
- **@ai-sdk/google** (Gemini AI model)
- **Supabase** (Database)
- **@fontsource/geist-sans, geist-mono** (Typography)
- **Vercel Analytics**

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Add your Supabase credentials.
   - Add your Google Gemini API key.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

- **POST `/api/chat`**  
  Send a message to the AI therapist.  
  **Body:**  
  ```json
  {
    "message": "Your message",
    "userId": "user-id",
    "sessionId": "session-id" // optional
  }
  ```
  **Response:**  
  - `response`: AI-generated reply
  - `crisisDetected`: boolean
  - `crisisLevel`: string

## License

MIT

---

*For educational and support purposes only. Not a substitute for professional mental health care.*