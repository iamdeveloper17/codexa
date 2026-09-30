import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "AI Design to Code",
  description: "AI powered design to code",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}