"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { ProjectsSidebar } from "./ProjectsSidebar";
import { createClient } from "@/lib/supabase/client";
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

  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (user) {
      getProjects().then(setProjects);
    }
  }, [user]);

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
      setCode("❌ Generation failed. Please try again.");
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

  const handleSave = async () => {
    if (!code || code.startsWith("❌")) return;
    const project = await saveProject(prompt, code);
    if (project) {
      setProjects((prev) => [project, ...prev]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleLoad = (project: SavedProject) => {
    setPrompt(project.prompt);
    setCode(project.code);
    setIsComplete(true);
    setSaved(false);
    setSidebarOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
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
        className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-16 pb-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />

        {/* TOP BAR */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 z-20 gap-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
              C
            </div>
            <span className="text-white font-bold text-base sm:text-lg tracking-tight">
              Codexa
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs sm:text-sm font-mono hover:bg-purple-500/20 transition-colors whitespace-nowrap"
            >
              📁 <span className="hidden sm:inline">Projects</span>{" "}
              <span>({projects.length})</span>
            </button>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300 hidden md:block max-w-[120px] truncate">
                    {user.email}
                  </span>
                  <svg
                    className="w-3 h-3 text-gray-400 hidden sm:block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-zinc-900 border border-white/10 shadow-xl overflow-hidden z-40">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-xs text-gray-500 mb-1">
                          Signed in as
                        </p>
                        <p className="text-sm text-white truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* HERO CONTENT */}
        <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center max-w-4xl leading-tight px-2">
          Design to Code, Powered by AI
        </h1>

        <p className="hero-subtitle mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-400 text-center max-w-2xl px-2">
          Turn your idea into production-ready React code in seconds
        </p>

        <div className="hero-cta mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xl">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="Try: create a glassmorphism login form"
            className="flex-1 px-5 sm:px-6 py-3 sm:py-4 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 text-sm sm:text-base"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={cn(
              "px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-purple-600 hover:bg-purple-500 font-semibold transition-colors text-sm sm:text-base whitespace-nowrap",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="floating-card mt-6 sm:mt-8 w-full max-w-2xl rounded-2xl p-4 sm:p-6 bg-gray-900/80 backdrop-blur border border-white/10 flex items-center gap-3 z-10">
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid rgba(168, 85, 247, 0.3)",
                borderTopColor: "#a78bfa",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                flexShrink: 0,
              }}
            />
            <span className="text-gray-400 text-sm">
              AI is writing your code...
            </span>
          </div>
        )}

        {/* Error */}
        {showCard && isError && (
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm max-w-2xl w-full z-10">
            {code}
          </div>
        )}

        {/* Code Card */}
        {showCard && !isError && (
          <div className="floating-card mt-6 sm:mt-8 mb-6 sm:mb-8 w-full max-w-2xl rounded-2xl p-4 sm:p-6 bg-gray-900/80 backdrop-blur border border-white/10 relative z-10 h-[50vh] sm:h-[60vh] max-h-[500px] sm:max-h-[600px] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-3 flex-shrink-0 gap-2">
              <span className="text-xs text-gray-500 font-mono truncate">
                Generated Code
              </span>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={handleSave}
                  className={cn(
                    "text-xs font-mono px-3 py-1.5 rounded-md border transition-colors",
                    saved
                      ? "text-green-400 bg-green-500/10 border-green-500/30"
                      : "text-purple-400 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20"
                  )}
                >
                  {saved ? "✓ Saved" : "Save"}
                </button>
                <button
                  onClick={handleCopy}
                  className="text-xs font-mono px-3 py-1.5 rounded-md text-purple-400 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>

            <pre className="text-xs sm:text-sm text-green-400 overflow-y-auto overflow-x-hidden flex-1 min-h-0 font-mono whitespace-pre-wrap break-words m-0 pr-2">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </section>
    </>
  );
}