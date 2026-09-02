import { useUiStore } from "../../store/uiStore";
import { useSessionStore } from "../../store/sessionStore";
import {
  User,
  MessageSquarePlus,
  MessageSquare,
  FolderTree,
  Settings,
} from "lucide-react";

export function Sidebar() {
  const { sidebarOpen, activeView, setActiveView, setNewAgentModalOpen, setNewChatModalOpen } =
    useUiStore();
  const { sessionInfo } = useSessionStore();

  if (!sidebarOpen) return null;

  return (
    <aside className="w-56 border-r border-[#30363d] bg-[#0d1117] flex flex-col h-full text-xs select-none">
      {/* Top Action Buttons */}
      <div className="p-3 border-b border-[#30363d] space-y-2">
        {/* New Agent Button */}
        <button
          onClick={() => setNewAgentModalOpen(true)}
          className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 bg-[#161b22] hover:bg-[#21262d] text-white rounded-lg border border-[#30363d] font-medium transition"
          title="Create a new Universal AI Agent persona"
        >
          <User className="w-4 h-4 text-purple-400" />
          <span>New Agent</span>
        </button>

        {/* New Chat Button */}
        <button
          onClick={() => setNewChatModalOpen(true)}
          className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg border border-[#30363d] font-medium transition"
          title="Start a new conversation (Ctrl+Shift+N)"
        >
          <MessageSquarePlus className="w-4 h-4 text-[#58a6ff]" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Main Workspace Navigation */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1 text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider">
          Workspace
        </div>

        <button
          onClick={() => setActiveView("chat")}
          className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg transition text-left ${
            activeView === "chat"
              ? "bg-[#1f6feb]/20 text-[#58a6ff] font-medium"
              : "text-[#c9d1d9] hover:bg-[#161b22]"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat & Feed</span>
        </button>

        <button
          onClick={() => setActiveView("files")}
          className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg transition text-left ${
            activeView === "files"
              ? "bg-[#1f6feb]/20 text-[#58a6ff] font-medium"
              : "text-[#c9d1d9] hover:bg-[#161b22]"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Files & Explorer</span>
        </button>
      </div>

      {/* Bottom Settings Button with Gear Icon */}
      <div className="p-2 border-t border-[#30363d] bg-[#161b22]/50">
        <button
          onClick={() => setActiveView("settings")}
          className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg transition text-left ${
            activeView === "settings"
              ? "bg-[#1f6feb]/20 text-[#58a6ff] font-medium"
              : "text-[#c9d1d9] hover:bg-[#21262d] hover:text-white"
          }`}
          title="Open Settings & Preferences"
        >
          <Settings className={`w-4 h-4 ${activeView === "settings" ? "text-[#58a6ff]" : "text-[#8b949e]"}`} />
          <span className="font-medium">Settings</span>
        </button>
      </div>

      {/* Session ID Footer */}
      {sessionInfo.id && (
        <div className="p-3 border-t border-[#30363d] bg-[#161b22]">
          <div className="text-[10px] text-[#8b949e] mb-0.5">Session ID</div>
          <div className="font-mono text-[10px] text-white truncate">
            {sessionInfo.id}
          </div>
        </div>
      )}
    </aside>
  );
}
