# Lota Frontend Agent Instructions

`lota` is the native desktop frontend for `rho` built with **Tauri 2.0**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## 1. Architecture & Data Flow

`lota` is an **event-driven, streaming workspace application**. It does **not** follow traditional REST/CRUD request-response patterns.

```text
┌──────────────────────────────────────────────────────────┐
│                      Lota UI (Webview)                   │
│                                                          │
│  [Prompt / Steer / Abort]        [Render Feed / Diffs]   │
│            │                               ▲             │
│   invoke("send_rpc_command")       listen("rho://event") │
└────────────┼───────────────────────────────┼─────────────┘
             ▼                               │
┌──────────────────────────────────────────────────────────┐
│               Tauri 2.0 Backend (src-tauri)              │
│                                                          │
│              Rho Engine & Harness Core                   │
│  (rho-harness-core::rpc::protocol / rho-engine runtime)  │
└──────────────────────────────────────────────────────────┘
```

### IPC Bridge Protocol

1. **Commands (Frontend → Backend)**: Sent via `invoke("send_rpc_command", { request: RpcRequest })`.
   - `prompt`: Starts a new turn with `{ type: "prompt", message: string }`.
   - `steer`: Adjusts course on an active turn with `{ type: "steer", message: string }`.
   - `abort`: Cancels execution via `{ type: "abort" }`.
   - `tool_response`: Resolves human-in-the-loop tool approvals with `{ type: "tool_response", approval_id: string, decision: "allow" | "deny" }`.
   - `compact`, `set_model`, `get_state`, `exit`.

2. **Events (Backend → Frontend)**: Streamed via Tauri event bus `rho://event` as `RpcEvent`.
   - `session_start`: Active session ID, model, and provider identity.
   - `turn_start` / `turn_end`: Turn lifecycle boundaries and stop reasons.
   - `text_chunk`: Incremental assistant output tokens.
   - `reasoning_chunk`: Incremental thinking tokens (model chain-of-thought).
   - `tool_call_start` / `tool_call_result`: Tool execution parameters, outputs, and errors.
   - `tool_approval_request`: Human-in-the-loop gate before dangerous operations.
   - `usage_update`: Context window percentage and token consumption metrics.

---

## 2. Tech Stack & Library Discipline

| Responsibility | Tool / Library | Golden Rule |
|---|---|---|
| **Rust ↔ TS Types** | `protocol.ts` / `tauri-specta` | Keep synchronized with `crates/rho-harness-core/src/rpc/protocol.rs`. |
| **Streaming State** | `Zustand` (`src/store/`) | Use Zustand with shallow selectors for token chunks, messages, and approvals. |
| **Static Metadata** | `TanStack Query` | Use **only** for reading saved sessions, config files, and model lists from disk. **Never** use for active streaming turns. |
| **Workspace State** | `Zustand` UI slices | Tab/panel switching (sidebar, active session, settings) lives in client state. Avoid URL routing. |
| **List Performance** | `@tanstack/react-virtual` | Long conversation logs and tool call histories **must** be virtualized. |
| **Syntax Highlighting** | `shiki` | Highlight code blocks and tool file outputs. |
| **Diffs** | `@git-diff-view/react` | Render unified and split diffs for `edit` tool events. |
| **Styling** | `Tailwind CSS` + `clsx` + `tailwind-merge` | Use CSS variables and dark-theme tokens (`#0d1117`, `#161b22`, `#30363d`). |
| **Icons** | `lucide-react` | Standard desktop icon set. |

---

## 3. Core Component Patterns

### Prompt Input Bar
- Use an **uncontrolled `textarea`** with a custom keyboard event handler.
- `Enter`: Submit message (or queue if turn is active).
- `Shift+Enter` / `Ctrl+J`: Insert newline without submitting.
- `Escape`: Clear input draft or trigger abort when running.
- Support `@skill` and `/command` auto-complete popovers.

### Tool Approval Flow
When receiving `RpcEvent::ToolApprovalRequest`:
1. Render an interactive approval banner in the message stream.
2. Provide explicit **Approve** (`allow`) and **Reject** (`deny`) actions.
3. Call `rhoClient.respondToTool(approval_id, decision)` to release the Rust engine lock.

### Streaming Markdown Safety
- Always handle incomplete markdown tokens gracefully (unclosed code fences, partial KaTeX delimiters).
- Stream text chunks into buffer state without re-parsing entire conversation history.

---

## 4. Engineering Standards

- **File Conciseness**: Target ~150 lines per file. Split components along natural boundaries (e.g. `MessageItem`, `ToolCallBlock`, `ThinkingBlock`, `PromptInput`).
- **No Blind Dependencies**: Do not introduce heavy UI frameworks or external CSS-in-JS dependencies.
- **Type Rigor**: Maintain strict TypeScript typing (`noImplicitAny`, strict null checks).
- **Validation**:
  - Run `npm run build` (TypeScript check & Vite build) before completing frontend work.
  - Run `cargo check --workspace` to ensure Rust backend and Tauri bindings remain green.
