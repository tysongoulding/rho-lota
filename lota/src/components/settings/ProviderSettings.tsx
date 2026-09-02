import { useState } from "react";
import { useProviderStore, ProviderConfig } from "../../store/providerStore";
import {
  Key,
  Eye,
  EyeOff,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Check,
} from "lucide-react";

export function ProviderSettings() {
  const { providers, setApiKey, setEndpoint, checkOllama, ollamaStatus } = useProviderStore();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleShowKey = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const apiKeyProviders = Object.values(providers).filter((p) => p.type === "api_key");
  const oauthProviders = Object.values(providers).filter((p) => p.type === "oauth");
  const localProvider = providers.ollama;

  return (
    <div className="space-y-6">
      {/* API Key Providers */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center space-x-1.5">
          <Key className="w-3.5 h-3.5 text-[#58a6ff]" />
          <span>Cloud Providers & API Keys</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apiKeyProviders.map((prov) => (
            <ApiKeyCard
              key={prov.id}
              provider={prov}
              showKey={!!showKeys[prov.id]}
              onToggleShow={() => toggleShowKey(prov.id)}
              onKeyChange={(k) => setApiKey(prov.id, k)}
            />
          ))}
        </div>
      </div>

      {/* Local LLMs (Ollama) */}
      {localProvider && (
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-white text-xs">Ollama / Local Inference</span>
            </div>

            <div className="flex items-center space-x-2">
              {ollamaStatus === "online" && (
                <span className="flex items-center space-x-1 text-green-400 text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Online ({localProvider.models.length} models)</span>
                </span>
              )}
              {ollamaStatus === "offline" && (
                <span className="flex items-center space-x-1 text-red-400 text-[11px] font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Unreachable</span>
                </span>
              )}

              <button
                onClick={checkOllama}
                disabled={ollamaStatus === "checking"}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] text-[#c9d1d9] hover:text-white transition text-[11px]"
              >
                <RefreshCw className={`w-3 h-3 ${ollamaStatus === "checking" ? "animate-spin" : ""}`} />
                <span>Probe Endpoint</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={localProvider.endpoint || "http://localhost:11434"}
              onChange={(e) => setEndpoint("ollama", e.target.value)}
              placeholder="http://localhost:11434"
              className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 font-mono text-[11px] text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {localProvider.models.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {localProvider.models.map((m) => (
                <span
                  key={m}
                  className="bg-[#0d1117] text-[#8b949e] border border-[#30363d] px-2 py-0.5 rounded text-[10px] font-mono"
                >
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* OAuth Device Authentication */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center space-x-1.5">
          <LogIn className="w-3.5 h-3.5 text-purple-400" />
          <span>OAuth & Subscription Logins</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {oauthProviders.map((prov) => (
            <div
              key={prov.id}
              className="p-3.5 bg-[#161b22] border border-[#30363d] rounded-xl flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-white text-xs">{prov.name}</div>
                <div className="text-[10px] text-[#8b949e]">Device Code / PKCE Flow</div>
              </div>

              <button
                onClick={() => alert(`Triggering OAuth flow for ${prov.name}`)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white font-medium text-[11px] transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Authenticate</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ApiKeyCardProps {
  provider: ProviderConfig;
  showKey: boolean;
  onToggleShow: () => void;
  onKeyChange: (key: string) => void;
}

function ApiKeyCard({ provider, showKey, onToggleShow, onKeyChange }: ApiKeyCardProps) {
  return (
    <div className="p-3.5 bg-[#161b22] border border-[#30363d] rounded-xl space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-white text-xs">{provider.name}</span>
        {provider.isConfigured ? (
          <span className="flex items-center space-x-1 text-green-400 text-[10px] font-semibold">
            <Check className="w-3 h-3" />
            <span>Configured</span>
          </span>
        ) : (
          <span className="text-[#8b949e] text-[10px]">No API key</span>
        )}
      </div>

      <div className="relative flex items-center">
        <input
          type={showKey ? "text" : "password"}
          value={provider.apiKey || ""}
          onChange={(e) => onKeyChange(e.target.value)}
          placeholder={`Enter ${provider.name} API Key...`}
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-3 pr-8 py-1.5 font-mono text-[11px] text-white placeholder-[#484f58] focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-2.5 text-[#8b949e] hover:text-white p-0.5"
        >
          {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
