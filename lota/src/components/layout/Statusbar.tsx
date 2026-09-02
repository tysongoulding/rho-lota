import { useAgentStore, DEFAULT_PERSONAS } from "../../store/agentStore";
import { useSessionStore } from "../../store/sessionStore";
import { useUiStore } from "../../store/uiStore";
import { Command, Bot, Sparkles } from "lucide-react";

export function Statusbar() {
  const { activePersonaId } = useAgentStore();
  const { sessionInfo } = useSessionStore();
  const { toggleCommandPalette } = useUiStore();

  const currentPersona =
    DEFAULT_PERSONAS.find((p) => p.id === activePersonaId) || DEFAULT_PERSONAS[0];

  return (
    <footer className="h-6 border-t border-[#30363d] bg-[#0d1117] flex items-center justify-between px-3 text-[10px] text-[#8b949e] select-none font-mono">
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleCommandPalette}
          className="flex items-center space-x-1 hover:text-white transition"
        >
          <Command className="w-3 h-3 text-[#58a6ff]" />
          <span>Ctrl+K</span>
        </button>

        <div className="flex items-center space-x-1 text-[#c9d1d9]">
          <Bot className="w-3 h-3 text-purple-400" />
          <span>{currentPersona.name}</span>
        </div>

        <div className="flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{sessionInfo.provider || "anthropic"} / {sessionInfo.model || "claude-3-7-sonnet"}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span><kbd className="bg-[#161b22] px-1 py-0.5 rounded border border-[#30363d]">Ctrl+B</kbd> Sidebar</span>
        <span><kbd className="bg-[#161b22] px-1 py-0.5 rounded border border-[#30363d]">Ctrl+\</kbd> Workbench</span>
      </div>
    </footer>
  );
}
