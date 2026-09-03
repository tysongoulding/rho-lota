import { useState } from "react";
import { useSessionStore } from "../../store/sessionStore";
import { Cpu } from "lucide-react";

interface ContextRingGaugeProps {
  onClick: () => void;
}

export function ContextRingGauge({ onClick }: ContextRingGaugeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { usage, sessionInfo } = useSessionStore();

  const percent = Math.min(100, Math.max(0, usage.contextPercent ?? 6.2));
  const inputTokens = usage.inputTokens ?? 12450;
  const outputTokens = usage.outputTokens ?? 1840;

  // Dynamic color coding based on context threshold
  const getColorClass = (val: number) => {
    if (val > 85) return { stroke: "stroke-red-500", text: "text-red-400", bg: "bg-red-500/10" };
    if (val > 65) return { stroke: "stroke-amber-500", text: "text-amber-400", bg: "bg-amber-500/10" };
    return { stroke: "stroke-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500/10" };
  };

  const colors = getColorClass(percent);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="p-1 rounded-lg hover:bg-[#21262d] transition flex items-center justify-center group relative cursor-pointer"
        title="Context Window usage. Click for details."
      >
        {/* SVG Circular Progress Ring */}
        <div className="relative w-6 h-6 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            {/* Background Track */}
            <path
              className="text-[#30363d] stroke-current"
              strokeWidth="3.5"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress Stroke */}
            <path
              className={`${colors.stroke} stroke-current transition-all duration-300`}
              strokeDasharray={`${percent}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          {/* Tiny Center Icon */}
          <Cpu className={`w-2.5 h-2.5 absolute ${colors.text} group-hover:scale-110 transition-transform`} />
        </div>
      </button>

      {/* Hover Tooltip Popup */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 z-50 w-52 p-2.5 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl text-[11px] text-[#c9d1d9] space-y-1.5 pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-150">
          <div className="flex items-center justify-between font-semibold">
            <span className="text-white flex items-center space-x-1">
              <Cpu className={`w-3.5 h-3.5 ${colors.text}`} />
              <span>Context Window</span>
            </span>
            <span className={`font-mono ${colors.text}`}>{percent.toFixed(1)}%</span>
          </div>

          <div className="text-[10px] text-[#8b949e] space-y-0.5 pt-0.5 border-t border-[#30363d]">
            <div className="flex justify-between">
              <span>Model:</span>
              <span className="font-mono text-white">{sessionInfo.model || "gemini-1.5-pro"}</span>
            </div>
            <div className="flex justify-between">
              <span>In / Out:</span>
              <span className="font-mono text-white">
                {inputTokens.toLocaleString()} / {outputTokens.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="text-[9px] text-[#58a6ff] pt-1 text-center font-medium">
            Click to view memory & optimize
          </div>
        </div>
      )}
    </div>
  );
}
