"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const steps = [
  {
    number: "01",
    title: "Write a Prompt",
    description:
      "Describe your idea in plain English — like 'a glassmorphism login form' or 'an animated pricing card'.",
  },
  {
    number: "02",
    title: "AI Generates",
    description:
      "Our AI model converts your prompt into complete React + Tailwind code in seconds.",
  },
  {
    number: "03",
    title: "Preview & Save",
    description:
      "See live preview, copy the code, or save it for later. Everything in one place.",
  },
];

export function HowItWorks() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Title animation - same as Features
      gsap.fromTo(
        ".hiw-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".hiw-title",
            start: "top 90%",
            end: "top 60%",
            scrub: 0.5,
          },
        }
      );

      // Line grow with scrub
      gsap.fromTo(
        ".hiw-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: ".hiw-steps",
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        }
      );

      // Each step with scrub
      gsap.utils.toArray<HTMLElement>(".hiw-step").forEach((step) => {
        gsap.fromTo(
          step,
          { x: -80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 90%",
              end: "top 60%",
              scrub: 0.5,
            },
          }
        );
      });
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-24 relative"
    >
      <div className="max-w-4xl w-full relative z-10">
        <h2 className="hiw-title text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-6 pb-2">
          How it works
        </h2>

        <p className="text-center text-gray-400 text-lg md:text-xl mb-20">
          From idea to code in three simple steps.
        </p>

        <div className="hiw-steps relative">
          {/* Vertical line */}
          <div className="hiw-line absolute left-8 md:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-purple-500/50 to-transparent" />

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className="hiw-step relative flex gap-8">
                {/* Number circle */}
                <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center border-4 border-black relative z-10">
                  <span className="text-xl md:text-2xl font-bold text-white font-mono">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2 md:pt-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}