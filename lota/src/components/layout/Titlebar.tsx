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
  Minus,
  Square,
  X,
} from "lucide-react";

export function Titlebar() {
  const { sessionInfo, usage, turnPhase } = useSessionStore();
  const { toggleSidebar, toggleWorkbench, workbenchOpen, sidebarOpen } = useUiStore();
  const { workspacePath, gitBranch } = useWorkspaceStore();

  const handleMinimize = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().minimize();
    } catch {}
  };

  const handleMaximize = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().toggleMaximize();
    } catch {}
  };

  const handleClose = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().close();
    } catch {}
  };

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
      className="flex items-center justify-between pl-3 pr-0 py-0 border-b border-[#30363d] bg-[#161b22] select-none text-xs h-9"
    >
      {/* Left Section: Logo & Name -> Sidebar Toggle -> Workspace Pill -> Model */}
      <div className="flex items-center space-x-2.5 h-full">
        {/* Logo & Company Name */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-5 h-5 rounded bg-blue-600/20 text-blue-400 font-bold text-xs">
            ρ
          </div>
          <span className="font-semibold text-white tracking-wide">Rho Lota</span>
        </div>

        {/* Sidebar Toggle Button (after Logo & Name) */}
        <button
          onClick={toggleSidebar}
          className={`p-1 rounded transition ${
            sidebarOpen ? "bg-[#21262d] text-white" : "text-[#8b949e] hover:text-white hover:bg-[#21262d]"
          }`}
          title="Toggle Navigation Sidebar (Ctrl+B)"
        >
          <PanelLeft className="w-3.5 h-3.5" />
        </button>

        {/* Workspace Path & Git Branch */}
        <div className="flex items-center space-x-1 text-[#8b949e] font-mono text-[11px] bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
          <span>{workspacePath}</span>
          <span className="text-[#484f58]">/</span>
          <GitBranch className="w-3 h-3 text-purple-400" />
          <span className="text-purple-300">{gitBranch}</span>
        </div>

        {/* Model info */}
        <span className="text-[#8b949e] font-mono hidden lg:inline">
          {sessionInfo.provider || "anthropic"} / {sessionInfo.model || "claude-3-7-sonnet"}
        </span>
      </div>

      {/* Right Section: Status -> Usage -> Session -> Workbench Toggle -> Window Controls */}
      <div className="flex items-center space-x-2 h-full text-[#8b949e]">
        {renderStatusPill(turnPhase)}

        {usage.contextPercent !== undefined && (
          <div className="flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>{usage.contextPercent.toFixed(1)}%</span>
          </div>
        )}

        {sessionInfo.id && (
          <span className="font-mono text-[10px] bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d] hidden sm:inline">
            {sessionInfo.id.slice(0, 8)}
          </span>
        )}

        {/* Workbench Toggle Button (before Minimize) */}
        <button
          onClick={toggleWorkbench}
          className={`p-1 rounded transition ${
            workbenchOpen
              ? "bg-[#1f6feb]/20 text-[#58a6ff]"
              : "hover:bg-[#21262d] text-[#8b949e] hover:text-white"
          }`}
          title="Toggle Streaming Workbench (Ctrl+\)"
        >
          <PanelRight className="w-3.5 h-3.5" />
        </button>

        {/* Integrated Window Controls (Frameless) */}
        <div className="flex items-center h-full ml-1">
          <button
            onClick={handleMinimize}
            className="w-10 h-full flex items-center justify-center hover:bg-[#21262d] text-[#8b949e] hover:text-white transition"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleMaximize}
            className="w-10 h-full flex items-center justify-center hover:bg-[#21262d] text-[#8b949e] hover:text-white transition"
            title="Maximize / Restore"
          >
            <Square className="w-3 h-3" />
          </button>

          <button
            onClick={handleClose}
            className="w-11 h-full flex items-center justify-center hover:bg-[#e81123] text-[#8b949e] hover:text-white transition"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
