import { useEffect } from "react";
import { useUiStore } from "../store/uiStore";
import { useSessionStore } from "../store/sessionStore";
import { useToastStore } from "../store/toastStore";

export function useGlobalShortcuts() {
  const {
    toggleCommandPalette,
    setCommandPaletteOpen,
    toggleSidebar,
    toggleWorkbench,
    commandPaletteOpen,
    setActiveView,
  } = useUiStore();
  const { resetSession } = useSessionStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Ctrl+K -> Command Palette
      if (isCtrlOrCmd && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      // Ctrl+B -> Toggle Sidebar
      if (isCtrlOrCmd && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // Ctrl+\ -> Toggle Workbench
      if (isCtrlOrCmd && (e.key === "\\" || e.key.toLowerCase() === "j")) {
        e.preventDefault();
        toggleWorkbench();
        return;
      }

      // Ctrl+Shift+N -> New Session
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        resetSession();
        setActiveView("chat");
        addToast("Started new session", "success");
        return;
      }

      // Escape -> Close command palette if open
      if (e.key === "Escape" && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    toggleCommandPalette,
    setCommandPaletteOpen,
    toggleSidebar,
    toggleWorkbench,
    commandPaletteOpen,
    resetSession,
    setActiveView,
    addToast,
  ]);
}
