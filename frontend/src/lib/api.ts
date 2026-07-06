const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type Platform = "windows" | "linux" | "macos";

export type Suggestion = {
  command: string;
  explanation: string;
  safe: boolean;
  blocked: boolean;
  warnings: string[];
};

export async function generateCommand(prompt: string, platform: Platform) {
  const response = await fetch(`${API_URL}/generate-command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, platform, max_suggestions: 3 }),
  });

  if (!response.ok) {
    throw new Error("Unable to generate command");
  }

  return response.json() as Promise<{ suggestions: Suggestion[] }>;
}
