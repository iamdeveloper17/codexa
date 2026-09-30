"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const features = [
  {
    icon: "⚡",
    title: "Instant Generation",
    description:
      "AI converts your idea into a complete React component in seconds. No setup, no boilerplate.",
  },
  {
    icon: "🎨",
    title: "Live Preview",
    description:
      "See generated code rendered instantly in your browser. Real-time preview powered by Sandpack.",
  },
  {
    icon: "💾",
    title: "Save & Reuse",
    description:
      "Save your favorite generations, load them later, and copy code directly into your projects.",
  },
];

export function Features() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Title animation - smooth with play/reverse on scroll
      gsap.fromTo(
        ".features-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-title",
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
            // Smooth scrub alternative:
            scrub: 0.5,
          },
        }
      );

      // Cards animation - staggered with smooth easing
      gsap.fromTo(
        ".feature-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
            // Smooth scrub alternative:
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
      className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-24 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none" />

      <div className="max-w-6xl w-full relative z-10">
        <h2 className="features-title text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-6 pb-2">
          Everything, in one place
        </h2>

        <p className="text-center text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-20">
          From design to code — fast, simple, and powerful.
        </p>

        <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/[0.07]"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all duration-300 pointer-events-none" />

              <div className="relative z-10">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}