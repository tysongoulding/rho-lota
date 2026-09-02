import { create } from "zustand";

export interface ArtifactItem {
  id: string;
  name: string; // e.g., "interactive_dashboard.html"
  extension: string; // "html", "md", "json", "sql", "svg", "ts"
  language: string;
  content: string;
  summary: string;
  userFacing: boolean;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_ARTIFACTS: ArtifactItem[] = [
  {
    id: "art-1",
    name: "interactive_dashboard.html",
    extension: "html",
    language: "html",
    summary: "Live interactive telemetry dashboard with responsive gauges, metrics cards, and dark theme CSS.",
    userFacing: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rho Lota Runtime Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #0d1117; color: #c9d1d9; font-family: ui-sans-serif, system-ui, sans-serif; }
    .gauge-circle { transform: rotate(-90deg); transform-origin: 50% 50%; }
  </style>
</head>
<body class="p-6">
  <div class="max-w-4xl mx-auto space-y-6">
    <header class="flex items-center justify-between border-b border-[#30363d] pb-4">
      <div>
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          Rho Lota System Telemetry
        </h1>
        <p class="text-xs text-gray-400 mt-0.5">Session: ses_f8e29a • Active Engine: Claude-3.7-Sonnet</p>
      </div>
      <div class="px-3 py-1 bg-[#161b22] border border-[#30363d] rounded-lg text-xs font-mono text-blue-400">
        Status: ONLINE
      </div>
    </header>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-[#161b22] border border-[#30363d] p-4 rounded-xl">
        <div class="text-xs text-gray-400">Context Window Used</div>
        <div class="text-2xl font-bold text-white font-mono mt-1">14,250 <span class="text-xs text-gray-500 font-sans">/ 200k</span></div>
        <div class="w-full bg-[#0d1117] h-2 rounded-full mt-3 overflow-hidden border border-[#30363d]">
          <div class="bg-blue-500 h-full" style="width: 7.1%"></div>
        </div>
      </div>

      <div class="bg-[#161b22] border border-[#30363d] p-4 rounded-xl">
        <div class="text-xs text-gray-400">FSM Streaming Latency</div>
        <div class="text-2xl font-bold text-emerald-400 font-mono mt-1">18.4 <span class="text-xs text-gray-500 font-sans">ms / tok</span></div>
        <div class="text-[11px] text-emerald-500/90 mt-2 font-medium">99.8% cache hit rate</div>
      </div>

      <div class="bg-[#161b22] border border-[#30363d] p-4 rounded-xl">
        <div class="text-xs text-gray-400">Estimated Turn Cost</div>
        <div class="text-2xl font-bold text-yellow-400 font-mono mt-1">$0.0428</div>
        <div class="text-[11px] text-gray-400 mt-2">Rate card: $3.00/1M input</div>
      </div>
    </div>

    <!-- Interactive Counter Test -->
    <div class="bg-[#161b22] border border-[#30363d] p-5 rounded-xl space-y-3">
      <h3 class="text-sm font-semibold text-white">Live Interactivity Test</h3>
      <p class="text-xs text-gray-400">Click below to test event execution inside the sandbox iframe:</p>
      <div class="flex items-center gap-3">
        <button id="counterBtn" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition">
          Clicks: <span id="clickCount">0</span>
        </button>
        <button onclick="alert('Rho Lota Sandbox Execution Verified!')" class="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg text-xs font-semibold transition">
          Test Trigger
        </button>
      </div>
    </div>
  </div>

  <script>
    let count = 0;
    document.getElementById('counterBtn').addEventListener('click', () => {
      count++;
      document.getElementById('clickCount').textContent = count;
    });
  </script>
</body>
</html>`,
  },
  {
    id: "art-2",
    name: "implementation_plan.md",
    extension: "md",
    language: "markdown",
    summary: "Technical architectural implementation design for multi-agent autonomous tool execution and state recovery.",
    userFacing: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    content: `# Multi-Agent Autonomous Execution Plan

## 1. System Overview
Implementation roadmap for establishing sandboxed background task execution, streaming workbench progress, and real-time state synchronization.

### Key Objectives
- **Zero-Latency Turn Streaming**: Direct SSE pipe from \`crates/rho-engine\` to React LotA front-end.
- **Strict Red-First TDD**: Enforce red-to-green test cycles before committing code changes.
- **Layered Memory Protocol**: Persistent defect cataloging and context retention.

## 2. Proposed Changes
- **\`src/store/uiStore.ts\`**: Router and viewport manager.
- **\`src/components/artifacts/ArtifactPreviewModal.tsx\`**: 80% screen viewport live inspector.
- **\`src/components/views/ArtifactsView.tsx\`**: Card-based artifact catalog.

## 3. Verification Criteria
- [x] All unit tests pass with \`cargo nextest run\`
- [x] Bundle compiles with \`npm run build\` with 0 errors
- [x] HTML artifacts render dynamically inside sandbox iframe`,
  },
  {
    id: "art-3",
    name: "system_architecture.svg",
    extension: "svg",
    language: "xml",
    summary: "Vector diagram visualizing client-side React LotA bridge with Rust Rho-Engine core over IPC sockets.",
    userFacing: true,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#0d1117" />
  <rect x="40" y="40" width="220" height="320" rx="16" fill="#161b22" stroke="#30363d" stroke-width="2" />
  <text x="60" y="80" fill="#58a6ff" font-family="sans-serif" font-weight="bold" font-size="18">React LotA UI</text>
  <text x="60" y="110" fill="#8b949e" font-family="sans-serif" font-size="12">Vite • Tailwind • Zustand</text>
  
  <rect x="70" y="140" width="160" height="50" rx="8" fill="#21262d" stroke="#58a6ff" />
  <text x="90" y="170" fill="#fff" font-family="sans-serif" font-size="13">Chat & Artifacts</text>

  <rect x="70" y="210" width="160" height="50" rx="8" fill="#21262d" stroke="#30363d" />
  <text x="90" y="240" fill="#fff" font-family="sans-serif" font-size="13">Streaming FSM</text>

  <!-- Flow Arrows -->
  <line x1="260" y1="200" x2="500" y2="200" stroke="#007acc" stroke-width="4" stroke-dasharray="6,6" />
  <text x="320" y="185" fill="#007acc" font-family="monospace" font-size="13" font-weight="bold">JSON-RPC / SSE Pipe</text>

  <!-- Rust Engine Box -->
  <rect x="500" y="40" width="260" height="320" rx="16" fill="#161b22" stroke="#8957e5" stroke-width="2" />
  <text x="530" y="80" fill="#d2a8ff" font-family="sans-serif" font-weight="bold" font-size="18">Rust rho-engine</text>
  <text x="530" y="110" fill="#8b949e" font-family="sans-serif" font-size="12">Tokio • Rig Core • MCP Bridge</text>

  <rect x="530" y="140" width="200" height="50" rx="8" fill="#21262d" stroke="#8957e5" />
  <text x="550" y="170" fill="#fff" font-family="sans-serif" font-size="13">Tool Executor / Native</text>

  <rect x="530" y="210" width="200" height="50" rx="8" fill="#21262d" stroke="#30363d" />
  <text x="550" y="240" fill="#fff" font-family="sans-serif" font-size="13">Context Compactor</text>
</svg>`,
  },
  {
    id: "art-4",
    name: "theme_presets.json",
    extension: "json",
    language: "json",
    summary: "JSON schema defining active theme color palettes, background tokens, and accent configurations.",
    userFacing: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    content: `{
  "themeVersion": "2.0.0",
  "activePreset": "Default Dark",
  "presets": [
    {
      "id": "default-light",
      "name": "Default Light",
      "background": "#F9F9F9",
      "foreground": "#101010",
      "accent": "#007acc",
      "sidebarBg": "#f0f2f5"
    },
    {
      "id": "default-dark",
      "name": "Default Dark",
      "background": "#101010",
      "foreground": "#cccccc",
      "accent": "#007acc",
      "sidebarBg": "#0d1117"
    },
    {
      "id": "nord",
      "name": "Nord Arctic",
      "background": "#2e3440",
      "foreground": "#eceff4",
      "accent": "#88c0d0",
      "sidebarBg": "#242933"
    }
  ]
}`,
  },
  {
    id: "art-5",
    name: "schema_migrations.sql",
    extension: "sql",
    language: "sql",
    summary: "Relational database schema migration script for persistent session DAG graph nodes and execution turns.",
    userFacing: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    content: `-- Rho Lota Session DAG Persistence Schema
CREATE TABLE IF NOT EXISTS session_nodes (
    id VARCHAR(64) PRIMARY KEY,
    parent_id VARCHAR(64) REFERENCES session_nodes(id) ON DELETE SET NULL,
    session_title VARCHAR(255) NOT NULL,
    active_persona_id VARCHAR(64) NOT NULL,
    total_tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS turn_events (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL REFERENCES session_nodes(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
    content TEXT NOT NULL,
    tool_call_name VARCHAR(128),
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_turn_events_session ON turn_events(session_id);`,
  },
];

interface ArtifactState {
  artifacts: ArtifactItem[];
  selectedArtifactId: string | null;
  addArtifact: (artifact: Omit<ArtifactItem, "id" | "createdAt" | "updatedAt">) => void;
  updateArtifact: (id: string, content: string, name?: string) => void;
  deleteArtifact: (id: string) => void;
  setSelectedArtifactId: (id: string | null) => void;
}

const STORAGE_KEY = "rho_lota_artifacts_v1";

const loadInitialArtifacts = (): ArtifactItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load artifacts from localStorage", err);
  }
  return DEFAULT_ARTIFACTS;
};

export const useArtifactStore = create<ArtifactState>((set) => ({
  artifacts: loadInitialArtifacts(),
  selectedArtifactId: null,

  addArtifact: (item) =>
    set((state) => {
      const newArt: ArtifactItem = {
        ...item,
        id: `art-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newArt, ...state.artifacts];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to persist artifacts", err);
      }
      return { artifacts: updated };
    }),

  updateArtifact: (id, content, name) =>
    set((state) => {
      const updated = state.artifacts.map((a) => {
        if (a.id === id) {
          const extension = name ? name.split(".").pop() || a.extension : a.extension;
          return {
            ...a,
            content,
            name: name || a.name,
            extension,
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to persist artifacts", err);
      }
      return { artifacts: updated };
    }),

  deleteArtifact: (id) =>
    set((state) => {
      const updated = state.artifacts.filter((a) => a.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to persist artifacts", err);
      }
      return {
        artifacts: updated,
        selectedArtifactId: state.selectedArtifactId === id ? null : state.selectedArtifactId,
      };
    }),

  setSelectedArtifactId: (id) => set({ selectedArtifactId: id }),
}));
