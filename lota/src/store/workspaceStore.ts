import { create } from "zustand";

export interface FileNode {
  path: string;
  name: string;
  isDir: boolean;
  children?: FileNode[];
  size?: number;
}

interface WorkspaceState {
  workspacePath: string;
  gitBranch: string;
  files: FileNode[];
  selectedFile: { path: string; content?: string } | null;
  attachedFiles: string[];
  maxContextTokens: number;

  setWorkspacePath: (path: string) => void;
  setGitBranch: (branch: string) => void;
  setFiles: (files: FileNode[]) => void;
  selectFile: (file: { path: string; content?: string } | null) => void;
  attachFile: (path: string) => void;
  removeAttachedFile: (path: string) => void;
  clearAttachedFiles: () => void;
}

const DEFAULT_MOCK_FILES: FileNode[] = [
  {
    path: "src",
    name: "src",
    isDir: true,
    children: [
      { path: "src/main.rs", name: "main.rs", isDir: false, size: 2450 },
      { path: "src/lib.rs", name: "lib.rs", isDir: false, size: 1890 },
      {
        path: "src/cli",
        name: "cli",
        isDir: true,
        children: [
          { path: "src/cli/mod.rs", name: "mod.rs", isDir: false, size: 3120 },
          { path: "src/cli/rpc.rs", name: "rpc.rs", isDir: false, size: 5400 },
        ],
      },
    ],
  },
  {
    path: "crates",
    name: "crates",
    isDir: true,
    children: [
      {
        path: "crates/rho-engine",
        name: "rho-engine",
        isDir: true,
        children: [
          { path: "crates/rho-engine/Cargo.toml", name: "Cargo.toml", isDir: false, size: 1200 },
          { path: "crates/rho-engine/src/lib.rs", name: "lib.rs", isDir: false, size: 3400 },
        ],
      },
      {
        path: "crates/rho-harness-core",
        name: "rho-harness-core",
        isDir: true,
        children: [
          { path: "crates/rho-harness-core/Cargo.toml", name: "Cargo.toml", isDir: false, size: 980 },
          { path: "crates/rho-harness-core/src/lib.rs", name: "lib.rs", isDir: false, size: 2100 },
        ],
      },
    ],
  },
  {
    path: "lota",
    name: "lota",
    isDir: true,
    children: [
      { path: "lota/package.json", name: "package.json", isDir: false, size: 1100 },
      { path: "lota/src/App.tsx", name: "App.tsx", isDir: false, size: 2800 },
      { path: "lota/README.md", name: "README.md", isDir: false, size: 3200 },
    ],
  },
  { path: "Cargo.toml", name: "Cargo.toml", isDir: false, size: 1450 },
  { path: "README.md", name: "README.md", isDir: false, size: 4500 },
];

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspacePath: "rho",
  gitBranch: "lota-feature",
  files: DEFAULT_MOCK_FILES,
  selectedFile: null,
  attachedFiles: [],
  maxContextTokens: 200_000,

  setWorkspacePath: (path: string) => set({ workspacePath: path }),
  setGitBranch: (branch: string) => set({ gitBranch: branch }),
  setFiles: (files: FileNode[]) => set({ files }),
  selectFile: (file) => set({ selectedFile: file }),
  attachFile: (path: string) =>
    set((state) => ({
      attachedFiles: state.attachedFiles.includes(path)
        ? state.attachedFiles
        : [...state.attachedFiles, path],
    })),
  removeAttachedFile: (path: string) =>
    set((state) => ({
      attachedFiles: state.attachedFiles.filter((p) => p !== path),
    })),
  clearAttachedFiles: () => set({ attachedFiles: [] }),
}));
