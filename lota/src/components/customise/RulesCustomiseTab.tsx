import { useState } from "react";
import { Shield, FileText, Check, Save } from "lucide-react";
import { useToastStore } from "../../store/toastStore";

export function RulesCustomiseTab() {
  const { addToast } = useToastStore();

  const [activeRuleId, setActiveRuleId] = useState<string>("global");

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
    addToast(`Saved & updated ${selectedRule.name}`, "success");
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5 max-w-5xl mx-auto text-xs text-[#c9d1d9]">
      <div>
        <h2 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>Layered Rules & System Grounding Directives</span>
        </h2>
        <p className="text-[#8b949e]">
          Configure layered instruction rules injected into the LLM context across global, project, and team tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Rule Selector Sidebar */}
        <div className="space-y-2 md:col-span-1">
          {rules.map((rule) => {
            const isSelected = activeRuleId === rule.id;
            return (
              <button
                key={rule.id}
                onClick={() => setActiveRuleId(rule.id)}
                className={`w-full p-3 rounded-xl border text-left transition ${
                  isSelected
                    ? "bg-purple-950/40 border-purple-500 text-white font-medium"
                    : "bg-[#161b22] border-[#30363d] text-[#8b949e] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold">{rule.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <div className="text-[10px] text-[#8b949e] truncate mt-1">{rule.file}</div>
                <div className="text-[10px] font-mono text-purple-300/80 mt-1">~{rule.tokens} tokens</div>
              </button>
            );
          })}
        </div>

        {/* Rule Editor Panel */}
        <div className="md:col-span-3 bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col space-y-3 min-h-[400px]">
          <div className="flex items-center justify-between border-b border-[#30363d] pb-2.5">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-white text-xs">{selectedRule.name}</span>
              <span className="font-mono text-[10px] text-[#8b949e]">({selectedRule.file})</span>
            </div>

            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center space-x-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>

          <textarea
            rows={14}
            value={selectedRule.content}
            onChange={(e) => selectedRule.setter(e.target.value)}
            className="w-full flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-white font-mono text-[11px] leading-relaxed outline-none focus:border-purple-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
