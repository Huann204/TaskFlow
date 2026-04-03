"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquareText,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  RefreshCw,
  ThumbsUp,
} from "lucide-react";
import { type ChatMessage } from "@/types";

const initialChatMessages: ChatMessage[] = [
  {
    id: "msg-init",
    role: "ai",
    content: "Hi! I'm TaskFlow AI. How can I help you manage your sprint today?",
    timestamp: "Now",
  }
];

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isAI = msg.role === "ai";

  return (
    <div className={`flex gap-3 ${isAI ? "" : "flex-row-reverse"}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isAI ? "gradient-bg" : "bg-[#1E1E2E] border border-white/10"
        }`}
      >
        {isAI ? (
          <Bot size={14} className="text-white" />
        ) : (
          <User size={14} className="text-[#94A3B8]" />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[85%] ${isAI ? "" : ""}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isAI
              ? "bg-white/5 border border-white/8 text-[#E2E8F0] rounded-tl-none"
              : "gradient-bg text-white rounded-tr-none shadow-md shadow-violet-700/20"
          }`}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>

        {/* Timestamp + actions */}
        <div
          className={`flex items-center gap-2 mt-1 ${
            isAI ? "" : "flex-row-reverse"
          }`}
        >
          <span className="text-[10px] text-[#475569]">{msg.timestamp}</span>
          {isAI && (
            <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100">
              <button
                className="text-[#475569] hover:text-[#94A3B8] cursor-pointer transition-colors"
                title="Copy"
              >
                <Copy size={11} />
              </button>
              <button
                className="text-[#475569] hover:text-emerald-400 cursor-pointer transition-colors"
                title="Good response"
              >
                <ThumbsUp size={11} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AIPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
    setMessages((m) => [...m, userMsg]);
    setIsTyping(true);

    try {
      const { apiRequest } = await import("@/lib/api");
      const data = await apiRequest("/ai/chat", {
        method: "POST",
        data: {
          message: text,
          previousMessages: messages,
        },
      });

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "ai",
        content: data.reply || "Sorry, I couldn't generate a response.",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };
      setMessages((m) => [...m, aiMsg]);
    } catch (error) {
      console.error("Chat generation failed:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    "Summarize today's tasks",
    "What should I prioritize?",
    "Generate a sprint plan",
  ];

  return (
    <div className="flex flex-col h-full glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl gradient-bg flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F8FAFC] leading-none mb-0.5">
              AI Assistant
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setMessages(initialChatMessages)}
          className="text-[#475569] hover:text-[#94A3B8] cursor-pointer transition-colors"
          title="Reset conversation"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className="group">
            <MessageBubble msg={msg} />
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="px-4 py-3 bg-white/5 border border-white/8 rounded-2xl rounded-tl-none">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length <= 3 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setInput(s);
                inputRef.current?.focus();
              }}
              className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-white/20 rounded-full transition-all duration-200 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 focus-within:border-[#7C3AED]/40 transition-all duration-200">
          <MessageSquareText
            size={15}
            className="text-[#475569] flex-shrink-0"
          />
          <input
            ref={inputRef}
            id="ai-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your tasks…"
            disabled={isTyping}
            className="flex-1 bg-transparent text-sm text-[#F8FAFC] placeholder-[#475569] outline-none disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="w-7 h-7 flex items-center justify-center gradient-bg rounded-xl text-white cursor-pointer hover:opacity-90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Send message"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
