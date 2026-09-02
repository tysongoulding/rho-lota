import { useSessionStore, TurnPhase } from "../../store/sessionStore";
import { useUiStore } from "../../store/uiStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import {
  PanelLeft,
  PanelRight,
  Cpu,
  Activity,
  Brain,
  Wrench,
  ShieldAlert,
  AlertCircle,
  GitBranch,
} from "lucide-react";

export function Titlebar() {
  const { sessionInfo, usage, turnPhase } = useSessionStore();
  const { toggleSidebar, toggleWorkbench, workbenchOpen } = useUiStore();
  const { workspacePath, gitBranch } = useWorkspaceStore();

  const renderStatusPill = (phase: TurnPhase) => {
    switch (phase) {
      case "thinking":
        return (
          <div className="flex items-center space-x-1.5 text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded-full border border-purple-800/40 animate-pulse">
            <Brain className="w-3.5 h-3.5" />
            <span>Thinking...</span>
          </div>
        );
      case "streaming_text":
        return (
          <div className="flex items-center space-x-1.5 text-blue-400 bg-blue-950/30 px-2 py-0.5 rounded-full border border-blue-800/40 animate-pulse">
            <Activity className="w-3.5 h-3.5" />
            <span>Streaming...</span>
          </div>
        );
      case "awaiting_approval":
        return (
          <div className="flex items-center space-x-1.5 text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-800/40 animate-bounce">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Waiting Approval</span>
          </div>
        );
      case "executing_tool":
        return (
          <div className="flex items-center space-x-1.5 text-yellow-400 bg-yellow-950/30 px-2 py-0.5 rounded-full border border-yellow-800/40 animate-pulse">
            <Wrench className="w-3.5 h-3.5 animate-spin" />
            <span>Running Tool...</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center space-x-1.5 text-red-400 bg-red-950/30 px-2 py-0.5 rounded-full border border-red-800/40">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Error</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <header
      data-tauri-drag-region
      className="flex items-center justify-between px-3 py-2 border-b border-[#30363d] bg-[#161b22] select-none text-xs"
    >
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-white transition"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-5 h-5 rounded bg-blue-600/20 text-blue-400 font-bold text-xs">
            ρ
          </div>
          <span className="font-semibold text-white tracking-wide">Rho Lota</span>
        </div>

        <div className="flex items-center space-x-1 text-[#8b949e] font-mono text-[11px] bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
          <span>{workspacePath}</span>
          <span className="text-[#484f58]">/</span>
          <GitBranch className="w-3 h-3 text-purple-400" />
          <span className="text-purple-300">{gitBranch}</span>
        </div>

        <span className="text-[#8b949e] font-mono hidden md:inline">
          {sessionInfo.provider || "anthropic"} / {sessionInfo.model || "claude-3-7-sonnet"}
        </span>
      </div>

      <div className="flex items-center space-x-3 text-[#8b949e]">
        {renderStatusPill(turnPhase)}

        {usage.contextPercent !== undefined && (
          <div className="flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>{usage.contextPercent.toFixed(1)}%</span>
          </div>
        )}

        {sessionInfo.id && (
          <span className="font-mono text-[10px] bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d]">
            {sessionInfo.id.slice(0, 8)}
          </span>
        )}

        <button
          onClick={toggleWorkbench}
          className={`p-1 rounded transition ${
            workbenchOpen
              ? "bg-[#1f6feb]/20 text-[#58a6ff]"
              : "hover:bg-[#21262d] text-[#8b949e] hover:text-white"
          }`}
          title="Toggle Streaming Workbench"
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
