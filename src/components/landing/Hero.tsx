"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(SplitText, useGSAP);

export function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      if (typeof SplitText === "undefined") {
        gsap.set(".hero-title", { opacity: 1 });
        return;
      }

      const split = new SplitText(".hero-title", { type: "chars,words" });

      if (!split.chars || split.chars.length === 0) {
        gsap.set(".hero-title", { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(split.chars, {
        y: 100,
        opacity: 0,
        rotateX: -90,
        stagger: 0.02,
        duration: 0.8,
      })
        .from(".hero-subtitle", { y: 30, opacity: 0 }, "-=0.4")
        .from(".hero-cta", { scale: 0.8, opacity: 0 }, "-=0.3");
    },
    { scope: container }
  );

  // Code aane ke baad floating card animate karo + auto scroll
  useEffect(() => {
    if (!code) return;

    const timer = setTimeout(() => {
      const card = document.querySelector(".floating-card");
      if (card && card.children.length > 0) {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [code]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setCode("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        setCode((prev) => prev + decoder.decode(value));
      }
    } catch {
      setCode("❌ Generation failed, try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section
      ref={container}
      className="h-screen bg-black text-white flex flex-col items-center justify-center px-6 pt-16 pb-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />

      <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center max-w-4xl leading-tight">
        Design to Code, AI ke saath
      </h1>

      <p className="hero-subtitle mt-4 text-base md:text-lg text-gray-400 text-center max-w-2xl">
        Apne idea ko React code mein badlo, ek line mein
      </p>

      <div className="hero-cta mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-xl">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder="Jaise: ek glassmorphism login form banao"
          className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={cn(
            "px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-500 font-semibold transition-colors",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? "Generate ho raha hai..." : "Generate karo"}
        </button>
      </div>

      {code.length > 0 && (
        <div
          className="floating-card"
          style={{
            marginTop: "30px",
            marginBottom: "30px",
            width: "100%",
            maxWidth: "672px",
            background: "rgba(17, 24, 39, 0.8)",
            backdropFilter: "blur(8px)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            position: "relative",
            zIndex: 10,
            height: "60vh",
            maxHeight: "600px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
                fontFamily: "monospace",
              }}
            >
              Generated Code
            </span>
            <button
              onClick={handleCopy}
              style={{
                fontSize: "12px",
                color: "#a78bfa",
                fontFamily: "monospace",
                background: "rgba(168, 85, 247, 0.1)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                padding: "4px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <pre
            style={{
              fontSize: "14px",
              color: "#4ade80",
              overflowY: "auto",
              overflowX: "hidden",
              flex: 1,
              minHeight: 0,
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
              paddingRight: "8px",
            }}
          >
            <code>{code}</code>
          </pre>
        </div>
      )}
    </section>
  );
}