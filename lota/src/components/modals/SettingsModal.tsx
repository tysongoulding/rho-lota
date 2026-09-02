import { useUiStore } from "../../store/uiStore";
import { SettingsHubView } from "../settings/SettingsHubView";
import { Settings, X } from "lucide-react";

export function SettingsModal() {
  const { settingsModalOpen, setSettingsModalOpen } = useUiStore();

  if (!settingsModalOpen) return null;

  return (
    <div
      onClick={() => setSettingsModalOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden text-xs flex flex-col h-[85vh] max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-[#58a6ff]" />
            <span className="font-semibold text-white text-sm">Rho Lota Settings & Preferences</span>
          </div>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="text-[#8b949e] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body with 9 Tabs */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-[#0d1117]">
          <SettingsHubView />
        </div>
      </div>
    </div>
  );
}
