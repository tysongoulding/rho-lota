# Lota Frontend Agent Instructions

`lota` is the native desktop frontend for `rho` built with **Tauri 2.0**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## 0. Scope & Boundary Rules (MANDATORY)

- **NEVER touch or modify any files outside the `lota/` directory.**
- **Backend Change Isolation**: If a frontend feature or bugfix requires new Rust engine capabilities, modified RPC protocol endpoints, CLI changes, or crates adjustments (`crates/rho-engine`, `crates/rho-harness-core`, root `src/`):
  1. **DO NOT** edit core backend files directly.
  2. Document the exact requirement, proposed Rust struct/RPC command, and rationale in [`lota/backend-requests.md`](./backend-requests.md).
  3. Mock or stub the missing capability on the frontend (e.g., in `src/lib/rpc.ts`) until the backend change is implemented and reviewed.

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
│ └────────────┼───────────────────────────────┼─────────────┘
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

## 2. UI/UX Rules & Invariants

### Prompt Composer & Controls
- **Floating Pill Container**: Auto-expanding textarea that grows smoothly upward on multi-line text (`min-h-[32px]` up to `180px` max).
- **Add Context Dropup `[+]`**: Fast access to Media uploads, `@` Mentions, `/` Actions, and Browser web fetch tools.
- **Dynamic Model Dropup**: Filters strictly to providers with active API keys or local services; provides single-row thinking budget controls (`Off`, `Low`, `Med`, `High`).
- **Thinking Capability Guard**: Models without extended thinking (e.g. `GPT-4o`, `Claude 3.5 Sonnet`) display as `Standard Model` and omit reasoning budget payloads.
- **Context Ring Gauge**: Circular SVG gauge left of the prompt button showing real token consumption and 1-click modal diagnostics.

### Subagent vs. Chat Separation
- **Independent Threads**: Subagents maintain their own isolated conversation history in `subagentStore.agentMessages`. Clicking an agent switches threads directly without polluting the general Chats list.
- **Single-Highlight Invariant**: In `Sidebar.tsx`, only one item may be highlighted at any given time (an Agent, a Chat, or a View).

### Context Memory Diagnostics
- **100% Full-Capacity Scale**: The memory bar in `ContextWindowModal.tsx` must represent the full context capacity ceiling from `modelLimits.ts`, showing System, Tools, Turn History, Compacted Memory Reclaimed, and Headroom.

---

## 3. Engineering Standards

- **File Conciseness**: Target ~150 lines per file. Split components along natural boundaries.
- **Strict Red-First Verification**: Run `npm run test:e2e` Playwright suite after modifying any UI layout or store flow.
- **Type Rigor**: Strict TypeScript typing (`noImplicitAny`, strict null checks).
- **Zero Mock Fallbacks in Diagnostics**: Always wire live model capacity dictionaries and active store state rather than static mock percentages.
