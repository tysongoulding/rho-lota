import { useUiStore } from "../../store/uiStore";
import { ToolboxManager } from "../agent/ToolboxManager";
import { Route, X } from "lucide-react";

export function AutomationModal() {
  const { automationModalOpen, setAutomationModalOpen } = useUiStore();

  if (!automationModalOpen) return null;

  return (
    <div
      onClick={() => setAutomationModalOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden text-xs flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Route className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white text-sm">Automation, Dynamic Tools & MCP Registry</span>
          </div>
          <button
            onClick={() => setAutomationModalOpen(false)}
            className="text-[#8b949e] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0 bg-[#0d1117]">
          <ToolboxManager />
        </div>
      </div>
    </div>
  );
}
