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

*(None currently pending — initial scaffold is aligned with `rho_harness_core::rpc::protocol`)*
