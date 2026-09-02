import { useAgentStore, DEFAULT_PERSONAS } from "../../store/agentStore";
import { useSessionStore } from "../../store/sessionStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useUiStore } from "../../store/uiStore";
import { Command, Bot, Sparkles, Folder, GitBranch } from "lucide-react";

export function Statusbar() {
  const { activePersonaId } = useAgentStore();
  const { sessionInfo } = useSessionStore();
  const { workspacePath, repoName, gitBranch, worktree } = useWorkspaceStore();
  const { toggleCommandPalette } = useUiStore();

  const currentPersona =
    DEFAULT_PERSONAS.find((p) => p.id === activePersonaId) || DEFAULT_PERSONAS[0];

  return (
    <footer className="h-6 border-t border-[#30363d] bg-[#0d1117] flex items-center justify-between px-3 text-[10px] text-[#8b949e] select-none font-mono">
      {/* Left: Command Palette -> Local Dir -> Repo/Branch/Worktree */}
      <div className="flex items-center space-x-3 truncate">
        <button
          onClick={toggleCommandPalette}
          className="flex items-center space-x-1 hover:text-white transition"
          title="Open Command Palette (Ctrl+K)"
        >
          <Command className="w-3 h-3 text-[#58a6ff]" />
          <span>Ctrl+K</span>
        </button>

        {/* Local Directory Path */}
        <div className="flex items-center space-x-1 text-[#c9d1d9] truncate" title={`Local Directory: ${workspacePath}`}>
          <Folder className="w-3 h-3 text-[#58a6ff] flex-shrink-0" />
          <span className="truncate max-w-[200px] md:max-w-xs">{workspacePath}</span>
        </div>

        {/* Repo / Branch / Worktree */}
        <div
          className="flex items-center space-x-1 text-purple-300 bg-[#161b22] px-1.5 py-0.5 rounded border border-[#30363d] flex-shrink-0"
          title={`Repo: ${repoName} | Branch: ${gitBranch} | Worktree: ${worktree}`}
        >
          <GitBranch className="w-3 h-3 text-purple-400" />
          <span>{repoName}</span>
          <span className="text-[#484f58]">/</span>
          <span className="font-semibold">{gitBranch}</span>
          {worktree && worktree !== "default" && (
            <>
              <span className="text-[#484f58]">@</span>
              <span className="text-purple-400">{worktree}</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Persona -> Model -> Shortcut Keys */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <div className="flex items-center space-x-1 text-[#c9d1d9] hidden sm:flex">
          <Bot className="w-3 h-3 text-purple-400" />
          <span>{currentPersona.name}</span>
        </div>

        <div className="flex items-center space-x-1 hidden md:flex">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{sessionInfo.provider || "anthropic"} / {sessionInfo.model || "claude-3-7-sonnet"}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span><kbd className="bg-[#161b22] px-1 py-0.5 rounded border border-[#30363d]">Ctrl+B</kbd> Sidebar</span>
          <span><kbd className="bg-[#161b22] px-1 py-0.5 rounded border border-[#30363d]">Ctrl+\</kbd> Workbench</span>
        </div>
      </div>
    </footer>
  );
}
