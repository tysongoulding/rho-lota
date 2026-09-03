import { useState } from "react";
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
  Archive,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

interface ContextWindowModalProps {
  onClose: () => void;
}

export function ContextWindowModal({ onClose }: ContextWindowModalProps) {
  const { usage, sessionInfo, compaction, triggerCompaction, resetSession } = useSessionStore();
  const { addToast } = useToastStore();
  const [isCompacting, setIsCompacting] = useState(false);

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

  const handleRunCompaction = () => {
    setIsCompacting(true);
    setTimeout(() => {
      const saved = triggerCompaction("Pruned redundant AST buffers & compressed turn dialogues");
      setIsCompacting(false);
      addToast(`Context compacted! Reclaimed ${saved.toLocaleString()} tokens.`, "success");
    }, 400);
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
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl space-y-0 text-xs text-[#c9d1d9]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]/70 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className={`p-1.5 rounded-lg border ${getColorClass(percent)}`}>
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-sm">Context Window Diagnostics</h2>
              <p className="text-[11px] text-[#8b949e]">
                Model capacity, token consumption, and compaction telemetry
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

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
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

          {/* Section 2: Compaction Telemetry (How much & how many times) */}
          <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Archive className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-xs">Context Compaction Telemetry</h3>
                  <p className="text-[10px] text-[#8b949e]">
                    Automated token compression, history pruning, and buffer compaction
                  </p>
                </div>
              </div>

              <button
                onClick={handleRunCompaction}
                disabled={isCompacting}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-medium transition disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>{isCompacting ? "Compacting..." : "Compact Context Now"}</span>
              </button>
            </div>

            {/* Compaction Key Metric Cards */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-[#161b22] border border-[#30363d] rounded-lg flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#8b949e]">Times Compacted</span>
                  <div className="text-sm font-bold text-white font-mono">
                    {compaction.count} {compaction.count === 1 ? "time" : "times"}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                  {compaction.count > 0 ? "Active" : "None"}
                </span>
              </div>

              <div className="p-2.5 bg-[#161b22] border border-[#30363d] rounded-lg flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#8b949e]">Total Tokens Saved</span>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {compaction.totalTokensSaved.toLocaleString()}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Reclaimed
                </span>
              </div>
            </div>

            {/* Compaction History Log */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider">
                Compaction Pass Log
              </span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {compaction.history.map((record, idx) => (
                  <div
                    key={record.id || idx}
                    className="p-2 bg-[#161b22] border border-[#30363d] rounded-lg flex items-center justify-between text-[11px]"
                  >
                    <div className="space-y-0.5 truncate mr-2">
                      <div className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span className="font-medium text-white truncate">{record.strategy}</span>
                      </div>
                      <span className="text-[9px] text-[#8b949e]">{record.timestamp}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                        -{record.tokensReclaimed.toLocaleString()} tokens
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {record.reductionPercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Token Breakdown Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-white">Live Memory Allocation Breakdown</span>
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
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-[#30363d] bg-[#161b22]/70 flex items-center justify-between flex-shrink-0">
          <button
            onClick={handleClearContext}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Context</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition shadow"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
