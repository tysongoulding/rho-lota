import { useUiStore } from "../../store/uiStore";
import { useSessionStore } from "../../store/sessionStore";
import { MessageSquarePlus, History, Settings, Code } from "lucide-react";

export function Sidebar() {
  const { sidebarOpen, activeView, setActiveView } = useUiStore();
  const { resetSession, sessionInfo } = useSessionStore();

  if (!sidebarOpen) return null;

  return (
    <aside className="w-60 border-r border-[#30363d] bg-[#0d1117] flex flex-col h-full text-xs select-none">
      <div className="p-3 border-b border-[#30363d]">
        <button
          onClick={() => resetSession()}
          className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 bg-[#21262d] hover:bg-[#30363d] text-white rounded border border-[#30363d] font-medium transition"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>New Session</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1 text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider">
          Views
        </div>
        <button
          onClick={() => setActiveView("chat")}
          className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded transition ${
            activeView === "chat" ? "bg-[#1f6feb]/20 text-[#58a6ff]" : "text-[#c9d1d9] hover:bg-[#161b22]"
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Chat & Agent Feed</span>
        </button>
        <button
          onClick={() => setActiveView("sessions")}
          className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded transition ${
            activeView === "sessions" ? "bg-[#1f6feb]/20 text-[#58a6ff]" : "text-[#c9d1d9] hover:bg-[#161b22]"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Session History</span>
        </button>
        <button
          onClick={() => setActiveView("settings")}
          className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded transition ${
            activeView === "settings" ? "bg-[#1f6feb]/20 text-[#58a6ff]" : "text-[#c9d1d9] hover:bg-[#161b22]"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings & Models</span>
        </button>
      </div>

      {sessionInfo.id && (
        <div className="p-3 border-t border-[#30363d] bg-[#161b22]">
          <div className="text-[11px] text-[#8b949e] mb-1">Active Session</div>
          <div className="font-mono text-[10px] text-white truncate">
            {sessionInfo.id}
          </div>
        </div>
      )}
    </aside>
  );
}
