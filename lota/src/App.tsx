import { useEffect } from "react";
import { useSessionStore } from "./store/sessionStore";
import { useUiStore } from "./store/uiStore";
import { useThemeStore, applyThemeToDocument } from "./store/themeStore";
import { useRhoEngine } from "./hooks/useRhoEngine";
import { useTurnQueue } from "./hooks/useTurnQueue";
import { useGlobalShortcuts } from "./hooks/useGlobalShortcuts";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { Titlebar } from "./components/layout/Titlebar";
import { Sidebar } from "./components/layout/Sidebar";
import { Statusbar } from "./components/layout/Statusbar";
import { VirtualizedMessageFeed } from "./components/chat/VirtualizedMessageFeed";
import { ApprovalModal } from "./components/chat/ApprovalModal";
import { QueueBadge } from "./components/editor/QueueBadge";
import { PromptInput } from "./components/editor/PromptInput";
import { StreamingWorkbench } from "./components/workbench/StreamingWorkbench";
import { WorkspaceExplorer } from "./components/workspace/WorkspaceExplorer";
import { SettingsHubView } from "./components/settings/SettingsHubView";
import { CommandPalette } from "./components/palette/CommandPalette";
import { ToastContainer } from "./components/common/ToastContainer";
import { NewChatModal } from "./components/modals/NewChatModal";
import { NewAgentModal } from "./components/modals/NewAgentModal";

export default function App() {
  const { messages, isRunning, addUserMessage } = useSessionStore();
  const { activeView, statusbarOpen } = useUiStore();
  const { mode } = useThemeStore();
  const { prompt } = useRhoEngine();
  const { queue, dequeue } = useTurnQueue();

  // Register global keyboard shortcuts & drag-and-drop file attachment
  useGlobalShortcuts();
  const { isDragging } = useDragAndDrop();

  // Apply theme and listen for OS system theme changes
  useEffect(() => {
    applyThemeToDocument();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (useThemeStore.getState().mode === "system") {
        applyThemeToDocument();
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [mode]);

  // Automatically process queued items when turn ends
  useEffect(() => {
    if (!isRunning && queue.length > 0) {
      const nextPrompt = dequeue();
      if (nextPrompt) {
        addUserMessage(nextPrompt);
        prompt(nextPrompt);
      }
    }
  }, [isRunning, queue, dequeue, addUserMessage, prompt]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d1117] text-[#c9d1d9] font-sans antialiased overflow-hidden select-none relative">
      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-600/10 border-2 border-dashed border-blue-500 z-50 pointer-events-none flex items-center justify-center backdrop-blur-[1px]">
          <div className="bg-[#161b22] px-6 py-3 rounded-2xl border border-blue-500 shadow-2xl text-white font-semibold text-sm">
            Drop files here to tag into prompt context
          </div>
        </div>
      )}

      <Titlebar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col bg-[#0d1117] min-w-0">
          {activeView === "chat" && (
            <>
              <VirtualizedMessageFeed messages={messages} />
              <ApprovalModal />
              <QueueBadge />
              <PromptInput />
            </>
          )}
          {activeView === "files" && <WorkspaceExplorer />}
          {activeView === "settings" && <SettingsHubView />}
        </main>

        {activeView === "chat" && <StreamingWorkbench />}
      </div>

      {statusbarOpen && <Statusbar />}
      <CommandPalette />
      <ToastContainer />
      <NewChatModal />
      <NewAgentModal />
    </div>
  );
}
