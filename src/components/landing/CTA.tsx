"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CTA() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".cta-content",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-content",
            start: "top 90%",
            end: "top 50%",
            scrub: 0.5,
          },
        }
      );

      gsap.fromTo(
        ".cta-button",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-content",
            start: "top 85%",
            end: "top 45%",
            scrub: 0.5,
          },
        }
      );
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative"
    >
      {/* Big glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <div className="cta-content relative z-10 text-center max-w-3xl">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-6 pb-2 leading-tight">
          Ready to build?
        </h2>

        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl mx-auto">
          Generate your first React component now — completely free, blazing
          fast.
        </p>

        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="cta-button px-10 py-5 rounded-full bg-purple-600 hover:bg-purple-500 font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-600/50"
        >
          Start Generating →
        </button>
      </div>
    </section>
  );
}