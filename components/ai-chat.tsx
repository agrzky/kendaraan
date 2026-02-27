"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Loader2,
  MessageSquare,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "📊 Analisis pengeluaran BBM bulan ini",
  "🔧 Kendaraan mana yang perlu servis?",
  "💰 Total pengeluaran BBM dan Tol",
  "⛽ Tips hemat bahan bakar",
];

export function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollDown(!isAtBottom);
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Auto-resize textarea back
    if (inputRef.current) {
      inputRef.current.style.height = "44px";
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          error instanceof Error
            ? `⚠️ ${error.message}`
            : "⚠️ Maaf, terjadi kesalahan. Silakan coba lagi.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto resize
    e.target.style.height = "44px";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  // Format markdown-like content to simple HTML
  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="ai-code">$1</code>')
      .replace(/\n/g, "<br/>");
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white border-0 transition-all duration-300 hover:scale-110 hover:shadow-violet-500/25"
              id="ai-chat-toggle"
            >
              <div className="relative">
                <MessageSquare className="h-6 w-6" />
                <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
              </div>
            </Button>
            {/* Pulse animation ring */}
            <span className="absolute inset-0 rounded-full animate-ping bg-violet-500/30 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={
              typeof window !== "undefined" && window.innerWidth < 768
                ? { opacity: 0, y: "100%" }
                : { opacity: 0, y: 20, scale: 0.95 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              typeof window !== "undefined" && window.innerWidth < 768
                ? { opacity: 0, y: "100%" }
                : { opacity: 0, y: 20, scale: 0.95 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed z-[60] flex flex-col bg-background shadow-2xl overflow-hidden backdrop-blur-md transition-all duration-300 ${
              isExpanded
                ? "inset-4 rounded-2xl border border-border/50"
                : "bottom-0 right-0 w-full h-[100dvh] md:bottom-6 md:right-6 md:w-[420px] md:h-[650px] md:rounded-2xl md:max-h-[85vh] md:border md:border-border/50"
            }`}
            style={{
              boxShadow:
                isExpanded ||
                (typeof window !== "undefined" && window.innerWidth >= 768)
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.1)"
                  : "none",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 md:py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white shrink-0 shadow-lg">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 md:hidden"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
                <div className="relative">
                  <div className="h-9 w-9 md:h-8 md:w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Bot className="h-5 w-5 md:h-4 md:w-4" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-xs tracking-tight uppercase">
                    AI Assistant
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[10px] text-white/70 font-medium">
                      Online
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearChat}
                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                    title="Hapus percakapan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 hidden md:flex"
                  title={isExpanded ? "Kecilkan" : "Besarkan"}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsOpen(false);
                    setIsExpanded(false);
                  }}
                  className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 hidden md:flex"
                  title="Tutup"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden relative bg-gradient-to-b from-transparent to-muted/20">
              <ScrollArea
                className="h-full"
                ref={scrollAreaRef}
                onScrollCapture={handleScroll}
              >
                <div className="p-4 md:p-6 space-y-6">
                  {/* Welcome message */}
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-12 px-4 text-center"
                    >
                      <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center mb-6 border border-violet-500/20 shadow-inner">
                        <Bot className="h-10 w-10 text-violet-500" />
                      </div>
                      <h3 className="font-bold text-xl mb-2 tracking-tight">
                        Halo! Saya AI Assistant 👋
                      </h3>
                      <p className="text-sm text-muted-foreground mb-8 max-w-[280px] leading-relaxed">
                        Siap membantu menganalisis data kendaraan, pengeluaran
                        BBM, dan jadwal servis Anda.
                      </p>

                      {/* Suggested Questions */}
                      <div className="w-full max-w-xs space-y-2.5">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mb-4">
                          Saran Pertanyaan
                        </p>
                        {SUGGESTED_QUESTIONS.map((question, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => sendMessage(question)}
                            className="w-full text-left text-sm px-5 py-3.5 rounded-2xl border border-border/60 bg-background/50 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all duration-300 text-foreground/80 hover:text-violet-600 hover:translate-x-1 flex items-center justify-between group"
                          >
                            <span className="truncate">{question}</span>
                            <Sparkles className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-violet-400 shrink-0 ml-2" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Chat Messages */}
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: index === messages.length - 1 ? 0.05 : 0,
                      }}
                      className={`flex gap-3 md:gap-4 ${
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`h-9 w-9 rounded-2xl md:rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-indigo-500 to-blue-600"
                            : "bg-gradient-to-br from-violet-600 to-purple-700"
                        }`}
                      >
                        {message.role === "user" ? (
                          <span className="text-white text-xs font-bold">
                            ME
                          </span>
                        ) : (
                          <Bot className="h-5 w-5 text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[85%] md:max-w-[75%] rounded-[1.25rem] px-4 py-3 text-[14px] md:text-sm leading-[1.6] shadow-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-indigo-500/90 to-blue-600/90 text-white rounded-tr-none"
                            : "bg-background text-foreground rounded-tl-none border border-border/50"
                        }`}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatMessage(message.content),
                          }}
                          className="[&_strong]:font-bold [&_em]:italic [&_.ai-code]:bg-zinc-800 [&_.ai-code]:text-zinc-100 [&_.ai-code]:px-1.5 [&_.ai-code]:py-0.5 [&_.ai-code]:rounded-md [&_.ai-code]:text-[12px] [&_.ai-code]:font-mono"
                        />
                        <div
                          className={`flex items-center gap-1.5 mt-2 opacity-50 ${
                            message.role === "user"
                              ? "justify-end text-white"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span className="text-[9px] font-medium">
                            {message.timestamp.toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 md:gap-4"
                    >
                      <div className="h-9 w-9 rounded-2xl md:rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shrink-0 shadow-sm">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-background rounded-[1.25rem] rounded-tl-none px-5 py-4 border border-border/50 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <motion.span
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: 0,
                              }}
                              className="w-1.5 h-1.5 rounded-full bg-violet-400"
                            />
                            <motion.span
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: 0.2,
                              }}
                              className="w-1.5 h-1.5 rounded-full bg-violet-500"
                            />
                            <motion.span
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: 0.4,
                              }}
                              className="w-1.5 h-1.5 rounded-full bg-violet-600"
                            />
                          </div>
                          <span className="text-[13px] md:text-sm text-muted-foreground font-medium">
                            Analisis Groq...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} className="h-2" />
                </div>
              </ScrollArea>

              {/* Scroll to bottom button */}
              <AnimatePresence>
                {showScrollDown && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    onClick={scrollToBottom}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-background border border-border shadow-2xl flex items-center justify-center hover:bg-muted transition-all active:scale-90 z-10"
                  >
                    <ChevronDown className="h-5 w-5 text-violet-500" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="shrink-0 border-t border-border/40 bg-background md:bg-background/80 md:backdrop-blur-md p-4 pb-6 md:p-4 mb-[env(safe-area-inset-bottom)]">
              <form
                onSubmit={handleSubmit}
                className="flex items-end gap-2 max-w-[1000px] mx-auto w-full"
              >
                <div className="flex-1 relative group">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleTextareaInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Tulis pesan..."
                    disabled={isLoading}
                    rows={1}
                    className="w-full resize-none rounded-2xl md:rounded-xl border border-border/60 bg-muted/30 px-4 pt-3 pb-3 text-[15px] md:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/40 focus:bg-background disabled:opacity-50 placeholder:text-muted-foreground/60 transition-all duration-300 min-h-[48px]"
                    style={{ maxHeight: "150px" }}
                    id="ai-chat-input"
                  />
                  {!input && (
                    <Sparkles className="absolute right-4 top-3.5 h-4 w-4 text-muted-foreground/30 pointer-events-none group-focus-within:text-violet-400 group-focus-within:animate-pulse transition-colors" />
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-[48px] w-[48px] rounded-2xl md:rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/20 disabled:opacity-30 disabled:shadow-none transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
                  id="ai-chat-send"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
              <div className="flex items-center justify-center gap-1.5 mt-3 opacity-30 select-none">
                <Bot className="h-3 w-3" />
                <p className="text-[9px] uppercase font-bold tracking-[0.1em]">
                  Intelligent Fleet Analysis
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
