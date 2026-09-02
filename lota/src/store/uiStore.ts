import { create } from "zustand";

export type ActiveView = "chat" | "agents" | "tools" | "sessions" | "plans" | "settings";

interface UiState {
  sidebarOpen: boolean;
  activeView: ActiveView;
  selectedSessionId: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: ActiveView) => void;
  setSelectedSessionId: (id: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  activeView: "chat",
  selectedSessionId: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setActiveView: (view: ActiveView) => set({ activeView: view }),
  setSelectedSessionId: (id: string | null) => set({ selectedSessionId: id }),
}));
