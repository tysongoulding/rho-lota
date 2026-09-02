import { useState } from "react";
import { Shield, FileText, Check, Save, Sliders, Cpu, Sparkles } from "lucide-react";
import { useToastStore } from "../../store/toastStore";

export function RulesCustomiseTab() {
  const { addToast } = useToastStore();

  const [activeRuleId, setActiveRuleId] = useState<string>("compacting");

  const [compactingPercent, setCompactingPercent] = useState<number>(85);
  const [compactingEngine, setCompactingEngine] = useState<string>("rig.rs");

  const [compactingContent, setCompactingContent] = useState(`# Context Limit Compaction & Continuation Protocol

## Task Context
- An LLM context limit was reached when a user was in an active working session with an agent.
- Generate a structured continuation checkpoint removing redundant verbose tool outputs while preserving 100% technical fidelity.
- Use framing and tone tailored for the agent to resume execution without loss of state.

## Mandatory Compaction Sections:
1. User Intent – All user goals, requests, and UI/architectural directives.
2. Technical Concepts – All frameworks, Rig/Rust FSM engines, and MCP protocols.
3. Files + Code – Viewed/edited files, complete modified snippets, and justifications.
4. Errors + Fixes – Compiler diagnostics, type issues, and applied resolutions.
5. Problem Solving – Solved architectural challenges and open design questions.
6. User Messages – Chronological history of user requests.
7. Pending Tasks – Outstanding unresolved user items.
8. Current Work – Exact files and state active at compaction time.
9. Next Step – Immediate direct technical command to continue.`);

  const [globalContent, setGlobalContent] = useState(`# General Instructions
- Direct Output: Start immediately with the solution, script, or code block.
- Absolute Brevity: If a single line answers the prompt, provide only that.
- Target Modifications: Prefer precise, incremental edits over full-file rewrites.
- Closed Loop Validation: Validate syntax and run checks locally before declaring complete.
- No Placeholders: Never emit // TODO or left-as-an-exercise placeholders.`);

  const [projectContent, setProjectContent] = useState(`# Repository Instructions
- Keep files concise (~150 lines target). Treat growth beyond ~150 lines as a signal to check cohesion.
- Separate unit tests into sibling tests.rs or tests/ submodules.
- Lint Policy: Do not add Clippy allow, expect, or crate-level lint suppressions.
- Testing: Use cargo nextest run for fast parallel test feedback.`);

  const [companyContent, setCompanyContent] = useState(`# Company Compliance & Governance
- Security: Never commit API keys, cloud secrets, or access tokens.
- Privacy: Strip internal hostnames, private IPs, and proprietary credentials before git push.`);

  const [teamContent, setTeamContent] = useState(`# Team Workflow & Defect Prevention
- TDD Discipline: Strict red-to-green verification before declaring task done.
- Defect Catalog: Review known regression classes in memory/defect-catalog.md.`);

  const rules = [
    {
      id: "compacting",
      name: "@COMPACTING-RULES",
      file: "crates/rho-engine/prompts/compacting.md",
      tokens: 310,
      enabled: true,
      content: compactingContent,
      setter: setCompactingContent,
    },
    {
      id: "global",
      name: "@GLOBAL-RULES",
      file: "~/.gemini/GEMINI.md",
      tokens: 420,
      enabled: true,
      content: globalContent,
      setter: setGlobalContent,
    },
    {
      id: "project",
      name: "@PROJECT-RULES",
      file: "c:/Users/tyson/.repo/personal/rho/AGENTS.md",
      tokens: 580,
      enabled: true,
      content: projectContent,
      setter: setProjectContent,
    },
    {
      id: "company",
      name: "@COMPANY-RULES",
      file: "templates/company-rules-template.md",
      tokens: 150,
      enabled: true,
      content: companyContent,
      setter: setCompanyContent,
    },
    {
      id: "team",
      name: "@TEAM-RULES",
      file: "templates/team-rules-template.md",
      tokens: 190,
      enabled: true,
      content: teamContent,
      setter: setTeamContent,
    },
  ];

  const selectedRule = rules.find((r) => r.id === activeRuleId) || rules[0];

  const handleSave = () => {
    addToast(`Saved & applied ${selectedRule.name} (Trigger: ${compactingPercent}%, Engine: ${compactingEngine})`, "success");
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5 max-w-5xl mx-auto text-xs text-[#c9d1d9]">
      <div>
        <h2 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>Layered Rules, Directives & Context Compacting</span>
        </h2>
        <p className="text-[#8b949e]">
          Configure grounding rule hierarchies and LLM memory compacting thresholds (rig.rs / goose engine).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Rule Selector Sidebar */}
        <div className="space-y-2 md:col-span-1">
          {rules.map((rule) => {
            const isSelected = activeRuleId === rule.id;
            const isCompacting = rule.id === "compacting";
            return (
              <button
                key={rule.id}
                onClick={() => setActiveRuleId(rule.id)}
                className={`w-full p-3 rounded-xl border text-left transition ${
                  isSelected
                    ? isCompacting
                      ? "bg-amber-950/40 border-amber-500 text-white font-medium"
                      : "bg-purple-950/40 border-purple-500 text-white font-medium"
                    : "bg-[#161b22] border-[#30363d] text-[#8b949e] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold">{rule.name}</span>
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        isCompacting ? "text-amber-400" : "text-purple-400"
                      }`}
                    />
                  )}
                </div>
                <div className="text-[10px] text-[#8b949e] truncate mt-1">{rule.file}</div>
                <div
                  className={`text-[10px] font-mono mt-1 ${
                    isCompacting ? "text-amber-300/80" : "text-purple-300/80"
                  }`}
                >
                  ~{rule.tokens} tokens
                </div>
              </button>
            );
          })}
        </div>

        {/* Rule Editor Panel */}
        <div className="md:col-span-3 bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col space-y-4 min-h-[420px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#30363d] pb-3">
            <div className="flex items-center space-x-2">
              <FileText
                className={`w-4 h-4 ${
                  selectedRule.id === "compacting" ? "text-amber-400" : "text-purple-400"
                }`}
              />
              <span className="font-semibold text-white text-xs">{selectedRule.name}</span>
              <span className="font-mono text-[10px] text-[#8b949e]">({selectedRule.file})</span>
            </div>

            <button
              onClick={handleSave}
              className={`px-3 py-1.5 rounded-lg text-white font-semibold text-xs flex items-center space-x-1.5 transition ${
                selectedRule.id === "compacting"
                  ? "bg-amber-600 hover:bg-amber-500"
                  : "bg-purple-600 hover:bg-purple-500"
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Apply</span>
            </button>
          </div>

          {/* Compacting Specific Parameters (when @COMPACTING-RULES selected) */}
          {selectedRule.id === "compacting" && (
            <div className="p-3.5 bg-[#0d1117] rounded-xl border border-[#30363d] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-white text-xs">Compaction Trigger Threshold</span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-400">
                  {compactingPercent}% of Context Window
                </span>
              </div>

              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={compactingPercent}
                onChange={(e) => setCompactingPercent(Number(e.target.value))}
                className="w-full accent-amber-500 bg-[#161b22] rounded-lg h-2 cursor-pointer"
              />

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span className="text-[#8b949e]">Compaction Engine:</span>
                  <select
                    value={compactingEngine}
                    onChange={(e) => setCompactingEngine(e.target.value)}
                    className="bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1 text-white font-mono text-xs outline-none focus:border-amber-500"
                  >
                    <option value="rig.rs">rig.rs (Native Rust Rho-Engine)</option>
                    <option value="goose">goose Context Summarizer</option>
                    <option value="custom">Custom AST Token Compactor</option>
                  </select>
                </div>

                <span className="text-[10px] text-[#8b949e] flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Auto-dispatched when {200000 * (compactingPercent / 100)} tokens reached</span>
                </span>
              </div>
            </div>
          )}

          {/* Rule Content Editor */}
          <div className="flex-1 flex flex-col space-y-1.5 min-h-0">
            <label className="text-[10px] uppercase font-semibold text-[#8b949e]">
              {selectedRule.id === "compacting"
                ? "Compaction System Prompt ('What to say' on compaction trigger)"
                : "Rule Markdown Directives"}
            </label>
            <textarea
              rows={12}
              value={selectedRule.content}
              onChange={(e) => selectedRule.setter(e.target.value)}
              className="w-full flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-white font-mono text-[11px] leading-relaxed outline-none focus:border-purple-500 resize-none"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
