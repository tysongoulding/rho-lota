import { create } from "zustand";

export type ActiveView = "chat" | "agents" | "tools" | "sessions" | "plans" | "settings" | "appearance";
export type WorkbenchTab = "diff" | "thinking" | "json";

interface UiState {
  sidebarOpen: boolean;
  workbenchOpen: boolean;
  activeView: ActiveView;
  activeWorkbenchTab: WorkbenchTab;
  selectedSessionId: string | null;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleWorkbench: () => void;
  setWorkbenchOpen: (open: boolean) => void;
  setActiveView: (view: ActiveView) => void;
  setActiveWorkbenchTab: (tab: WorkbenchTab) => void;
  setSelectedSessionId: (id: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  workbenchOpen: false,
  activeView: "chat",
  activeWorkbenchTab: "diff",
  selectedSessionId: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleWorkbench: () => set((s) => ({ workbenchOpen: !s.workbenchOpen })),
  setWorkbenchOpen: (open: boolean) => set({ workbenchOpen: open }),
  setActiveView: (view: ActiveView) => set({ activeView: view }),
  setActiveWorkbenchTab: (tab: WorkbenchTab) => set({ activeWorkbenchTab: tab }),
  setSelectedSessionId: (id: string | null) => set({ selectedSessionId: id }),
}));
