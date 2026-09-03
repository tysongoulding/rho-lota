# lota

`lota` is the official desktop graphical frontend for [`rho`](../README.md), a fast, minimal agentic coding harness in Rust.

Built with **Tauri 2.0**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Zustand**, `lota` provides a native desktop interface for pair programming with `rho`—featuring real-time token streaming, thinking-block collapse/expansion, inline tool action cards, session DAG trees, unified diff visualization, dynamic model switching with reasoning budget controls, morning briefing synthesis, and a command palette.

---

## Visual Layout & Component Diagram

Use this ASCII map to locate components for **MACD** (Move, Add, Change, Delete) operations:

```text
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [C-TITLEBAR] Titlebar.tsx                                                                                             │
│  [Logo ρ] [C-SIDEBAR-TOGGLE] [C-WORKSPACE-PILL] [Model/Provider] ... [FSM Status] [C-WB-TOGGLE] [—][▢][✕]             │
├─────────────────────┬────────────────────────────────────────────────────────────┬────────────────────────────────────┤
│ [C-SIDEBAR]         │ [C-MAIN-VIEW] App.tsx Router                               │ [C-WORKBENCH]                      │
│ Sidebar.tsx         │                                                            │ StreamingWorkbench.tsx             │
│                     │  Active View: 'chat' / 'files' / 'customise' / 'settings'  │                                    │
│ [Chats Accordion]   │  ┌──────────────────────────────────────────────────────┐  │ Tabs:                              │
│ • [Active Chat]     │  │ [C-HOME-HERO] HomeHeroView.tsx                       │  │ [Diff] [File] [Thinking]           │
│                     │  │  ├─ [C-MORNING-REPORT] MorningReportWidget.tsx       │  │ [Usage] [JSON]                     │
│ [Agents Accordion]  │  │  └─ [C-PROMPT-INPUT] PromptInput.tsx                 │  │ ─────────────────────────────── │
│ • [Coder / Scout]   │  ├──────────────────────────────────────────────────────┤  │ • [C-DIFF-VIEWER]               │
│                     │  │ [C-FEED] VirtualizedMessageFeed.tsx                  │  │   DiffViewer.tsx                │
│ [Views Navigation]  │  │  ├─ Turn history & assistant streams                 │  │ • [C-FILE-PREVIEW]              │
│ • [Customise Hub]   │  │  └─ [C-ACTION-CARDS] Dynamic tool visualizers        │  │   CodeBlock.tsx                 │
│ • [Artifacts]       │  ├──────────────────────────────────────────────────────┤  │ • [C-THINKING-STREAM]           │
│ • [Automations]     │  │ [C-PROMPT-INPUT] PromptInput.tsx                     │  │   Full reasoning stream log     │
│ • [Settings]        │  │  ├─ [C-ADD-CONTEXT] AddContextDropup.tsx             │  │ • [C-USAGE-VIEWER]              │
│                     │  │  ├─ [C-MODEL-DROPUP] ModelDropupPicker.tsx           │  │   Live token cost & ledger      │
│                     │  │  ├─ [C-RING-GAUGE] ContextRingGauge.tsx              │  │ • [C-JSON-INSPECTOR]            │
│                     │  │  └─ Textarea + Mic + Send / Stop buttons             │  │                                 │
│                     │  └──────────────────────────────────────────────────────┘  │                                 │
├─────────────────────┴────────────────────────────────────────────────────────────┴────────────────────────────────────┤
│ [C-STATUSBAR] Statusbar.tsx                                                                                           │
│  [Ctrl+K Palette]   [📁 Cwd: c:\...\rho]   [🌿 rho-lota / lota-feature]   [Ctrl+B Sidebar]   [Ctrl+\ Workbench]        │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

GLOBAL OVERLAYS & MODALS:
 • [C-CONTEXT-MODAL] ContextWindowModal.tsx (100% full-capacity proportional memory diagnostics)
 • [C-COMMAND-PALETTE] CommandPalette.tsx (Ctrl+K global launcher)
 • [C-APPROVAL-MODAL] ApprovalModal.tsx (Tool security gate)
 • [C-TOAST-CONTAINER] ToastContainer.tsx (Toast notification alerts)
```

---

## MACD Component Reference Catalog

Use these component IDs and file paths when requesting **Move**, **Add**, **Change**, or **Delete** modifications:

| Component ID | Component Name | File Path | Primary Store / Hook | Description |
|---|---|---|---|---|
| `C-TITLEBAR` | `<Titlebar />` | `src/components/layout/Titlebar.tsx` | `sessionStore`, `uiStore`, `workspaceStore` | Frameless header with native drag, sidebar toggle, workspace path, status pill, and window controls. |
| `C-SIDEBAR` | `<Sidebar />` | `src/components/layout/Sidebar.tsx` | `uiStore`, `subagentStore`, `sessionStore` | Left navigation menu with isolated Chats, Agents, and View routes (single-active highlight). |
| `C-STATUSBAR` | `<Statusbar />` | `src/components/layout/Statusbar.tsx` | `workspaceStore`, `uiStore` | Bottom bar displaying local directory (cwd), repo / branch / worktree popovers, and shortcut hints. |
| `C-PROMPT-INPUT` | `<PromptInput />` | `src/components/editor/PromptInput.tsx` | `useRhoEngine`, `workspaceStore`, `useTurnQueue` | Multiline prompt textarea with auto-expansion, Add Context dropup, model picker, and context ring gauge. |
| `C-ADD-CONTEXT` | `<AddContextDropup />` | `src/components/editor/AddContextDropup.tsx` | `workspaceStore`, `toastStore` | `[+]` Context dropup for Media uploads, `@` Mentions, `/` Actions, and Browser web search. |
| `C-MODEL-DROPUP`| `<ModelDropupPicker />` | `src/components/editor/ModelDropupPicker.tsx` | `providerStore`, `sessionStore` | Dynamic model selector filtered by configured API keys + Thinking Budget (`Off`, `Low`, `Med`, `High`). |
| `C-RING-GAUGE` | `<ContextRingGauge />` | `src/components/editor/ContextRingGauge.tsx` | `sessionStore`, `modelLimits` | Circular SVG progress ring gauge showing live token consumption with hover tooltip. |
| `C-CONTEXT-MODAL`| `<ContextWindowModal />`| `src/components/modals/ContextWindowModal.tsx` | `sessionStore`, `modelLimits` | Detailed context memory diagnostics with a 100% full model capacity proportional scale bar. |
| `C-MORNING-REPORT`| `<MorningReportWidget />`| `src/components/home/MorningReportWidget.tsx` | `sessionStore`, `uiStore` | Morning Briefing hub integrating Google/Outlook Calendars, Gmail/Outlook inboxes, and Slack/Teams chat. |
| `C-HOME-HERO` | `<HomeHeroView.tsx>` | `src/components/home/HomeHeroView.tsx` | `userStore`, `sessionStore` | Home screen with time-aware greeting, interactive 12H/24H clock, morning report, and prompt composer. |
| `C-WORKBENCH` | `<StreamingWorkbench />` | `src/components/workbench/StreamingWorkbench.tsx` | `uiStore`, `sessionStore`, `workspaceStore` | Split-pane for Active Diffs, File Previews, Thinking Streams, Token Usage ledger, and Raw JSON. |
| `C-FEED` | `<VirtualizedMessageFeed />` | `src/components/chat/VirtualizedMessageFeed.tsx` | `sessionStore`, `@tanstack/react-virtual` | 60 FPS virtualized message list rendering historical turns, streaming assistant text, and action cards. |
| `C-PROFILE-SETTINGS`| `<ProfileSettings />` | `src/components/settings/ProfileSettings.tsx` | `userStore` | User profile management for full name, display name, avatar color, role, and timezone. |
| `C-PROVIDERS` | `<ModelProviderSettingsView />` | `src/components/settings/ModelProviderSettingsView.tsx` | `providerStore` | API Key vault (Anthropic, OpenAI, Gemini, DeepSeek, Groq), Ollama prober, and Preamble Editor. |
| `C-APPEARANCE` | `<AppearanceSettings />` | `src/components/settings/AppearanceSettings.tsx` | `themeStore` | Theme switcher (Light/Dark/System), presets (Dracula, Nord, Cyberpunk), and hex color customizer. |

---

## State Stores

- `sessionStore.ts` — FSM state machine (`turnPhase`), active messages, tool approvals, compaction telemetry, and append-only `rawEvents`.
- `userStore.ts` — User profile (`fullName`, `displayName`, `avatarColor`, `role`, `timezone`) with persistent localStorage sync.
- `subagentStore.ts` — Isolated subagent conversation threads (`agentMessages`) and active agent selection.
- `workspaceStore.ts` — Local directory (`workspacePath`), repo name, git branch, worktree, file tree, and `@attachedFiles`.
- `providerStore.ts` — API key credentials, active provider/model, thinking effort budget (`high`, `med`, `low`, `off`), and local endpoints.
- `themeStore.ts` — Theme mode (`light` / `dark` / `system`), presets, custom hex palette, and CSS variable injector.
- `uiStore.ts` — Active view router, sidebar toggle, workbench toggle (`diff`, `file`, `thinking`, `usage`, `json`), and modals.
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

# 4. Run automated Playwright E2E test suite
npm run test:e2e

# 5. Typecheck and build production bundle
npm run build
```
