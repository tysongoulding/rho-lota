# Project Specification & Delivery Checklist

This specification serves as the living checklist for features, requirements, and deliverables in **`rho`** and **`lota`**. Items are added by the user and checked off (`[x]`) as they are built, validated, and merged.

---

## 📋 Delivery Status Overview

- **Current Version**: `v0.1.7`
- **Active Branch**: `feature/wire-up`
- **Linter Status**: `cargo clippy --all-targets -- -D warnings` (Passing)
- **Format Status**: `cargo fmt --check` (Passing)

---

## 🏛️ Architecture & Dependency Boundary

```text
┌───────────────────────────────────────────────────────────────┐
│                      Desktop UI (lota)                        │
│             Tauri 2.0 + React 19 + TypeScript                 │
│         (Requires rho-harness-core and rho-engine)            │
└──────────────────────────────┬────────────────────────────────┘
                               │ consumes
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                     rho Engine & Core                         │
│        crates/rho-engine  &  crates/rho-harness-core          │
│                (Rig 0.42 Agentic Coding Core)                 │
└──────────────────────────────┬────────────────────────────────┘
                               ▲
                               │ powers
┌──────────────────────────────┴────────────────────────────────┐
│                   Standalone CLI (rho)                        │
│           100% Independent Single Binary (No GUI)             │
│            Runs headless, in terminal, or in CI/CD            │
└───────────────────────────────────────────────────────────────┘
```

- **`rho` (CLI)** is completely standalone. It compiles to a lightweight single binary with zero GUI, Webview, or Tauri dependencies.
- **`lota` (Desktop UI)** is a companion layer that directly consumes `rho`'s core engine, reading shared credentials from `~/.config/rho/auth.json` and storing desktop preferences in `~/.config/rho/lota/`.

---

## ✅ Completed Milestones

### Phase 1: Core Desktop Interface (`lota`)
- [x] **Frameless Native Window**: Custom draggable titlebar with native minimize, maximize/restore, and close buttons (`Titlebar.tsx`, Tauri IPC).
- [x] **Universal Navigation**: Standalone views for **Chat**, **Customise**, **Artifacts**, **Automations**, and **Settings Hub** (`App.tsx` router).
- [x] **Statusbar Telemetry**: Bottom statusbar displaying working directory (`cwd`), git repo, branch, worktree, active model, and token budget gauge.
- [x] **Typography & Styling**: Clean GitHub dark mode styling with full typography hierarchy and customizable theme engine (Default Light, Default Dark, Dracula, Nord, Cyberpunk).
- [x] **Home Hero View**: Centered greeting, live time, dynamic weather indicator, quick-start prompt badges, and new chat launcher.

### Phase 2: Agent Architecture & Personas
- [x] **Chat Personas in Customise**: Moved general chat personas into **Customise > Chat Personas** for global tone control.
- [x] **Standalone Subagents**: Decoupled subagents from personas with individual workspace isolation modes, custom preambles, and tool permissions.
- [x] **Direct Agent Chat**: Clicking an agent initiates direct chat with a top agent banner and hover triple-dot menu (Rename, Edit, Clone, Delete).

### Phase 3: Live LLM Engine & Streaming Bridge
- [x] **Live Multi-Provider Execution**: Replaced simulated mock generation with real async API requests for **Google Gemini**, **Anthropic (Claude)**, **OpenAI**, **DeepSeek**, **Groq**, and **Ollama**.
- [x] **Typewriter Token Streaming**: Live streaming of reasoning/thinking tokens and response markdown over Tauri `rho://event` bus.
- [x] **Copy/Paste Ergonomics**: Added dedicated 1-click **`[📋 Copy]`** buttons on assistant cards and user messages, with full `select-text` clipboard support.
- [x] **Active Model Selector**: Persistent active provider/model switcher in Titlebar and Settings with active badges.

### Phase 4: Shared Authentication & Upstream Integration
- [x] **Single Credential Vault**: Shared `~/.config/rho/auth.json` file between CLI and Desktop UI.
- [x] **Live Provider Test Probe**: Real network validation on the **`[⚡ Test]`** button with latency metrics.
- [x] **Upstream Release 0.1.7 Sync**: Merged upstream release 0.1.7 and fixed Gemini client builder `.no_proxy()` and API key passing (PR #7).

---

## 🚀 Active / In-Progress Tasks

### Stage 2: Native Tool Execution & Interactive Cards
- [ ] **Native Tool Execution Bridging**: Connect desktop UI prompts to execute native engine tools (`read`, `write`, `edit`, `bash`, `search`, `fetch`) and stream structured results into `ToolActionCard.tsx`.
- [ ] **Interactive Approval Dialogs**: Trigger `ApprovalModal.tsx` when destructive commands (`bash`, file overwrites) require user confirmation.
- [ ] **Live Diff Viewer in Workbench**: Populate `StreamingWorkbench.tsx` with live syntax-highlighted side-by-side / inline git diffs during file edits.

### Stage 3: Artifacts & Advanced Visualizations
- [ ] **Artifact Extraction & Live HTML Preview**: Automatically detect generated HTML/SVG artifacts and render them in the 80% viewport live preview modal.
- [ ] **Session DAG Graph Visualizer**: Render conversational branches, tool execution trees, and fork checkpoints in `SessionGraphViewer.tsx`.
- [ ] **Automation Scheduled Tasks**: Wire up background cron runner for scheduled prompt tasks in `AutomationView.tsx`.

---

## 📝 User Requirements & Backlog

*Add your new feature requests, UX refinements, or specific tasks below:*

- [ ] 
- [ ] 
- [ ] 
