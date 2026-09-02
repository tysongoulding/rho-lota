import { useState } from "react";
import { useUiStore } from "../../store/uiStore";
import { useSessionStore } from "../../store/sessionStore";
import { useAgentStore } from "../../store/agentStore";
import { useChatStore } from "../../store/chatStore";
import { useToastStore } from "../../store/toastStore";
import {
  User,
  MessageSquarePlus,
  MessageSquare,
  Bot,
  ChevronDown,
  ChevronRight,
  Settings,
  Trash2,
  Plus,
} from "lucide-react";

export function Sidebar() {
  const { sidebarOpen, activeView, setActiveView, setNewAgentModalOpen, setNewChatModalOpen } =
    useUiStore();
  const { sessionInfo, resetSession } = useSessionStore();
  const { personas, activePersonaId, setActivePersona } = useAgentStore();
  const { chats, activeChatId, switchChat, deleteChat } = useChatStore();
  const { addToast } = useToastStore();

  const [agentsExpanded, setAgentsExpanded] = useState(true);
  const [chatsExpanded, setChatsExpanded] = useState(true);

  if (!sidebarOpen) return null;

  const handleSelectAgent = (agentId: string) => {
    setActivePersona(agentId);
    setActiveView("chat");
    const found = personas.find((p) => p.id === agentId);
    addToast(`Switched active agent to ${found?.name || agentId}`, "info");
  };

  const handleSelectChat = (chatId: string) => {
    switchChat(chatId);
    resetSession();
    setActiveView("chat");
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string, chatTitle: string) => {
    e.stopPropagation();
    deleteChat(chatId);
    addToast(`Deleted chat: ${chatTitle}`, "info");
  };

  return (
    <aside className="w-60 border-r border-[#30363d] bg-[#0d1117] flex flex-col h-full text-xs select-none">
      {/* Top Action Buttons */}
      <div className="p-3 border-b border-[#30363d] space-y-2 flex-shrink-0">
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

      {/* Accordion Lists */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {/* Agents > Accordion Section */}
        <div className="space-y-1">
          <div
            onClick={() => setAgentsExpanded(!agentsExpanded)}
            className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#161b22] cursor-pointer text-[#8b949e] hover:text-white transition group"
          >
            <div className="flex items-center space-x-1.5 font-semibold text-[11px] tracking-wide uppercase">
              {agentsExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#8b949e]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#8b949e]" />
              )}
              <span>Agents</span>
              <span className="text-[10px] font-mono text-[#8b949e] ml-1">({personas.length})</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setNewAgentModalOpen(true);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-white transition"
              title="Create new agent"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {agentsExpanded && (
            <div className="space-y-0.5 pl-2 animate-in fade-in duration-100">
              {personas.map((agent) => {
                const isActive = activePersonaId === agent.id && activeView === "chat";
                return (
                  <button
                    key={agent.id}
                    onClick={() => handleSelectAgent(agent.id)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition text-left group ${
                      isActive
                        ? "bg-purple-950/40 text-purple-200 font-medium border border-purple-800/60"
                        : "text-[#c9d1d9] hover:bg-[#161b22] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Bot className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-purple-400" : "text-[#8b949e]"}`} />
                      <div className="truncate">
                        <div className="truncate text-xs">{agent.name}</div>
                        <div className="text-[10px] text-[#8b949e] truncate leading-tight">{agent.role}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Chats > Accordion Section */}
        <div className="space-y-1">
          <div
            onClick={() => setChatsExpanded(!chatsExpanded)}
            className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#161b22] cursor-pointer text-[#8b949e] hover:text-white transition group"
          >
            <div className="flex items-center space-x-1.5 font-semibold text-[11px] tracking-wide uppercase">
              {chatsExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#8b949e]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#8b949e]" />
              )}
              <span>Chats</span>
              <span className="text-[10px] font-mono text-[#8b949e] ml-1">({chats.length})</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setNewChatModalOpen(true);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-white transition"
              title="Start new chat"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {chatsExpanded && (
            <div className="space-y-0.5 pl-2 animate-in fade-in duration-100">
              {chats.length === 0 ? (
                <div className="px-2 py-3 text-[11px] text-[#8b949e] italic">No active chats</div>
              ) : (
                chats.map((chat) => {
                  const isActive = activeChatId === chat.id && activeView === "chat";
                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleSelectChat(chat.id)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition cursor-pointer group ${
                        isActive
                          ? "bg-[#1f6feb]/20 text-[#58a6ff] font-medium border border-blue-500/40"
                          : "text-[#c9d1d9] hover:bg-[#161b22] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <MessageSquare
                          className={`w-3.5 h-3.5 flex-shrink-0 ${
                            isActive ? "text-[#58a6ff]" : "text-[#8b949e]"
                          }`}
                        />
                        <div className="truncate">
                          <div className="truncate text-xs">{chat.title}</div>
                          <div className="text-[9px] text-[#8b949e]">
                            {new Date(chat.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </div>
                        </div>
                      </div>

                      {chats.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteChat(e, chat.id, chat.title)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#30363d] text-[#8b949e] hover:text-red-400 transition ml-1"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Settings Button */}
      <div className="p-2 border-t border-[#30363d] bg-[#161b22]/50 flex-shrink-0">
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
        <div className="p-3 border-t border-[#30363d] bg-[#161b22] flex-shrink-0">
          <div className="text-[10px] text-[#8b949e] mb-0.5">Session ID</div>
          <div className="font-mono text-[10px] text-white truncate">
            {sessionInfo.id}
          </div>
        </div>
      )}
    </aside>
  );
}
