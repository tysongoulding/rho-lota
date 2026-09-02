import { useUiStore } from "../../store/uiStore";
import { useSessionStore } from "../../store/sessionStore";
import {
  User,
  MessageSquarePlus,
  MessageSquare,
  FolderTree,
  Bot,
  Wrench,
  GitBranch,
  ListTodo,
  Settings,
  Palette,
} from "lucide-react";

export function Sidebar() {
  const { sidebarOpen, activeView, setActiveView, setNewAgentModalOpen, setNewChatModalOpen } =
    useUiStore();
  const { sessionInfo } = useSessionStore();

  if (!sidebarOpen) return null;

  const navItems = [
    { id: "chat" as const, label: "Chat & Feed", icon: MessageSquare },
    { id: "files" as const, label: "Files & Explorer", icon: FolderTree },
    { id: "agents" as const, label: "Agent Personas", icon: Bot },
    { id: "tools" as const, label: "Dynamic Tools", icon: Wrench },
    { id: "plans" as const, label: "Plan Tracker", icon: ListTodo },
    { id: "sessions" as const, label: "Session DAG", icon: GitBranch },
    { id: "settings" as const, label: "Providers & Models", icon: Settings },
    { id: "appearance" as const, label: "Theme & Colors", icon: Palette },
  ];

  return (
    <aside className="w-56 border-r border-[#30363d] bg-[#0d1117] flex flex-col h-full text-xs select-none">
      <div className="p-3 border-b border-[#30363d] space-y-2">
        {/* New Agent Button (opens NewAgentModal) */}
        <button
          onClick={() => setNewAgentModalOpen(true)}
          className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 bg-[#161b22] hover:bg-[#21262d] text-white rounded-lg border border-[#30363d] font-medium transition"
          title="Create a new Universal AI Agent persona"
        >
          <User className="w-4 h-4 text-purple-400" />
          <span>New Agent</span>
        </button>

        {/* New Chat Button (opens NewChatModal) */}
        <button
          onClick={() => setNewChatModalOpen(true)}
          className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg border border-[#30363d] font-medium transition"
          title="Start a new conversation (Ctrl+Shift+N)"
        >
          <MessageSquarePlus className="w-4 h-4 text-[#58a6ff]" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1 text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg transition text-left ${
                isActive
                  ? "bg-[#1f6feb]/20 text-[#58a6ff] font-medium"
                  : "text-[#c9d1d9] hover:bg-[#161b22]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

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
