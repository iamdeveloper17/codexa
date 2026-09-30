export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response("Prompt required", { status: 400 });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct",
          messages: [
            {
              role: "system",
              content:
                "You are a React and Tailwind expert. Generate ONLY the component code. No explanations, no markdown fences. Use functional components with hooks. Use Tailwind classes.",
            },
            {
              role: "user",
              content: `Create a React component: ${prompt}`,
            },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter API error:", error);
      return new Response(`API error: ${error}`, { status: response.status });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const json = JSON.parse(data);
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {}
            }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Generation error:", error);
    return new Response(
      `Error: ${error instanceof Error ? error.message : "Unknown"}`,
      { status: 500 }
    );
  }
}