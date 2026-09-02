import { useEffect } from "react";
import { useSessionStore } from "./store/sessionStore";
import { useRhoEngine } from "./hooks/useRhoEngine";
import { useTurnQueue } from "./hooks/useTurnQueue";
import { Titlebar } from "./components/layout/Titlebar";
import { Sidebar } from "./components/layout/Sidebar";
import { MessageFeed } from "./components/chat/MessageFeed";
import { ApprovalModal } from "./components/chat/ApprovalModal";
import { QueueBadge } from "./components/editor/QueueBadge";
import { PromptInput } from "./components/editor/PromptInput";

export default function App() {
  const { messages, isRunning, addUserMessage } = useSessionStore();
  const { prompt } = useRhoEngine();
  const { queue, dequeue } = useTurnQueue();

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
          <MessageFeed messages={messages} />
          <ApprovalModal />
          <QueueBadge />
          <PromptInput />
        </main>
      </div>
    </div>
  );
}
