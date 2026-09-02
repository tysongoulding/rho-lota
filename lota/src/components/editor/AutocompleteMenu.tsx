import { Sparkles, Terminal } from "lucide-react";

interface AutocompleteItem {
  key: string;
  label: string;
  description: string;
  type: "skill" | "command";
}

const SUGGESTIONS: AutocompleteItem[] = [
  { key: "@create-plugin", label: "@create-plugin", description: "Scaffold a new MCP tool or plugin", type: "skill" },
  { key: "@plan", label: "@plan", description: "Design implementation plan", type: "skill" },
  { key: "@spec", label: "@spec", description: "Generate specification doc", type: "skill" },
  { key: "/model", label: "/model", description: "Switch active LLM model", type: "command" },
  { key: "/reload", label: "/reload", description: "Reload config and skills", type: "command" },
  { key: "/compact", label: "/compact", description: "Compact session memory context", type: "command" },
];

interface AutocompleteMenuProps {
  filter: string;
  onSelect: (item: AutocompleteItem) => void;
}

export function AutocompleteMenu({ filter, onSelect }: AutocompleteMenuProps) {
  const matches = SUGGESTIONS.filter((s) =>
    s.key.toLowerCase().startsWith(filter.toLowerCase())
  );

  if (matches.length === 0) return null;

  return (
    <div className="absolute bottom-full left-4 mb-2 w-72 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl overflow-hidden text-xs z-50">
      <div className="p-1.5 bg-[#0d1117] text-[10px] uppercase font-semibold text-[#8b949e] border-b border-[#30363d]">
        Suggestions
      </div>
      <div className="max-h-48 overflow-y-auto p-1">
        {matches.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item)}
            className="w-full flex items-center justify-between p-2 rounded hover:bg-[#21262d] text-left transition"
          >
            <div className="flex items-center space-x-2">
              {item.type === "skill" ? (
                <Sparkles className="w-3.5 h-3.5 text-[#58a6ff]" />
              ) : (
                <Terminal className="w-3.5 h-3.5 text-green-400" />
              )}
              <div>
                <div className="font-semibold text-white">{item.label}</div>
                <div className="text-[10px] text-[#8b949e]">{item.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
