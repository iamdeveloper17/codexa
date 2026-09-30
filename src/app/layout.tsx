import type { Metadata } from "next";
import "../styles/globals.css";
import { SmoothScroll } from "@/components/landing/SmoothScroll";

export const metadata: Metadata = {
  title: "Codexa — AI Design to Code",
  description:
    "Transform your ideas into production-ready React code with AI. Live preview, save projects, and ship faster.",
  keywords: ["AI", "design to code", "React", "Next.js", "Tailwind", "code generator"],
  authors: [{ name: "iamdeveloper17" }],
  openGraph: {
    title: "Codexa — AI Design to Code",
    description: "Transform your ideas into production-ready React code with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}