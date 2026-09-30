"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CodePreview } from "./CodePreview";
import { ProjectsSidebar } from "./ProjectsSidebar";
import {
  SavedProject,
  getProjects,
  saveProject,
  deleteProject,
} from "@/lib/storage";

gsap.registerPlugin(SplitText, useGSAP);

export function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");

  // Projects state
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

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

  useEffect(() => {
    if (!isComplete) return;

    const timer = setTimeout(() => {
      const card = document.querySelector(".floating-card");
      if (card) {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isComplete]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setCode("");
    setIsComplete(false);
    setSaved(false);
    setViewMode("preview");

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

      setIsComplete(true);
    } catch {
      setCode("❌ Generation failed, try again later");
      setIsComplete(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleSave = () => {
    if (!code || code.startsWith("❌")) return;
    saveProject(prompt, code);
    setProjects(getProjects());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLoad = (project: SavedProject) => {
    setPrompt(project.prompt);
    setCode(project.code);
    setIsComplete(true);
    setSaved(false);
    setViewMode("preview");
    setSidebarOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setProjects(getProjects());
  };

  const isError = code.startsWith("❌");
  const showCard = isComplete && code.length > 0;

  return (
    <>
      <ProjectsSidebar
        projects={projects}
        onLoad={handleLoad}
        onDelete={handleDelete}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <section
        ref={container}
        className="h-screen bg-black text-white flex flex-col items-center justify-center px-6 pt-16 pb-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />

        {/* Projects Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "rgba(168, 85, 247, 0.1)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            borderRadius: "10px",
            color: "#a78bfa",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            zIndex: 20,
            fontFamily: "monospace",
          }}
        >
          📁 Projects ({projects.length})
        </button>

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

        {/* Loading */}
        {isLoading && (
          <div
            className="floating-card"
            style={{
              marginTop: "30px",
              width: "100%",
              maxWidth: "672px",
              background: "rgba(17, 24, 39, 0.8)",
              backdropFilter: "blur(8px)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid rgba(168, 85, 247, 0.3)",
                borderTopColor: "#a78bfa",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span style={{ color: "#9ca3af", fontSize: "14px" }}>
              AI code generate kar raha hai...
            </span>
          </div>
        )}

        {/* Error */}
        {showCard && isError && (
          <div
            style={{
              marginTop: "30px",
              padding: "16px 24px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              color: "#fca5a5",
              fontSize: "14px",
              maxWidth: "672px",
              width: "100%",
              zIndex: 10,
            }}
          >
            {code}
          </div>
        )}

        {/* Card */}
        {showCard && !isError && (
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
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => setViewMode("preview")}
                  style={{
                    fontSize: "12px",
                    color: viewMode === "preview" ? "#a78bfa" : "#6b7280",
                    background:
                      viewMode === "preview"
                        ? "rgba(168, 85, 247, 0.15)"
                        : "transparent",
                    border:
                      "1px solid " +
                      (viewMode === "preview"
                        ? "rgba(168, 85, 247, 0.4)"
                        : "transparent"),
                    padding: "4px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontFamily: "monospace",
                  }}
                >
                  Preview
                </button>
                <button
                  onClick={() => setViewMode("code")}
                  style={{
                    fontSize: "12px",
                    color: viewMode === "code" ? "#a78bfa" : "#6b7280",
                    background:
                      viewMode === "code"
                        ? "rgba(168, 85, 247, 0.15)"
                        : "transparent",
                    border:
                      "1px solid " +
                      (viewMode === "code"
                        ? "rgba(168, 85, 247, 0.4)"
                        : "transparent"),
                    padding: "4px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontFamily: "monospace",
                  }}
                >
                  Code
                </button>
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={handleSave}
                  style={{
                    fontSize: "12px",
                    color: saved ? "#4ade80" : "#a78bfa",
                    fontFamily: "monospace",
                    background: saved
                      ? "rgba(74, 222, 128, 0.1)"
                      : "rgba(168, 85, 247, 0.1)",
                    border:
                      "1px solid " +
                      (saved
                        ? "rgba(74, 222, 128, 0.3)"
                        : "rgba(168, 85, 247, 0.3)"),
                    padding: "4px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {saved ? "✓ Saved" : "Save"}
                </button>
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
            </div>

            {/* Body */}
            {viewMode === "preview" ? (
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <CodePreview code={code} />
              </div>
            ) : (
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
            )}
          </div>
        )}
      </section>
    </>
  );
}