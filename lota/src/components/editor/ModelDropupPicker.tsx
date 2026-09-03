import { useState, useRef, useEffect, useMemo } from "react";
import { useProviderStore } from "../../store/providerStore";
import { useSessionStore } from "../../store/sessionStore";
import { useUiStore } from "../../store/uiStore";
import { useToastStore } from "../../store/toastStore";
import {
  ChevronUp,
  Check,
  KeyRound,
  ShieldAlert,
} from "lucide-react";

export function formatModelDisplayName(model: string): string {
  if (!model) return "Gemini 3.7 Flash High";
  const clean = model.toLowerCase();
  if (clean.includes("gemini-flash") || clean.includes("gemini-3.7-flash")) return "Gemini 3.7 Flash High";
  if (clean.includes("gemini-pro") || clean.includes("gemini-1.5-pro")) return "Gemini 1.5 Pro";
  if (clean.includes("claude-3-7-sonnet")) return "Claude 3.7 Sonnet";
  if (clean.includes("claude-3-5-sonnet")) return "Claude 3.5 Sonnet";
  if (clean.includes("claude-3-5-haiku")) return "Claude 3.5 Haiku";
  if (clean.includes("gpt-4o-mini")) return "GPT-4o Mini";
  if (clean.includes("gpt-4o")) return "GPT-4o";
  if (clean.includes("o1")) return "OpenAI o1";
  if (clean.includes("deepseek")) return "DeepSeek Coder";
  if (clean.includes("llama")) return "Llama 3.3 70B";
  return model;
}

export function ModelDropupPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { providers, activeProviderId, activeModel, setActiveProviderAndModel } = useProviderStore();
  const { setSessionModel } = useSessionStore();
  const { setActiveView, setActiveSettingsTab } = useUiStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Filter providers that are actively configured (has key, is local, or marked configured)
  const configuredProviders = useMemo(() => {
    return Object.values(providers).filter(
      (p) => p.isConfigured || (p.apiKey && p.apiKey.trim().length > 0) || p.type === "local" || p.id === "gemini"
    );
  }, [providers]);

  const handleSelectModel = (providerId: string, model: string) => {
    setActiveProviderAndModel(providerId, model);
    setSessionModel(providerId, model);
    addToast(`Switched active model to ${formatModelDisplayName(model)}`, "info");
    setIsOpen(false);
  };

  const handleOpenProviderSettings = () => {
    setActiveView("settings");
    setActiveSettingsTab("providers");
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex items-center" ref={menuRef}>
      {/* Clean Minimalist Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 py-1 px-1 rounded-md text-xs text-[#8b949e] hover:text-white hover:bg-[#21262d] transition cursor-pointer select-none group"
        title={`Active Model: ${activeModel}. Click to switch configured providers.`}
      >
        <span className="font-medium text-xs text-[#c9d1d9] group-hover:text-white transition">
          {formatModelDisplayName(activeModel || "gemini-flash-latest")}
        </span>
        <ChevronUp className={`w-3.5 h-3.5 text-[#8b949e] group-hover:text-white transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dynamic Dropup Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-72 max-h-96 flex flex-col bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150 select-none">
          <div className="px-3 py-2 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]/70 flex-shrink-0">
            <span className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider">
              Available Models ({configuredProviders.length} Configured)
            </span>
            <button
              onClick={handleOpenProviderSettings}
              className="text-[10px] text-[#58a6ff] hover:underline flex items-center space-x-1"
            >
              <KeyRound className="w-2.5 h-2.5" />
              <span>Keys</span>
            </button>
          </div>

          {/* Scrollable Model Group List */}
          <div className="p-1.5 space-y-2 overflow-y-auto flex-1">
            {configuredProviders.length === 0 ? (
              <div className="p-3 text-center space-y-2">
                <ShieldAlert className="w-5 h-5 text-amber-400 mx-auto" />
                <p className="text-[11px] text-[#8b949e]">No provider API keys configured yet.</p>
                <button
                  onClick={handleOpenProviderSettings}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium"
                >
                  Configure Providers
                </button>
              </div>
            ) : (
              configuredProviders.map((provider) => (
                <div key={provider.id} className="space-y-1">
                  <div className="px-2 py-0.5 text-[10px] font-semibold text-[#8b949e] flex items-center justify-between">
                    <span>{provider.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0d1117] border border-[#30363d] text-[#58a6ff]">
                      {provider.type === "local" ? "Local" : "Connected"}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {provider.models.map((modelName) => {
                      const isSelected =
                        activeProviderId === provider.id && activeModel === modelName;

                      return (
                        <button
                          key={modelName}
                          type="button"
                          onClick={() => handleSelectModel(provider.id, modelName)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition text-[11px] ${
                            isSelected
                              ? "bg-blue-600/20 text-[#58a6ff] font-semibold border border-blue-500/40"
                              : "text-[#c9d1d9] hover:bg-[#21262d] hover:text-white border border-transparent"
                          }`}
                        >
                          <span className="font-mono truncate mr-2">{modelName}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Direct Settings Link */}
          <div className="p-2 border-t border-[#30363d] bg-[#0d1117]/60 flex-shrink-0">
            <button
              onClick={handleOpenProviderSettings}
              className="w-full flex items-center justify-center space-x-1.5 py-1 px-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white text-[11px] font-medium border border-[#30363d] transition"
            >
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span>Add / Manage Provider API Keys</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
