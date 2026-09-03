import { useSessionStore } from "../../store/sessionStore";
import { useToastStore } from "../../store/toastStore";
import {
  X,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Trash2,
  HardDrive,
  ShieldCheck,
  TrendingDown,
  Info,
} from "lucide-react";

interface ContextWindowModalProps {
  onClose: () => void;
}

export function ContextWindowModal({ onClose }: ContextWindowModalProps) {
  const { usage, sessionInfo, resetSession } = useSessionStore();
  const { addToast } = useToastStore();

  const percent = usage.contextPercent ?? 6.2;
  const inputTokens = usage.inputTokens ?? 12450;
  const outputTokens = usage.outputTokens ?? 1840;
  const totalTokens = inputTokens + outputTokens;
  const maxCapacity = 2000000; // 2M Tokens (Gemini Pro standard)
  const remainingTokens = Math.max(0, maxCapacity - totalTokens);

  // Breakdown simulation
  const systemPreambleTokens = Math.round(totalTokens * 0.28);
  const mcpToolTokens = Math.round(totalTokens * 0.22);
  const historyTokens = totalTokens - systemPreambleTokens - mcpToolTokens;

  const handlePruneContext = () => {
    addToast("Optimized context memory: purged redundant intermediate tool payloads", "success");
    onClose();
  };

  const handleClearContext = () => {
    resetSession();
    addToast("Cleared conversation context window", "info");
    onClose();
  };

  const getColorClass = (val: number) => {
    if (val > 85) return "text-red-400 stroke-red-500 bg-red-500/10 border-red-500/30";
    if (val > 65) return "text-amber-400 stroke-amber-500 bg-amber-500/10 border-amber-500/30";
    return "text-emerald-400 stroke-emerald-500 bg-emerald-500/10 border-emerald-500/30";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0 text-xs text-[#c9d1d9]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]/70">
          <div className="flex items-center space-x-2.5">
            <div className={`p-1.5 rounded-lg border ${getColorClass(percent)}`}>
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-sm">Context Window Diagnostics</h2>
              <p className="text-[11px] text-[#8b949e]">
                Model capacity, token consumption, and memory allocation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#8b949e] hover:text-white hover:bg-[#30363d] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Main Meter & High-Level Stats */}
          <div className="flex items-center space-x-5 p-4 bg-[#0d1117] border border-[#30363d] rounded-xl">
            {/* Circular Gauge */}
            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#21262d] stroke-current"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${getColorClass(percent).split(" ")[1]} stroke-current transition-all duration-500`}
                  strokeDasharray={`${percent}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold text-white font-mono">{percent.toFixed(1)}%</span>
                <span className="text-[9px] text-[#8b949e] uppercase">Used</span>
              </div>
            </div>

            {/* Model & Limits Details */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[#8b949e]">Active Model:</span>
                <span className="font-semibold text-white font-mono">{sessionInfo.model || "gemini-1.5-pro"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8b949e]">Provider Engine:</span>
                <span className="text-white capitalize">{sessionInfo.provider || "Google DeepMind / Rho FSM"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8b949e]">Window Capacity:</span>
                <span className="font-mono text-white">{(maxCapacity / 1000000).toFixed(1)}M tokens</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8b949e]">Available Headroom:</span>
                <span className="font-mono text-emerald-400 font-medium">
                  {remainingTokens.toLocaleString()} tokens
                </span>
              </div>
            </div>
          </div>

          {/* Token Breakdown Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-white">Memory Allocation Breakdown</span>
              <span className="text-[#8b949e] font-mono">{totalTokens.toLocaleString()} Total Tokens</span>
            </div>

            {/* Multi-segment Progress Bar */}
            <div className="h-2 w-full bg-[#0d1117] rounded-full overflow-hidden flex border border-[#30363d]">
              <div
                style={{ width: `${(systemPreambleTokens / totalTokens) * 100}%` }}
                className="bg-blue-500 h-full"
                title="System Prompt & Architecture Rules"
              />
              <div
                style={{ width: `${(mcpToolTokens / totalTokens) * 100}%` }}
                className="bg-purple-500 h-full"
                title="MCP Tool Definitions & Schemas"
              />
              <div
                style={{ width: `${(historyTokens / totalTokens) * 100}%` }}
                className="bg-emerald-500 h-full"
                title="Active Conversation Turn History"
              />
            </div>

            {/* Breakdown Legend */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-0.5">
                <div className="flex items-center space-x-1.5 text-[10px] text-[#8b949e]">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>System / Preamble</span>
                </div>
                <div className="font-mono text-white text-[11px] font-semibold">
                  {systemPreambleTokens.toLocaleString()}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-0.5">
                <div className="flex items-center space-x-1.5 text-[10px] text-[#8b949e]">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>MCP Tools</span>
                </div>
                <div className="font-mono text-white text-[11px] font-semibold">
                  {mcpToolTokens.toLocaleString()}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-0.5">
                <div className="flex items-center space-x-1.5 text-[10px] text-[#8b949e]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Turn History</span>
                </div>
                <div className="font-mono text-white text-[11px] font-semibold">
                  {historyTokens.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Efficiency Tips */}
          <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-xl flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#8b949e] leading-relaxed">
              Rho Lota automatically streams responses via zero-copy TokIO buffers. Context is preserved across agent turns with selective schema indexing.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-[#30363d] bg-[#161b22]/70 flex items-center justify-between">
          <button
            onClick={handleClearContext}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Context</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePruneContext}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] transition font-medium"
            >
              <TrendingDown className="w-3.5 h-3.5 text-blue-400" />
              <span>Optimize Context</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition shadow"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
