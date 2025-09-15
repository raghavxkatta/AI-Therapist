# MindfulAI - AI-Powered Therapy & Mental Health Platform

A comprehensive mental health platform powered by Google's Gemini AI, built with Next.js 14, Supabase, and Framer Motion.

## 🌟 Features

### Core Functionality
- **AI Therapy Chat**: Conversational AI therapist powered by Google Gemini 2.0 Flash
- **Crisis Detection**: Automatic detection and response to mental health crises
- **Mood Tracking**: Track and visualize emotional patterns over time
- **Session Management**: Persistent chat sessions with full history
- **User Authentication**: Secure authentication with Supabase Auth

### Therapeutic Activities
- **Breathing Exercises**: Guided breathing for relaxation and anxiety management
- **Zen Garden**: Interactive sand drawing for mindfulness
- **Forest Walk**: Virtual nature experiences for stress relief
- **Ocean Waves**: Calming ambient sounds for meditation

### Professional Features
- **Professional UI/UX**: Glass morphism design with smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Comprehensive dark/light theme switching
- **Accessibility**: WCAG compliant with screen reader support
- **Real-time Updates**: Live chat updates and notifications

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication & authorization
- **Vercel AI SDK** - AI integration framework
- **Google Gemini API** - Advanced language model

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google AI API key

### Environment Variables
Create a `.env.local` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`

### Setup Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd mindful-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (see Database Schema section)
   - Configure authentication providers
   - Set up Row Level Security policies

4. **Configure Google AI**
   - Get a Gemini API key from Google AI Studio
   - Add the key to your environment variables

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗄️ Database Schema

### Core Tables

\`\`\`sql
-- User profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood tracking
CREATE TABLE mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crisis events
CREATE TABLE crisis_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_id UUID REFERENCES chat_sessions,
  message_content TEXT NOT NULL,
  crisis_level TEXT NOT NULL CHECK (crisis_level IN ('low', 'medium', 'high')),
  keywords_detected TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## 🔐 Security Features

- **Row Level Security (RLS)**: All data is protected with Supabase RLS policies
- **Authentication**: Secure email/password authentication with Supabase Auth
- **API Security**: Server-side API routes with proper error handling
- **Environment Variables**: Sensitive data stored securely in environment variables
- **HTTPS**: All communications encrypted in production

## 🎨 Design System

### Color Palette
- **Primary**: Calming blue tones for trust and stability
- **Secondary**: Soft grays for balance and neutrality
- **Accent**: Warm amber for positive interactions
- **Background**: Light/dark adaptive with glass morphism effects

### Typography
- **Headings**: Geist Sans - Clean, modern sans-serif
- **Body**: Geist Sans - Optimized for readability
- **Code**: Geist Mono - Monospace for technical content

### Animations
- **Framer Motion**: Smooth page transitions and micro-interactions
- **CSS Animations**: Custom keyframes for breathing exercises and ambient effects
- **Hover States**: Subtle feedback for all interactive elements

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 📱 Mobile Support

- **Responsive Design**: Optimized for all screen sizes
- **Touch Interactions**: Mobile-friendly touch targets
- **Progressive Web App**: Can be installed on mobile devices
- **Offline Support**: Basic offline functionality for core features

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features via GitHub Issues
- **Community**: Join our Discord community for support and discussions

## 🙏 Acknowledgments

- **Google AI**: For providing the Gemini API
- **Supabase**: For the excellent backend-as-a-service platform
- **Vercel**: For hosting and deployment infrastructure
- **Open Source Community**: For the amazing tools and libraries

---

**⚠️ Important Note**: This application is designed to provide supportive conversations and mental health resources. It is not a replacement for professional mental health care. If you're experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.

**Crisis Resources**:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/
