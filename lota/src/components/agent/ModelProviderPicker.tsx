import { useSessionStore } from "../../store/sessionStore";
import { useRhoEngine } from "../../hooks/useRhoEngine";
import { Sparkles, Check } from "lucide-react";

export interface ProviderItem {
  id: string;
  name: string;
  defaultModel: string;
  models: string[];
  type: "api_key" | "local" | "oauth";
}

const PROVIDERS: ProviderItem[] = [
  { id: "anthropic", name: "Anthropic", defaultModel: "claude-3-7-sonnet-20250219", models: ["claude-3-7-sonnet-20250219", "claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022"], type: "api_key" },
  { id: "openai", name: "OpenAI", defaultModel: "gpt-4o", models: ["gpt-4o", "gpt-4o-mini", "o1", "o3-mini"], type: "api_key" },
  { id: "gemini", name: "Google Gemini", defaultModel: "gemini-2.0-flash", models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"], type: "api_key" },
  { id: "deepseek", name: "DeepSeek", defaultModel: "deepseek-chat", models: ["deepseek-chat", "deepseek-reasoner"], type: "api_key" },
  { id: "groq", name: "Groq", defaultModel: "llama-3.3-70b-versatile", models: ["llama-3.3-70b-versatile", "mixtral-8x7b-32768"], type: "api_key" },
  { id: "local", name: "Ollama (Local)", defaultModel: "llama3.2", models: ["llama3.2", "qwen2.5-coder:32b", "deepseek-r1:14b"], type: "local" },
];

export function ModelProviderPicker() {
  const { sessionInfo } = useSessionStore();
  const { send } = useRhoEngine();

  const handleSelect = async (provider: string, model: string) => {
    await send({ type: "set_model", provider, model });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto text-xs text-[#c9d1d9]">
      <div>
        <h2 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#58a6ff]" />
          <span>Model Providers & Rig Backends</span>
        </h2>
        <p className="text-[#8b949e]">
          Switch active AI model architectures and providers backed by Rig's unified provider engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PROVIDERS.map((prov) => {
          const isCurrentProvider = (sessionInfo.provider || "anthropic").toLowerCase() === prov.id.toLowerCase();

          return (
            <div
              key={prov.id}
              className={`p-4 bg-[#161b22] border rounded-xl space-y-3 transition ${
                isCurrentProvider ? "border-blue-500 shadow-md shadow-blue-500/10" : "border-[#30363d]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white text-sm">{prov.name}</span>
                  <span className="text-[10px] uppercase font-mono text-[#8b949e] bg-[#0d1117] px-1.5 py-0.5 rounded border border-[#30363d]">
                    {prov.type}
                  </span>
                </div>
                {isCurrentProvider && (
                  <span className="flex items-center text-blue-400 text-xs font-medium">
                    <Check className="w-3.5 h-3.5 mr-0.5" />
                    Selected
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] text-[#8b949e] uppercase tracking-wider">Models</div>
                <div className="flex flex-wrap gap-1.5">
                  {prov.models.map((mod) => {
                    const isCurrentModel = isCurrentProvider && (sessionInfo.model || prov.defaultModel) === mod;
                    return (
                      <button
                        key={mod}
                        onClick={() => handleSelect(prov.id, mod)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${
                          isCurrentModel
                            ? "bg-blue-600 text-white font-medium"
                            : "bg-[#0d1117] text-[#c9d1d9] border border-[#30363d] hover:border-[#58a6ff]"
                        }`}
                      >
                        {mod}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
