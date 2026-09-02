import { AppearanceSettings } from "../settings/AppearanceSettings";
import { WandSparkles, Palette } from "lucide-react";

export function CustomiseView() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d1117] min-w-0 overflow-hidden text-xs">
      {/* View Header */}
      <div className="border-b border-[#30363d] bg-[#161b22] px-6 py-3 flex items-center justify-between flex-shrink-0 select-none">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <WandSparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">Customise & Appearance</h1>
            <p className="text-[11px] text-[#8b949e]">
              Personalize theme presets, hex colors, and visual workspace styles.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-md bg-[#21262d] border border-[#30363d] text-[#8b949e] font-mono text-[10px] flex items-center space-x-1">
            <Palette className="w-3 h-3 text-pink-400" />
            <span>Theme Engine v2</span>
          </span>
        </div>
      </div>

      {/* Main View Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <AppearanceSettings />
      </div>
    </div>
  );
}
