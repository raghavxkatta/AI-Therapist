"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { CrisisAlert } from "@/components/crisis/crisis-alert"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  created_at: string
}

interface ChatSession {
  id: string
  title: string
  created_at: string
}

interface ChatInterfaceProps {
  userId: string
}

export function ChatInterface({ userId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [crisisDetected, setCrisisDetected] = useState(false)
  const [crisisLevel, setCrisisLevel] = useState<"low" | "medium" | "high" | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    const { data } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (data) {
      setSessions(data)
      if (data.length > 0 && !currentSessionId) {
        setCurrentSessionId(data[0].id)
        loadMessages(data[0].id)
      }
    }
  }

  const loadMessages = async (sessionId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    if (data) {
      setMessages(data)
    }
  }

  const createNewSession = async () => {
    const { data } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: userId,
        title: "New Session",
      })
      .select()
      .single()

    if (data) {
      setSessions([data, ...sessions])
      setCurrentSessionId(data.id)
      setMessages([])
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    let sessionId = currentSessionId
    if (!sessionId) {
      const { data } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: userId,
          title: input.slice(0, 50) + "...",
        })
        .select()
        .single()

      if (data) {
        sessionId = data.id
        setCurrentSessionId(sessionId)
        setSessions([data, ...sessions])
      }
    }

    const userMessage = {
      content: input,
      role: "user" as const,
      session_id: sessionId,
      user_id: userId,
    }

    // Add user message to database
    const { data: savedUserMessage } = await supabase.from("messages").insert(userMessage).select().single()

    if (savedUserMessage) {
      setMessages((prev) => [...prev, savedUserMessage])
    }

    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          userId,
          sessionId,
        }),
      })

      const data = await response.json()

      if (data.crisisDetected) {
        setCrisisDetected(true)
        setCrisisLevel(data.crisisLevel)
      }

      if (data.response) {
        const assistantMessage = {
          content: data.response,
          role: "assistant" as const,
          session_id: sessionId,
          user_id: userId,
        }

        // Add AI response to database
        const { data: savedAssistantMessage } = await supabase
          .from("messages")
          .insert(assistantMessage)
          .select()
          .single()

        if (savedAssistantMessage) {
          setMessages((prev) => [...prev, savedAssistantMessage])
        }
      }
    } catch (error) {
      console.error("Error generating response:", error)
      // Add fallback response
      const fallbackMessage = {
        content: "I'm here to listen and support you. Could you tell me more about what's on your mind?",
        role: "assistant" as const,
        session_id: sessionId,
        user_id: userId,
      }

      const { data: savedFallbackMessage } = await supabase.from("messages").insert(fallbackMessage).select().single()

      if (savedFallbackMessage) {
        setMessages((prev) => [...prev, savedFallbackMessage])
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {crisisDetected && <CrisisAlert level={crisisLevel!} onClose={() => setCrisisDetected(false)} userId={userId} />}

      <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
        {/* Sessions Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Sessions</CardTitle>
                <Button size="sm" onClick={createNewSession}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 p-4">
                  {sessions.map((session) => (
                    <Button
                      key={session.id}
                      variant={currentSessionId === session.id ? "secondary" : "ghost"}
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => {
                        setCurrentSessionId(session.id)
                        loadMessages(session.id)
                      }}
                    >
                      <div className="truncate">
                        <div className="font-medium truncate">{session.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(session.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">AI Therapy Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0, maxHeight: 400 }}>
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <p className="text-lg font-medium mb-2">Welcome to your AI therapy session</p>
                      <p className="text-sm">I&apos;m here to listen and support you. How are you feeling today?</p>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{new Date(message.created_at).toLocaleTimeString()}</p>
                      </div>
                      {message.role === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-secondary">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="border-t p-4">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Share what's on your mind..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
