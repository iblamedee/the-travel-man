import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, AlertCircle, Loader, Map } from "lucide-react";
import { ChatMessage, TravelPreferences } from "../types";

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = (key: number) => {
    if (tableRows.length === 0) return null;

    // Extract headers (first row)
    const headers = tableRows[0];
    // Remaining rows (skipping separator row, which has '---')
    const bodyRows = tableRows.slice(1).filter(row => !row.some(cell => cell.includes("---")));

    tableRows = [];
    inTable = false;

    return (
      <div key={`table-${key}`} className="overflow-x-auto my-3 rounded-xl border border-white/10 bg-white/[0.02]">
        <table className="min-w-full divide-y divide-white/10 text-xs">
          <thead className="bg-white/[0.04] text-on-surface font-semibold font-display">
            <tr>
              {headers.map((cell, idx) => (
                <th key={idx} className="px-4 py-3 text-left font-bold tracking-wider">
                  {parseInline(cell.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-on-surface-variant font-sans">
            {bodyRows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-white/[0.01] transition-colors">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-2.5 whitespace-nowrap">
                    {parseInline(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if it is a table line
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      inTable = true;
      const cells = trimmed.split("|").slice(1, -1);
      tableRows.push(cells);
      continue;
    } else {
      if (inTable) {
        const tableElement = flushTable(i);
        if (tableElement) elements.push(tableElement);
      }
    }

    // Process normal markdown elements
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-sm font-bold text-brand-tertiary mt-3 mb-1 font-display">
          {parseInline(trimmed.slice(4))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-base font-bold text-brand-primary mt-4 mb-1.5 font-display border-b border-white/5 pb-1">
          {parseInline(trimmed.slice(3))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-lg font-extrabold text-on-surface mt-5 mb-2 font-display">
          {parseInline(trimmed.slice(2))}
        </h1>
      );
      continue;
    }

    // Unordered lists (handling lines starting with "-", "*", or "•")
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
      const bulletText = trimmed.replace(/^[-*•]\s+/, "");
      elements.push(
        <ul key={i} className="list-disc list-inside pl-4 my-0.5 text-on-surface-variant">
          <li className="leading-relaxed">{parseInline(bulletText)}</li>
        </ul>
      );
      continue;
    }

    // Numbered lists (handling lines starting with numbers like "1.", "2.")
    const numListRegex = /^(\d+)\.\s+/;
    if (numListRegex.test(trimmed)) {
      const listText = trimmed.replace(numListRegex, "");
      elements.push(
        <ol key={i} className="list-decimal list-inside pl-4 my-0.5 text-on-surface-variant">
          <li className="leading-relaxed">{parseInline(listText)}</li>
        </ol>
      );
      continue;
    }

    // Regular paragraphs (blank lines create vertical space)
    if (trimmed === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="my-0.5 leading-relaxed text-on-surface-variant">
          {parseInline(line)}
        </p>
      );
    }
  }

  if (inTable) {
    const tableElement = flushTable(lines.length);
    if (tableElement) elements.push(tableElement);
  }

  return elements;
}

function parseInlineContent(text: string): React.ReactNode[] {
  // Pattern to match markdown links: [Label](URL)
  const mdLinkRegex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g;
  const parts = text.split(mdLinkRegex);

  const checkIsMapLink = (url: string) => {
    return url.includes("google.com/maps") || url.includes("maps.google.com") || url.includes("maps.app.goo.gl");
  };

  return parts.map((part, partIdx) => {
    // If it's a markdown link [Label](URL)
    const match = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (match) {
      const label = match[1];
      const url = match[2];
      const isMap = checkIsMapLink(url);
      if (isMap) {
        return (
          <a
            key={`md-link-${partIdx}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/20 hover:text-[#00f0ff] hover:shadow-[0_0_12px_rgba(0,219,233,0.25)] transition-all duration-300 font-display font-bold text-xs uppercase tracking-wide my-1 cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 shrink-0 text-[#00dbe9]" />
            <span>{label}</span>
          </a>
        );
      }
      return (
        <a
          key={`md-link-${partIdx}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-primary underline hover:text-[#00f0ff] font-medium break-all"
        >
          {label}
        </a>
      );
    }

    // Otherwise, parse plain URLs
    const urlRegex = /(https?:\/\/[^\s$.?#].[^\s]*)/g;
    const urlParts = part.split(urlRegex);

    return urlParts.map((urlPart, urlIdx) => {
      // Clean trailing punctuation commonly appended to URLs
      const isUrl = urlPart.match(/^https?:\/\/[^\s]+/);
      if (isUrl) {
        let cleanUrl = urlPart;
        let trailing = "";
        const trailingPunct = /([.,?!;)]+)$/.exec(urlPart);
        if (trailingPunct) {
          cleanUrl = urlPart.slice(0, -trailingPunct[1].length);
          trailing = trailingPunct[1];
        }

        const isMap = checkIsMapLink(cleanUrl);
        if (isMap) {
          return (
            <React.Fragment key={`url-${urlIdx}`}>
              <a
                href={cleanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/20 hover:text-[#00f0ff] hover:shadow-[0_0_12px_rgba(0,219,233,0.25)] transition-all duration-300 font-display font-bold text-xs uppercase tracking-wide my-1 cursor-pointer"
              >
                <Map className="w-3.5 h-3.5 shrink-0 text-[#00dbe9]" />
                <span>Open Directions Map</span>
              </a>
              {trailing}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={`url-${urlIdx}`}>
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary underline hover:text-[#00f0ff] font-medium break-all"
            >
              {cleanUrl}
            </a>
            {trailing}
          </React.Fragment>
        );
      }
      return urlPart;
    });
  });
}

function parseInline(text: string): React.ReactNode[] {
  // First, parse bold text
  const boldParts = text.split(/(\*\*.*?\*\*)/g);

  return boldParts.map((part, index) => {
    let currentContent: string = part;
    let isBold = false;

    if (part.startsWith("**") && part.endsWith("**")) {
      currentContent = part.slice(2, -2);
      isBold = true;
    }

    const renderedParts = parseInlineContent(currentContent);

    if (isBold) {
      return (
        <strong key={index} className="font-bold text-brand-secondary">
          {renderedParts}
        </strong>
      );
    }

    return <React.Fragment key={index}>{renderedParts}</React.Fragment>;
  });
}


interface ChatViewProps {
  preferences: TravelPreferences;
}

export default function ChatView({ preferences }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-message",
      role: "assistant",
      text: "Greetings, Traveler! I am Lyu, your hyper-spatial travel partner. Powered by advanced sub-orbital sub-modules, I can recommend the absolute finest hidden cyberpunk hotspots, traditional sanctuaries, or map out custom coordinates for your next destination. Tell me, where does your curiosity lead you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionPrompts = [
    "Recommend snowy mountain trekking routes in Himalayas",
    "What should I pack for Iceland in winter?",
    "3-day itinerary for Amalfi Coast",
    "Cultural etiquette tips for Himalayan monasteries"
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    setError(null);

    try {
      // Build full history including current user message
      const history = [...messages, userMsg].map((msg) => ({
        role: msg.role,
        text: msg.text
      }));

      const token = localStorage.getItem("lyu_token");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          messages: history,
          preferences: preferences
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to query AeroGPT. Please try again.");
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please verify your GEMINI_API_KEY in Settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[100vh] w-full max-w-4xl mx-auto p-4 md:p-6">
      {/* View Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary shadow-[0_0_15px_rgba(0,219,233,0.15)] animate-pulse">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-on-surface flex items-center gap-2">
            Lyu Counsel
            <span className="text-[10px] font-bold text-[#00dbe9] bg-[#00dbe9]/10 border border-[#00dbe9]/20 px-2 py-0.5 rounded uppercase tracking-wider">
              AI Partner Active
            </span>
          </h2>
          <p className="font-sans text-xs text-on-surface-variant font-medium">
            Influenced by your: <span className="text-brand-tertiary font-bold capitalize">{preferences.budget}</span> budget · <span className="text-brand-primary font-bold capitalize">{preferences.style}</span> style
          </p>
        </div>
      </div>

      {/* Messages Log area */}
      <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-4 no-scrollbar">
        {messages.map((msg) => {
          const isAssistant = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAssistant
                    ? "bg-brand-primary/15 border border-brand-primary/20 text-brand-primary"
                    : "bg-brand-secondary/15 border border-brand-secondary/20 text-brand-secondary"
                  }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div
                className={`p-4 rounded-2xl border text-sm leading-relaxed relative ${isAssistant
                    ? "bg-[#1e1e31]/60 border-white/10 text-on-surface"
                    : "bg-brand-primary/10 border-brand-primary/25 text-on-surface rounded-tr-none"
                  }`}
              >
                <div className="space-y-1.5">
                  {isAssistant ? parseMarkdown(msg.text) : <div className="whitespace-pre-wrap">{msg.text}</div>}
                </div>
                <span className="block text-[10px] text-on-surface-variant/50 text-right mt-2 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Spinner with futuristic messages */}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-brand-primary/15 border border-brand-primary/20 text-brand-primary">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl border bg-[#1e1e31]/60 border-white/10 text-on-surface flex items-center gap-3">
              <Loader className="w-4 h-4 text-brand-primary animate-spin" />
              <span className="text-xs text-on-surface-variant animate-pulse font-display font-medium">
                Plotting vector coordinates, consulting galactic travel manifests...
              </span>
            </div>
          </div>
        )}

        {/* Error panel */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/35 text-red-200 text-sm flex gap-3 max-w-lg mx-auto">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Navigation Desync</p>
              <p className="text-xs leading-relaxed text-red-300">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompts */}
      {messages.length === 1 && !isLoading && (
        <div className="mb-4">
          <p className="font-display text-xs text-on-surface-variant font-bold mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            Hyper-spatial Queries:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestionPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="p-3 text-left rounded-xl bg-[#1e1e31]/40 border border-white/5 text-xs text-on-surface-variant hover:text-on-surface hover:bg-[#1e1e31]/80 hover:border-brand-primary/30 transition-all duration-300 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Send Input Area */}
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="glass-panel rounded-xl p-1.5 flex items-center gap-2 border border-white/10 focus-within:border-brand-primary/40 focus-within:shadow-[0_0_15px_rgba(0,219,233,0.15)] transition-all duration-300">
          <input
            className="flex-1 bg-transparent border-none text-on-surface font-sans text-sm placeholder:text-on-surface-variant/40 focus:ring-0 outline-none w-full h-11 px-3"
            placeholder="Ask Lyu anything about your journey..."
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="bg-brand-primary text-bg-darker p-3 rounded-lg hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center cursor-pointer tactile-btn"
          >
            <Send className="w-4 h-4 stroke-[2.5px]" />
          </button>
        </div>
      </form>
    </div>
  );
}
