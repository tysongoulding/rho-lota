import { useSessionStore } from "../../store/sessionStore";
import { useUiStore } from "../../store/uiStore";
import { PanelLeft, PanelRight, Cpu, Activity } from "lucide-react";

export function Titlebar() {
  const { sessionInfo, usage, isRunning } = useSessionStore();
  const { toggleSidebar, toggleWorkbench, workbenchOpen } = useUiStore();

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

        <span className="text-[#8b949e] font-mono">
          {sessionInfo.provider || "anthropic"} / {sessionInfo.model || "claude-3-7-sonnet"}
        </span>
      </div>

      <div className="flex items-center space-x-3 text-[#8b949e]">
        {isRunning && (
          <div className="flex items-center space-x-1 text-blue-400 animate-pulse">
            <Activity className="w-3.5 h-3.5" />
            <span>Running</span>
          </div>
        )}

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
