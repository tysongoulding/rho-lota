import { create } from "zustand";

export interface AgentPersona {
  id: string;
  name: string;
  description: string;
  role: string;
  systemPrompt: string;
  defaultTools: string[];
  temperature: number;
  thinkingLevel: "off" | "low" | "medium" | "high" | "max";
}

export interface ToolDefinition {
  name: string;
  description: string;
  source: "native" | "mcp";
  mcpServer?: string;
  enabled: boolean;
  requiresApproval: boolean;
}

export const DEFAULT_PERSONAS: AgentPersona[] = [
  {
    id: "coder",
    name: "Coding Agent",
    role: "Full-Stack Software Engineer",
    description: "Specialized in code generation, refactoring, and test-driven development.",
    systemPrompt: "You are an expert coding agent. Write concise, idiomatic, production-grade code.",
    defaultTools: ["read", "write", "edit", "bash"],
    temperature: 0.2,
    thinkingLevel: "high",
  },
  {
    id: "architect",
    name: "Software Architect",
    role: "System Designer & Planner",
    description: "Designs technical specifications, system boundaries, and migration plans.",
    systemPrompt: "You are a software architect. Focus on clean domain boundaries, scalability, and type safety.",
    defaultTools: ["read", "search", "fetch"],
    temperature: 0.3,
    thinkingLevel: "high",
  },
  {
    id: "researcher",
    name: "Deep Researcher",
    role: "Codebase & Web Scout",
    description: "Searches documentation, web resources, and explores dependencies.",
    systemPrompt: "You are a research specialist. Analyze documentation, extract technical truths, and cite sources.",
    defaultTools: ["read", "search", "fetch"],
    temperature: 0.4,
    thinkingLevel: "medium",
  },
  {
    id: "reviewer",
    name: "Code Reviewer",
    role: "Quality & Security Auditor",
    description: "Performs adversarial code reviews, vulnerability checks, and lint enforcement.",
    systemPrompt: "You are a strict code reviewer. Verify correctness, edge cases, performance, and security.",
    defaultTools: ["read", "edit", "bash"],
    temperature: 0.1,
    thinkingLevel: "max",
  },
];

export const BUILTIN_TOOLS: ToolDefinition[] = [
  { name: "read", description: "Read file contents with line limits and offsets", source: "native", enabled: true, requiresApproval: false },
  { name: "write", description: "Create or overwrite files on disk", source: "native", enabled: true, requiresApproval: true },
  { name: "edit", description: "Precise text replacement with exact match chunks", source: "native", enabled: true, requiresApproval: true },
  { name: "bash", description: "Execute shell commands in the workspace", source: "native", enabled: true, requiresApproval: true },
  { name: "search", description: "Search web queries and return structured summaries", source: "native", enabled: true, requiresApproval: false },
  { name: "fetch", description: "Fetch and extract readable markdown from URLs", source: "native", enabled: true, requiresApproval: false },
];

interface AgentState {
  activePersonaId: string;
  personas: AgentPersona[];
  tools: ToolDefinition[];
  setActivePersona: (id: string) => void;
  toggleTool: (name: string) => void;
  toggleToolApproval: (name: string) => void;
  addMcpTool: (tool: ToolDefinition) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  activePersonaId: "coder",
  personas: DEFAULT_PERSONAS,
  tools: BUILTIN_TOOLS,

  setActivePersona: (id: string) => set({ activePersonaId: id }),

  toggleTool: (name: string) =>
    set((state) => ({
      tools: state.tools.map((t) =>
        t.name === name ? { ...t, enabled: !t.enabled } : t
      ),
    })),

  toggleToolApproval: (name: string) =>
    set((state) => ({
      tools: state.tools.map((t) =>
        t.name === name ? { ...t, requiresApproval: !t.requiresApproval } : t
      ),
    })),

  addMcpTool: (tool: ToolDefinition) =>
    set((state) => ({ tools: [...state.tools, tool] })),
}));
