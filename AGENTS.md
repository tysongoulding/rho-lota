# Repository instructions

## Code structure

- Keep files concise (~150 lines target). Treat growth beyond ~150 lines as a
  signal to check cohesion and split along natural architectural seams when it
  clarifies responsibilities.
- Separate unit tests into sibling `tests.rs` or `tests/` submodules rather than
  embedding large `#[cfg(test)]` blocks inside production source files when
  files grow beyond ~150 lines.
- Avoid premature fragmentation: do not break straightforward logic into tiny,
  artificially separated helpers that obscure control flow.

## Lint policy

- Do not add Clippy `allow`, `expect`, command-line exclusions, or crate-level
  lint suppressions. Refactor code to satisfy the configured lints instead.
- Remove any existing Clippy suppression encountered in code being changed.

## Testing and performance

- Use `cargo test --workspace` for test feedback during development (a bare
  `cargo test` only covers the root `rho` package, not the other crates).
- Place unit tests in a dedicated `tests.rs` or `tests/` file
  (`#[cfg(test)] mod tests;`) to keep production implementation files concise
  and cleanly separated from test harnesses.
- In HTTP client builders, always configure `.no_proxy()` or reuse static client
  singletons (`HttpClient` / `LazyLock`), and use `rustls-tls-webpki-roots`.
  Never build unconfigured `reqwest::Client` instances in hot paths or test
  fixtures to prevent macOS `SCDynamicStoreCopyProxies` IPC lockups in parallel
  test threads.
- In token counting, reuse static `CoreBPE` instances via `LazyLock` rather than
  calling `tiktoken_rs::cl100k_base()` repeatedly.
- In `build.rs` scripts, always provide absolute or workspace-anchored paths for
  `cargo:rerun-if-changed` to prevent Cargo from invalidating incremental build
## Frontend (`lota/`) guidelines

- All frontend UI code strictly lives under `lota/`.
- Maintain single-responsibility modular components (~150 lines target).
- Never modify core Rust crates when implementing frontend features; document backend requirements in `lota/backend-requests.md`.
- Validate desktop frontend changes with Playwright E2E tests (`npm run test:e2e` inside `lota/`).

## Completion

- For Rust crates: Run `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and `cargo test --workspace`.
- For Lota desktop frontend: Run `npm run test:e2e` in `lota/`.
