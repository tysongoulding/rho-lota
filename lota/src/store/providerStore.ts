import { create } from "zustand";

export interface ProviderConfig {
  id: string;
  name: string;
  type: "api_key" | "local" | "oauth";
  apiKey?: string;
  endpoint?: string;
  defaultModel: string;
  models: string[];
  isConfigured: boolean;
}

export interface PreamblePreset {
  id: string;
  name: string;
  description: string;
  content: string;
}

const DEFAULT_PREAMBLES: PreamblePreset[] = [
  {
    id: "default-coder",
    name: "Senior Rust & Fullstack Engineer",
    description: "Production-ready, concise, type-safe code with zero placeholders.",
    content: "You are an expert autonomous software engineer. Write idiomatic, robust, and clean code. Follow strict type safety and never emit placeholders.",
  },
  {
    id: "architect",
    name: "Systems Architect & Tech Lead",
    description: "Focuses on high-level system design, cohesion, and boundary isolation.",
    content: "You are a Principal Systems Architect. Analyze trade-offs, modularity, data flow, and error resilience before implementation.",
  },
  {
    id: "reviewer",
    name: "Security & Strict Code Reviewer",
    description: "Interrogates changes for edge-case defects, regressions, and safety risks.",
    content: "You are a strict security and code quality reviewer. Inspect diffs for edge cases, resource leaks, race conditions, and architectural regressions.",
  },
];

const DEFAULT_PROVIDERS: Record<string, ProviderConfig> = {
  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    type: "api_key",
    defaultModel: "claude-3-7-sonnet-20250219",
    models: ["claude-3-7-sonnet-20250219", "claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022"],
    isConfigured: false,
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    type: "api_key",
    defaultModel: "gpt-4o",
    models: ["gpt-4o", "gpt-4o-mini", "o1", "o3-mini"],
    isConfigured: false,
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    type: "api_key",
    defaultModel: "gemini-2.0-flash",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    isConfigured: false,
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    type: "api_key",
    defaultModel: "deepseek-chat",
    models: ["deepseek-chat", "deepseek-reasoner"],
    isConfigured: false,
  },
  groq: {
    id: "groq",
    name: "Groq",
    type: "api_key",
    defaultModel: "llama-3.3-70b-versatile",
    models: ["llama-3.3-70b-versatile", "mixtral-8x7b-32768"],
    isConfigured: false,
  },
  ollama: {
    id: "ollama",
    name: "Ollama (Local LLM)",
    type: "local",
    endpoint: "http://localhost:11434",
    defaultModel: "llama3.2",
    models: ["llama3.2", "qwen2.5-coder:32b", "deepseek-r1:14b"],
    isConfigured: true,
  },
  chatgpt_oauth: {
    id: "chatgpt_oauth",
    name: "ChatGPT (OAuth PKCE)",
    type: "oauth",
    defaultModel: "gpt-4o",
    models: ["gpt-4o", "gpt-4o-mini"],
    isConfigured: false,
  },
  copilot: {
    id: "copilot",
    name: "GitHub Copilot (Device Auth)",
    type: "oauth",
    defaultModel: "claude-3.5-sonnet",
    models: ["claude-3.5-sonnet", "gpt-4o"],
    isConfigured: false,
  },
};

const STORAGE_KEYS = {
  PROVIDERS: "rho_lota_providers_vault_v1",
  PREAMBLES: "rho_lota_preambles_v1",
};

const loadInitialProviders = (): Record<string, ProviderConfig> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PROVIDERS, ...parsed };
    }
  } catch {}
  return DEFAULT_PROVIDERS;
};

const loadInitialPreambles = (): PreamblePreset[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREAMBLES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_PREAMBLES;
};

interface ProviderState {
  providers: Record<string, ProviderConfig>;
  ollamaStatus: "online" | "offline" | "checking" | "unknown";
  preambles: PreamblePreset[];
  activePreambleId: string;

  setApiKey: (id: string, key: string) => void;
  setEndpoint: (id: string, endpoint: string) => void;
  checkOllama: () => Promise<void>;
  savePreamble: (preset: PreamblePreset) => void;
  deletePreamble: (id: string) => void;
  setActivePreambleId: (id: string) => void;
}

export const useProviderStore = create<ProviderState>((set, get) => ({
  providers: loadInitialProviders(),
  ollamaStatus: "unknown",
  preambles: loadInitialPreambles(),
  activePreambleId: "default-coder",

  setApiKey: (id, key) =>
    set((state) => {
      const current = state.providers[id];
      if (!current) return state;
      const updated = {
        ...state.providers,
        [id]: {
          ...current,
          apiKey: key,
          isConfigured: key.trim().length > 0,
        },
      };
      try {
        localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(updated));
      } catch {}
      return { providers: updated };
    }),

  setEndpoint: (id, endpoint) =>
    set((state) => {
      const current = state.providers[id];
      if (!current) return state;
      const updated = {
        ...state.providers,
        [id]: {
          ...current,
          endpoint,
        },
      };
      try {
        localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(updated));
      } catch {}
      return { providers: updated };
    }),

  checkOllama: async () => {
    set({ ollamaStatus: "checking" });
    const endpoint = get().providers.ollama?.endpoint || "http://localhost:11434";
    try {
      const res = await fetch(`${endpoint}/api/tags`);
      if (res.ok) {
        const data = await res.json();
        const models = Array.isArray(data.models)
          ? data.models.map((m: { name: string }) => m.name)
          : get().providers.ollama.models;
        set((state) => {
          const updated = {
            ...state.providers,
            ollama: {
              ...state.providers.ollama,
              models: models.length > 0 ? models : state.providers.ollama.models,
              isConfigured: true,
            },
          };
          try {
            localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(updated));
          } catch {}
          return {
            ollamaStatus: "online",
            providers: updated,
          };
        });
      } else {
        set({ ollamaStatus: "offline" });
      }
    } catch {
      set({ ollamaStatus: "offline" });
    }
  },

  savePreamble: (preset) =>
    set((state) => {
      const exists = state.preambles.some((p) => p.id === preset.id);
      const updated = exists
        ? state.preambles.map((p) => (p.id === preset.id ? preset : p))
        : [...state.preambles, preset];
      try {
        localStorage.setItem(STORAGE_KEYS.PREAMBLES, JSON.stringify(updated));
      } catch {}
      return { preambles: updated };
    }),

  deletePreamble: (id) =>
    set((state) => {
      const updated = state.preambles.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.PREAMBLES, JSON.stringify(updated));
      } catch {}
      return {
        preambles: updated,
        activePreambleId:
          state.activePreambleId === id ? "default-coder" : state.activePreambleId,
      };
    }),

  setActivePreambleId: (id) => set({ activePreambleId: id }),
}));
