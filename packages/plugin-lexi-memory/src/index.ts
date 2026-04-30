import type { Plugin } from "@opencode-ai/plugin"

const LEXI_URL = process.env.LEXI_URL ?? "http://localhost:8002"
const LEXI_TOKEN = process.env.LEXI_MEMORY_TOKEN ?? ""

type ReflectionEntry = {
  content: string
  created_at: string
}

type Goal = {
  name: string
  metric: string
  target: number
  current: number | null
  direction: string
  deadline: string | null
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (LEXI_TOKEN) {
      headers["Authorization"] = `Bearer ${LEXI_TOKEN}`
    }
    const res = await fetch(`${LEXI_URL}${path}`, { headers, signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

export const LexiMemoryPlugin: Plugin = async (_ctx) => {
  return {
    "experimental.chat.system.transform": async (_input, output) => {
      const [reflections, goals] = await Promise.all([
        fetchJson<ReflectionEntry[]>("/api/memory/recent?limit=5"),
        fetchJson<Goal[]>("/api/goals/active"),
      ])

      if (reflections && reflections.length > 0) {
        const block = [
          "<memory>",
          "Recent reflections from Jordan's health journal:",
          ...reflections.map((r) => `- [${r.created_at}] ${r.content}`),
          "</memory>",
        ].join("\n")
        output.system.push(block)
      }

      if (goals && goals.length > 0) {
        const lines = goals.map((g) => {
          const progress = g.current !== null ? ` (current: ${g.current})` : ""
          const deadline = g.deadline ? ` by ${g.deadline}` : ""
          return `- ${g.name}: ${g.metric} → ${g.target}${progress}${deadline} [${g.direction}]`
        })
        const block = ["<goals>", "Jordan's active goals:", ...lines, "</goals>"].join("\n")
        output.system.push(block)
      }
    },
  }
}

export default LexiMemoryPlugin
