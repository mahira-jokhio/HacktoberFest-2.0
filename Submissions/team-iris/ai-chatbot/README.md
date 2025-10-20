# 🤖 AI Chatbot

### by Team Iris

An intelligent chatbot application built with Next.js, Vercel AI SDK, and modern web technologies. Features persistent chat history, real-time messaging, and a beautiful user interface.

---

## Overview

This AI chatbot application allows users to have interactive conversations with an AI assistant. The app features persistent chat history, so users can continue conversations across sessions, and provides a modern, responsive interface for seamless communication.

Key capabilities:

- **Persistent Chat History**: Conversations are saved and can be resumed at any time
- **Real-time Messaging**: Instant responses with streaming support
- **Modern UI**: Beautiful, responsive design with dark theme
- **Authentication**: Secure user sessions with NextAuth.js
- **Database Integration**: SQLite database with Drizzle ORM for data persistence

---

## How It Works

1. **User Authentication**: Users sign in to access their personalized chat experience
2. **Chat Interface**: Users can start new conversations or continue existing ones
3. **Message Processing**: Messages are sent to the AI service via Vercel AI SDK
4. **Response Streaming**: AI responses are streamed in real-time for better UX
5. **History Persistence**: All conversations and messages are saved to the database

The application uses:

- **Frontend**: Next.js 15 with React 19, Tailwind CSS for styling
- **AI Integration**: Vercel AI SDK with Google AI (Gemini) provider
- **Database**: SQLite with Drizzle ORM for type-safe database operations
- **API Layer**: tRPC for type-safe API routes
- **Authentication**: NextAuth.js for secure user management

---

## Key Features

✅ **Persistent Chat History** - Conversations are saved and can be resumed anytime
✅ **Real-time Responses** - Streaming AI responses for better user experience
✅ **User Authentication** - Secure login system with session management
✅ **Responsive Design** - Works perfectly on desktop and mobile devices
✅ **Modern UI/UX** - Beautiful interface with smooth animations and interactions
✅ **Type Safety** - Full TypeScript implementation with tRPC and Drizzle ORM
✅ **Database Integration** - Reliable SQLite database with proper relationships

---

## Tech Stack

**Frontend:**

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- tRPC (Type-safe API)

**Backend & Database:**

- Next.js API Routes
- SQLite Database
- Drizzle ORM (Type-safe SQL)
- NextAuth.js (Authentication)

**AI Integration:**

- Vercel AI SDK
- Google AI (Gemini) Provider

**Development Tools:**

- ESLint
- Prettier
- TypeScript
- Drizzle Kit (Migrations)
