# Backend Requests & Requirements Log

This document logs requested capabilities, RPC endpoints, and engine features needed by the `lota` frontend that require changes to the core `rho` Rust crates (`crates/rho-engine`, `crates/rho-harness-core`, or root `src/`).

> [!IMPORTANT]
> **Agents working on `lota` must never directly modify files outside `lota/`.** Log all requested backend changes here so they can be prioritized, reviewed, and implemented in the core workspace independently.

---

## Request Format Template

```markdown
### [FEATURE/BUG] Short Title
- **Date**: YYYY-MM-DD
- **Target Crate / Area**: (e.g. `crates/rho-harness-core/src/rpc/protocol.rs`)
- **Motivation / Frontend Need**: Why does the UI need this?
- **Proposed Protocol / Interface Change**:
  - Command / Event payload schema
  - Expected behavior
- **Temporary Frontend Workaround**: How the frontend is stubbing/mocking this in the meantime.
- **Status**: `Pending` | `In Review` | `Completed`
```

---

## Active & Pending Requests

### [REQ-001] Artifact Extractor & Disk Storage Vault
- **Date**: 2026-09-02
- **Target Crate / Area**: `crates/rho-engine/src/engine/artifacts/` & `crates/rho-harness-core`
- **Motivation / Frontend Need**: The `ArtifactsView.tsx` and `ArtifactPreviewModal.tsx` require an automated extraction service that intercepts code artifacts (`.html`, `.svg`, `.mmd`, `.drawio`, `.md`, `.tsx`), stores them persistently in `~/.config/rho/artifacts/<session_id>/`, and provides metadata indexing.
- **Proposed Protocol / Interface Change**:
  - Event: `RpcEvent::ArtifactGenerated { id, name, extension, language, content, summary, user_facing, path }`
  - Command: `RpcCommand::ListArtifacts { session_id: Option<String> }` -> returns `Vec<ArtifactMetadata>`
- **Temporary Frontend Workaround**: Seeded in-memory sample list in `artifactStore.ts`.
- **Status**: `Pending`

---

### [REQ-002] Background Cron Task Scheduler for Automations
- **Date**: 2026-09-02
- **Target Crate / Area**: `crates/rho-engine` & `lota/src-tauri`
- **Motivation / Frontend Need**: The `AutomationView.tsx` interface allows users to configure recurring jobs (e.g. `*/30 * * * *` cargo test, nightly context compaction, PR triage). Requires a background cron engine to trigger turns on schedule.
- **Proposed Protocol / Interface Change**:
  - Command: `RpcCommand::RegisterCronJob { id, name, cron, prompt, target_agent }`
  - Command: `RpcCommand::TriggerCronJobNow { id }`
  - Event: `RpcEvent::CronJobExecuted { id, success, duration_ms, summary }`
- **Temporary Frontend Workaround**: Mock job cards with UI toast on manual trigger.
- **Status**: `Pending`

---

### [REQ-003] Persistent Token & Cost Usage Ledger
- **Date**: 2026-09-02
- **Target Crate / Area**: `crates/rho-harness-core/src/telemetry/` or `crates/rho-engine`
- **Motivation / Frontend Need**: `UsageBillingSettings.tsx` requires historical token telemetry across providers and models to render daily/monthly spend, token graphs, and cost estimates.
- **Proposed Protocol / Interface Change**:
  - File: `~/.config/rho/usage.jsonl` or SQLite store recording `{ timestamp, session_id, provider, model, input_tokens, output_tokens, cache_read_tokens, estimated_cost }`.
  - Command: `RpcCommand::GetUsageSummary { start_date, end_date }` -> returns aggregated time-series buckets.
- **Temporary Frontend Workaround**: Mocked static charts in `UsageBillingSettings.tsx`.
- **Status**: `Pending`

---

### [REQ-004] Rig Structured Plan Extractor Tool
- **Date**: 2026-09-02
- **Target Crate / Area**: `crates/rho-engine/src/tools/`
- **Motivation / Frontend Need**: `StructuredPlanView.tsx` renders phase cards with checklists. Needs Rig structured extraction to parse engineering milestones and update task completion in real-time.
- **Proposed Protocol / Interface Change**:
  - Schema: `PlanItem { id, phase, title, description, is_completed, dependencies }`
  - Event: `RpcEvent::PlanUpdated { phases: Vec<PlanPhase> }`
- **Temporary Frontend Workaround**: Static mock architectural checklist in `StructuredPlanView.tsx`.
- **Status**: `Pending`
