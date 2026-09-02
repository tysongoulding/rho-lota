# lota

`lota` is the official desktop graphical frontend for [`rho`](../README.md), a fast, minimal agentic coding harness in Rust.

Built with **Tauri 2.0**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Zustand**, `lota` provides a native desktop interface for pair programming with `rho`—featuring real-time token streaming, thinking-block collapse/expansion, inline tool action cards, session DAG trees, unified diff visualization, and a command palette.

---

## Visual Layout & Component Diagram

Use this ASCII map to locate components for **MACD** (Move, Add, Change, Delete) operations:

```text
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [C-TITLEBAR] Titlebar.tsx                                                                                             │
│  [Logo ρ] [C-SIDEBAR-TOGGLE] [C-WORKSPACE-PILL] [Model/Provider] ... [FSM Status] [Context %] [C-WB-TOGGLE] [—][▢][✕] │
├─────────────────────┬────────────────────────────────────────────────────────────┬────────────────────────────────────┤
│ [C-SIDEBAR]         │ [C-MAIN-VIEW] App.tsx Router                               │ [C-WORKBENCH]                      │
│ Sidebar.tsx         │                                                            │ StreamingWorkbench.tsx             │
│                     │  Active View: 'chat' / 'files' / 'settings'                │                                    │
│ [New Agent]         │  ┌──────────────────────────────────────────────────────┐  │ Tabs:                              │
│ [New Chat]          │  │ [C-SETTINGS-HUB] SettingsHubView.tsx                 │  │ [Diff] [File] [Thinking] [JSON]    │
│                     │  │  Horizontal Tabs:                                    │  │ ─────────────────────────────── │
│ Workspace:          │  │  [General][App][Agents][Tools][Plans][DAG][AI][Theme]│  │ • [C-DIFF-VIEWER]               │
│ • [Chat Feed]       │  │  ┌─────────────────────────────────────────────────┐ │  │   DiffViewer.tsx                │
│ • [Files Explorer]  │  │  │ Sub-View Tab Panel Content                      │ │  │ • [C-FILE-PREVIEW]              │
│                     │  │  └─────────────────────────────────────────────────┘ │  │   CodeBlock.tsx (Selected file) │
│ ─────────────────── │  └──────────────────────────────────────────────────────┘  │ • [C-THINKING-STREAM]           │
│ [⚙ Settings Button] │                                                            │   Full reasoning stream log     │
│ [Session ID Badge]  │                                                            │ • [C-JSON-INSPECTOR]            │
│                     │  │                                                      │  │                                 │
│                     │  │ [C-APPROVAL-MODAL] ApprovalModal.tsx                 │  │                                 │
│                     │  │ [C-QUEUE-BADGE] QueueBadge.tsx (FIFO turns)          │  │                                 │
│                     │  └──────────────────────────────────────────────────────┘  │                                 │
│                     │  ┌──────────────────────────────────────────────────────┐  │                                 │
│                     │  │ [C-PROMPT-INPUT] PromptInput.tsx                     │  │                                 │
│                     │  │  ├─ [C-ATTACHED-CHIPS] Attached @file pills          │  │                                 │
│                     │  │  ├─ [C-AUTOCOMPLETE] AutocompleteMenu.tsx            │  │                                 │
│                     │  │  └─ Textarea + Send / Abort buttons                  │  │                                 │
│                     │  └──────────────────────────────────────────────────────┘  │                                 │
├─────────────────────┴────────────────────────────────────────────────────────────┴────────────────────────────────────┤
│ [C-STATUSBAR] Statusbar.tsx                                                                                           │
│  [Ctrl+K Palette]   [📁 Cwd: c:\...\rho]   [🌿 rho-lota / feature/07-ui_ux]   [Bot: Coder]   [Ctrl+B]   [Ctrl+\]      │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

GLOBAL OVERLAYS & MODALS:
 • [C-COMMAND-PALETTE] CommandPalette.tsx (Ctrl+K global launcher)
 • [C-TOAST-CONTAINER] ToastContainer.tsx (Toast notification popups)
 • [C-DRAG-OVERLAY] App.tsx (Drag-and-drop file drop zone)
```

---

## MACD Component Reference Catalog

Use these component IDs and file paths when requesting **Move**, **Add**, **Change**, or **Delete** modifications:

| Component ID | Component Name | File Path | Primary Store / Hook | Description |
|---|---|---|---|---|
| `C-TITLEBAR` | `<Titlebar />` | `src/components/layout/Titlebar.tsx` | `sessionStore`, `uiStore`, `workspaceStore` | Frameless header with native drag, sidebar toggle, workspace path, status pill, and window controls (`—`, `▢`, `✕`). |
| `C-SIDEBAR` | `<Sidebar />` | `src/components/layout/Sidebar.tsx` | `uiStore`, `sessionStore` | Left workspace navigation menu with view switcher (`chat`, `files`, `agents`, `tools`, `plans`, `sessions`, `settings`, `appearance`). |
| `C-STATUSBAR` | `<Statusbar />` | `src/components/layout/Statusbar.tsx` | `workspaceStore`, `agentStore`, `uiStore` | Bottom bar displaying local directory (cwd), repo / branch / worktree, active persona, model, and shortcut hints. |
| `C-FEED` | `<VirtualizedMessageFeed />` | `src/components/chat/VirtualizedMessageFeed.tsx` | `sessionStore`, `@tanstack/react-virtual` | 60 FPS virtualized message list rendering historical turns, streaming assistant text, and action cards. |
| `C-PROMPT-INPUT` | `<PromptInput />` | `src/components/editor/PromptInput.tsx` | `useRhoEngine`, `workspaceStore`, `useTurnQueue` | Multiline prompt textarea with file tag chips, Enter-to-send, and Esc-to-abort. |
| `C-AUTOCOMPLETE` | `<AutocompleteMenu />` | `src/components/editor/AutocompleteMenu.tsx` | `workspaceStore` | Inline fuzzy popover when typing `@` (workspace files/skills) or `/` (slash commands). |
| `C-CODEBLOCK` | `<CodeBlock />` | `src/components/chat/CodeBlock.tsx` | `lib/highlighter.ts` (Shiki) | Syntax-highlighted code container with language badge and 1-click copy-to-clipboard. |
| `C-DIFF-VIEWER` | `<DiffViewer />` | `src/components/chat/DiffViewer.tsx` | `lib/diff.ts` | Unified (inline) and Side-by-Side (split) diff viewer with line numbers and copy action. |
| `C-WORKBENCH` | `<StreamingWorkbench />` | `src/components/workbench/StreamingWorkbench.tsx` | `uiStore`, `sessionStore`, `workspaceStore` | Collapsible right split-pane for Active Diffs, File Previews, Thinking Streams, and Raw JSON. |
| `C-ACTION-CARDS` | `<ToolActionCard />` | `src/components/cards/ToolActionCard.tsx` | `sessionStore` | Central dispatcher routing tool calls to dedicated visual cards. |
| `C-BASH-CARD` | `<BashTerminalCard />` | `src/components/cards/BashTerminalCard.tsx` | `sessionStore` | Interactive terminal block with command, exit code, duration, and ANSI output. |
| `C-EDIT-CARD` | `<FileEditCard />` | `src/components/cards/FileEditCard.tsx` | `sessionStore` | Dedicated file edit action card with embedded `<DiffViewer />`. |
| `C-WRITE-CARD` | `<FileWriteCard />` | `src/components/cards/FileWriteCard.tsx` | `sessionStore` | File write action card with line counts and syntax-highlighted preview. |
| `C-READ-CARD` | `<FileReadCard />` | `src/components/cards/FileReadCard.tsx` | `sessionStore` | File read card with line ranges (`L1–L80`) and code snippet viewer. |
| `C-SEARCH-CARD` | `<WebSearchCard />` | `src/components/cards/WebSearchCard.tsx` | `sessionStore` | Web search card with query term and structured summary view. |
| `C-FETCH-CARD` | `<WebFetchCard />` | `src/components/cards/WebFetchCard.tsx` | `sessionStore` | URL fetch card with external link opener and markdown text extractor. |
| `C-MCP-CARD` | `<McpToolCard />` | `src/components/cards/McpToolCard.tsx` | `sessionStore` | Generic card for dynamic MCP server tools and argument inspection. |
| `C-WORKSPACE-TREE`| `<WorkspaceExplorer />` | `src/components/workspace/WorkspaceExplorer.tsx` | `workspaceStore` | Collapsible project file explorer with search filter, preview actions, and `@file` context tagging. |
| `C-CONTEXT-GAUGE` | `<ContextGauge />` | `src/components/workspace/ContextGauge.tsx` | `sessionStore`, `workspaceStore` | Visual token budget progress bar and auto-compaction warning indicators. |
| `C-COMMAND-PALETTE`| `<CommandPalette />` | `src/components/palette/CommandPalette.tsx` | `uiStore`, `sessionStore`, `agentStore` | Global <kbd>Ctrl+K</kbd> modal for keyboard navigation, actions, and persona switching. |
| `C-TOASTS` | `<ToastContainer />` | `src/components/common/ToastContainer.tsx` | `toastStore` | Floating animated toast notification alerts. |
| `C-APPEARANCE` | `<AppearanceSettings />` | `src/components/settings/AppearanceSettings.tsx` | `themeStore` | Theme switcher (Light/Dark/System), presets (Dracula, Nord, Cyberpunk), and hex color customizer. |
| `C-PROVIDERS` | `<ModelProviderSettingsView />` | `src/components/settings/ModelProviderSettingsView.tsx` | `providerStore` | API Key vault (Anthropic, OpenAI, Gemini, DeepSeek, Groq), Ollama prober, and Preamble Editor. |
| `C-AGENT-INSPECTOR`| `<AgentInspector />` | `src/components/agent/AgentInspector.tsx` | `agentStore` | Rig AgentBuilder inspector for preambles, reasoning budgets, and attached tools. |
| `C-TOOLBOX-MGR` | `<ToolboxManager />` | `src/components/agent/ToolboxManager.tsx` | `agentStore` | Dynamic tool permission toggles and MCP server manager. |
| `C-PLAN-TRACKER` | `<StructuredPlanView />` | `src/components/artifacts/StructuredPlanView.tsx` | — | Interactive Rig extractor task checklist with progress bars. |
| `C-SESSION-DAG` | `<SessionGraphViewer />` | `src/components/dag/SessionGraphViewer.tsx` | `sessionStore` | Visual execution tree of conversational turns, tool forks, and checkpoints. |

---

## State Stores

- `sessionStore.ts` — FSM state machine (`turnPhase`), active messages, tool approvals, and append-only `rawEvents`.
- `workspaceStore.ts` — Local directory (`workspacePath`), repo name, git branch, worktree, file tree, and `@attachedFiles`.
- `providerStore.ts` — API key credentials, local Ollama endpoints, model discovery, and system preambles.
- `agentStore.ts` — Rig agent personas (Coder, Architect, Researcher, Reviewer) and tool permissions.
- `themeStore.ts` — Theme mode (`light` / `dark` / `system`), presets, custom hex palette, and CSS variable injector.
- `uiStore.ts` — Active view router, sidebar toggle, workbench toggle, and command palette modal state.
- `toastStore.ts` — Global toast notification dispatch queue.

---

## Development

```powershell
# 1. Install frontend dependencies
npm install

# 2. Run in browser dev mode (Instant HMR on localhost:1420)
npm run dev

# 3. Run native Tauri 2.0 desktop application
npm run tauri dev

# 4. Typecheck and build production bundle
npm run build
```
