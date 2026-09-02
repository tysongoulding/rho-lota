import { create } from "zustand";

export type ActiveView =
  | "chat"
  | "files"
  | "agents"
  | "tools"
  | "plans"
  | "sessions"
  | "settings"
  | "appearance";

export type WorkbenchTab = "diff" | "thinking" | "file" | "json";

interface UiState {
  sidebarOpen: boolean;
  workbenchOpen: boolean;
  statusbarOpen: boolean;
  commandPaletteOpen: boolean;
  newChatModalOpen: boolean;
  newAgentModalOpen: boolean;
  activeView: ActiveView;
  activeWorkbenchTab: WorkbenchTab;
  selectedSessionId: string | null;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleWorkbench: () => void;
  setWorkbenchOpen: (open: boolean) => void;
  toggleStatusbar: () => void;
  setStatusbarOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNewChatModalOpen: (open: boolean) => void;
  setNewAgentModalOpen: (open: boolean) => void;
  setActiveView: (view: ActiveView) => void;
  setActiveWorkbenchTab: (tab: WorkbenchTab) => void;
  setSelectedSessionId: (id: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  workbenchOpen: false,
  statusbarOpen: true,
  commandPaletteOpen: false,
  newChatModalOpen: false,
  newAgentModalOpen: false,
  activeView: "chat",
  activeWorkbenchTab: "diff",
  selectedSessionId: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleWorkbench: () => set((s) => ({ workbenchOpen: !s.workbenchOpen })),
  setWorkbenchOpen: (open: boolean) => set({ workbenchOpen: open }),
  toggleStatusbar: () => set((s) => ({ statusbarOpen: !s.statusbarOpen })),
  setStatusbarOpen: (open: boolean) => set({ statusbarOpen: open }),
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  setCommandPaletteOpen: (open: boolean) => set({ commandPaletteOpen: open }),
  setNewChatModalOpen: (open: boolean) => set({ newChatModalOpen: open }),
  setNewAgentModalOpen: (open: boolean) => set({ newAgentModalOpen: open }),
  setActiveView: (view: ActiveView) => set({ activeView: view }),
  setActiveWorkbenchTab: (tab: WorkbenchTab) => set({ activeWorkbenchTab: tab }),
  setSelectedSessionId: (id: string | null) => set({ selectedSessionId: id }),
}));
