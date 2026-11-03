"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUp,
  ArrowUpRight,
  Bot,
  Database,
  MessageCircle,
  RotateCcw,
  User,
  X,
} from "lucide-react";
import type { AssistantAnswer, AssistantLink } from "@/lib/assistant";

type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
  links?: AssistantLink[];
  suggestions?: string[];
};

const initialMessage: Message = {
  id: "welcome",
  role: "assistant",
  text: "Hi — I’m Gradi's portfolio assistant. I search the live CMS to answer questions about his work, experience, skills, and credentials. What would you like to know?",
  suggestions: [
    "What has Gradi built?",
    "Tell me about his experience",
    "How can I contact him?",
  ],
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("gradi-portfolio-chat");
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed) && parsed.length)
          setMessages(parsed.slice(-20));
      }
    } catch {
      /* A damaged local history should never block the assistant. */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      "daniel-portfolio-chat",
      JSON.stringify(messages.slice(-20)),
    );
  }, [messages, hydrated]);

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
      inputRef.current?.focus();
    }, 100);
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function ask(question: string) {
    const cleaned = question.trim();
    if (!cleaned || loading) return;
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", text: cleaned },
    ]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cleaned }),
      });
      const payload = (await response.json()) as AssistantAnswer & {
        error?: string;
      };
      if (!response.ok)
        throw new Error(payload.error || "Unable to search the portfolio.");
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: payload.message,
          links: payload.links,
          suggestions: payload.suggestions,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text:
            error instanceof Error
              ? error.message
              : "The local portfolio search is unavailable. Please try again.",
          suggestions: ["Show me the projects"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const latestSuggestions = !loading
    ? [...messages]
        .reverse()
        .find(
          (message) =>
            message.role === "assistant" && message.suggestions?.length,
        )?.suggestions
    : undefined;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            className="chat-panel"
            role="dialog"
            aria-label="AI portfolio assistant"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 330 }}
          >
            <header className="chat-header">
              <div className="chat-avatar">
                <Bot size={20} />
                <i />
              </div>
              <div>
                <h2>Ask about Gradi</h2>
                <p>
                  <Database size={11} /> Live CMS retrieval
                </p>
              </div>
              <button
                onClick={() => {
                  setMessages([initialMessage]);
                  setInput("");
                }}
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
              >
                <X size={19} />
              </button>
            </header>
            <div className="chat-disclosure">
              Answers are grounded in published portfolio data — not invented.
            </div>
            <div className="chat-messages" ref={scrollRef} aria-live="polite">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${message.role}`}
                >
                  <span className="chat-message-icon">
                    {message.role === "assistant" ? (
                      <Bot size={14} />
                    ) : (
                      <User size={14} />
                    )}
                  </span>
                  <div>
                    <p>{message.text}</p>
                    {message.links && message.links.length > 0 && (
                      <div className="chat-links">
                        {message.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noreferrer" : undefined}
                          >
                            {link.label}
                            <ArrowUpRight size={12} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-message assistant">
                  <span className="chat-message-icon">
                    <Bot size={14} />
                  </span>
                  <div className="chat-searching">
                    <i />
                    <i />
                    <i />
                    <span>Searching published portfolio…</span>
                  </div>
                </div>
              )}
            </div>
            {latestSuggestions && (
              <div className="chat-suggestions">
                {latestSuggestions.slice(0, 3).map((suggestion) => (
                  <button key={suggestion} onClick={() => ask(suggestion)}>
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <form
              className="chat-input"
              onSubmit={(event) => {
                event.preventDefault();
                ask(input);
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={500}
                placeholder="Ask about work, skills, experience…"
                aria-label="Your question"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send question"
              >
                <ArrowUp size={18} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
      <motion.button
        className={`chat-launcher ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={
          open ? "Close AI portfolio assistant" : "Open AI portfolio assistant"
        }
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        <span>{open ? "Close" : "Ask me"}</span>
        {!open && <i />}
      </motion.button>
    </>
  );
}
