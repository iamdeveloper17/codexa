"use client";

import { Sandpack } from "@codesandbox/sandpack-react";

interface CodePreviewProps {
  code: string;
}

function cleanCode(raw: string): string {
  let cleaned = raw.trim();

  // Markdown fences hatao
  cleaned = cleaned.replace(/^```(?:jsx|javascript|js|tsx|ts)?\s*/i, "");
  cleaned = cleaned.replace(/```\s*$/i, "");

  // Agar import/export nahi hai toh invalid maano
  if (!cleaned.includes("import") && !cleaned.includes("export")) {
    return "";
  }

  // Agar export default nahi hai toh add karo
  if (!cleaned.includes("export default")) {
    const match = cleaned.match(/(?:const|function)\s+(\w+)/);
    if (match) {
      cleaned += `\n\nexport default ${match[1]};`;
    }
  }

  return cleaned.trim();
}

export function CodePreview({ code }: CodePreviewProps) {
  const clean = cleanCode(code);

  if (!clean) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        Waiting for complete code...
      </div>
    );
  }

  const files = {
    "/App.js": {
      code: clean,
      readOnly: true,
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Sandpack
        template="react"
        files={files}
        theme="dark"
        options={{
          showNavigator: false,
          showTabs: false,
          editorHeight: "100%",
          showLineNumbers: true,
        }}
      />
    </div>
  );
}