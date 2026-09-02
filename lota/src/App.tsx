import { useEffect } from "react";
import { useSessionStore } from "./store/sessionStore";
import { useUiStore } from "./store/uiStore";
import { useThemeStore, applyThemeToDocument } from "./store/themeStore";
import { useRhoEngine } from "./hooks/useRhoEngine";
import { useTurnQueue } from "./hooks/useTurnQueue";
import { Titlebar } from "./components/layout/Titlebar";
import { Sidebar } from "./components/layout/Sidebar";
import { VirtualizedMessageFeed } from "./components/chat/VirtualizedMessageFeed";
import { ApprovalModal } from "./components/chat/ApprovalModal";
import { QueueBadge } from "./components/editor/QueueBadge";
import { PromptInput } from "./components/editor/PromptInput";
import { StreamingWorkbench } from "./components/workbench/StreamingWorkbench";
import { WorkspaceExplorer } from "./components/workspace/WorkspaceExplorer";
import { AgentInspector } from "./components/agent/AgentInspector";
import { ToolboxManager } from "./components/agent/ToolboxManager";
import { ModelProviderPicker } from "./components/agent/ModelProviderPicker";
import { StructuredPlanView } from "./components/artifacts/StructuredPlanView";
import { SessionGraphViewer } from "./components/dag/SessionGraphViewer";
import { AppearanceSettings } from "./components/settings/AppearanceSettings";

export default function App() {
  const { messages, isRunning, addUserMessage } = useSessionStore();
  const { activeView } = useUiStore();
  const { mode } = useThemeStore();
  const { prompt } = useRhoEngine();
  const { queue, dequeue } = useTurnQueue();

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
    <div className="flex flex-col h-screen w-screen bg-[#0d1117] text-[#c9d1d9] font-sans antialiased overflow-hidden select-none">
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
          {activeView === "agents" && <AgentInspector />}
          {activeView === "tools" && <ToolboxManager />}
          {activeView === "plans" && <StructuredPlanView />}
          {activeView === "sessions" && <SessionGraphViewer />}
          {activeView === "settings" && <ModelProviderPicker />}
          {activeView === "appearance" && <AppearanceSettings />}
        </main>

        {activeView === "chat" && <StreamingWorkbench />}
      </div>
    </div>
  );
}
