# lota

`lota` is the official desktop graphical frontend for [`rho`](../README.md), a fast, minimal agentic coding harness in Rust.

Built with **Tauri 2.0**, **React 19**, **TypeScript**, and **Tailwind CSS**, `lota` provides a native desktop interface for pair programming with `rho`—featuring real-time token streaming, thinking-block collapse/expansion, inline tool approvals, session trees, and code diff visualization.

## Development

```sh
# Install frontend dependencies
npm install

# Run frontend in browser dev mode (mock RPC transport)
npm run dev

# Run native Tauri 2.0 desktop app
cargo tauri dev

# Typecheck and build frontend bundle
npm run build
```
