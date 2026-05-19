"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getConversation, getMessages, sendMessage } from "@/lib/api";
import { Alert, Button, LoadingSpinner, useToast } from "@/components";

interface Message {
  message_id: number;
  sender_type: string;
  content: string;
  message_role: string;
  created_at: string;
  sender_user_id: number | null;
}

interface Conversation {
  conversation_id: number;
  title: string;
  project_id: number;
  tia_profile_id: number;
}

export default function ConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = Number(params.id);
  const { user, isLoading } = useAuth();
  const { addToast } = useToast();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user || Number.isNaN(conversationId)) return;

    const fetchData = async () => {
      setLoading(true);
      setLoadError("");

      const [convResponse, messagesResponse] = await Promise.all([
        getConversation(conversationId),
        getMessages(conversationId),
      ]);

      if (convResponse.data) {
        setConversation(convResponse.data);
      }

      if (messagesResponse.data) {
        setMessages(messagesResponse.data);
      }

      const firstError = convResponse.error || messagesResponse.error;
      if (firstError) {
        setLoadError(firstError);
        addToast(firstError, "error");
      }

      setLoading(false);
    };

    fetchData();
  }, [conversationId, user, addToast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newMessage.trim()) {
      addToast("Please enter a message", "warning");
      return;
    }

    setSending(true);
    const response = await sendMessage<Message>(conversationId, {
      content: newMessage.trim(),
      sender_type: "user",
      message_role: "user_query",
    });

    if (response.error) {
      setError(response.error);
      addToast(response.error, "error");
      setSending(false);
      return;
    }

    const sentMessage = response.data;
    if (sentMessage) {
      setMessages((current) => [...current, sentMessage]);
      setNewMessage("");
      addToast("Message sent", "success");
    }

    setSending(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (loadError || !conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 py-4">
          <Link href="/conversations" className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Back to Conversations
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Conversation Not Found</h2>
            <p className="text-gray-600 mb-6">
              {loadError || "The conversation you are looking for does not exist."}
            </p>
            <Link href="/conversations">
              <Button variant="primary">Back to Conversations</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link
            href="/conversations"
            className="mb-2 flex items-center gap-2 font-medium text-indigo-600 transition hover:text-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Conversations
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{conversation.title}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {error && <Alert type="error" message={error} onClose={() => setError("")} />}

          {messages.length === 0 ? (
            <div className="py-12 text-center">
              <svg className="mx-auto mb-4 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="font-medium text-gray-600">No messages yet</p>
              <p className="mt-1 text-sm text-gray-500">Start the conversation below</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.message_id}
                className={`flex gap-2 animate-fade-in-up ${
                  message.sender_type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-3 lg:max-w-md xl:max-w-lg ${
                    message.sender_type === "user"
                      ? "rounded-br-none bg-indigo-600 text-white"
                      : message.sender_type === "tia"
                        ? "rounded-bl-none border border-green-200 bg-green-50 text-gray-900"
                        : "rounded-bl-none border border-blue-200 bg-blue-50 text-gray-900"
                  }`}
                >
                  {message.sender_type !== "user" && (
                    <p className="mb-1 text-xs font-semibold capitalize opacity-70">
                      {message.sender_type}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
                  <p
                    className={`mt-2 text-xs ${
                      message.sender_type === "user" ? "opacity-70" : "text-gray-600 opacity-60"
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
              autoFocus
            />
            <Button type="submit" disabled={sending || !newMessage.trim()} loading={sending} variant="primary">
              {sending ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
