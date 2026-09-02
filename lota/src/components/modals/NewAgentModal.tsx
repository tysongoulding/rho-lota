import { useState } from "react";
import { useUiStore } from "../../store/uiStore";
import { useAgentStore, AgentPersona, BUILTIN_TOOLS } from "../../store/agentStore";
import { useToastStore } from "../../store/toastStore";
import {
  User,
  Sliders,
  ChevronDown,
  ChevronUp,
  X,
  Shield,
  Layers,
  Wrench,
  Sparkles,
  Target,
  FileText,
  Check,
} from "lucide-react";

export function NewAgentModal() {
  const { newAgentModalOpen, setNewAgentModalOpen, setActiveView } = useUiStore();
  const { addCustomPersona, setActivePersona } = useAgentStore();
  const { addToast } = useToastStore();

  const [showAdvanced, setShowAdvanced] = useState(false);

  // 1. System Identity & Objective
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [coreDirective, setCoreDirective] = useState("");
  const [targetModel, setTargetModel] = useState("inherit");
  const [reasoningEffort, setReasoningEffort] = useState<"low" | "medium" | "high" | "max">("high");
  const [temperature, setTemperature] = useState(0.2);
  const [permissionLevel, setPermissionLevel] = useState<"Read-Only" | "Sandboxed" | "Admin" | "Escalate">("Sandboxed");
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [maxStepRetries, setMaxStepRetries] = useState(3);
  const [latencySlaSeconds, setLatencySlaSeconds] = useState(30);

  // 2. Grounding & Hierarchical Context Sources
  const [globalRules, setGlobalRules] = useState(true);
  const [companyRules, setCompanyRules] = useState(false);
  const [projectRules, setProjectRules] = useState(true);
  const [teamRules, setTeamRules] = useState(true);
  const [requiredInputs, setRequiredInputs] = useState("Path to technical-plan.md or prompt");
  const [domainMemory, setDomainMemory] = useState("memory/decision-log.md");
  const [targetSchemas, setTargetSchemas] = useState("crates/rho-engine API contracts");

  // 3. Operational Constraints & Boundaries
  const [whatToDo, setWhatToDo] = useState("1. Follow strict TDD discipline\n2. Provide exact replacement diffs\n3. Execute dry runs");
  const [whatNotToDo, setWhatNotToDo] = useState("1. Never emit // TODO placeholders\n2. Never bypass pre-commit hooks or lints\n3. Never output ungrounded assumptions");

  // 4. Execution Flow & Control Loop
  const [patternType, setPatternType] = useState<"ReAct" | "Planning" | "Reflection" | "Routing" | "Multi-Agent Handoff">("ReAct");
  const [stepByStepLogic, setStepByStepLogic] = useState("Input Intake -> Metric Evaluation -> Tool Execution -> Verification");

  // 5. Tool Registry
  const [selectedTools, setSelectedTools] = useState<string[]>(["read", "write", "edit", "bash"]);

  // 6. Performance Metrics (OKRs)
  const [okrObjective, setOkrObjective] = useState("Deliver zero-defect, compile-clean software modifications");
  const [krTargets, setKrTargets] = useState("KR1: ≥95% pass rate | KR2: 0 hallucinations | KR3: Latency < 30s");

  // 7. Response Formatting & Style
  const [tone, setTone] = useState<"Expert" | "Concise" | "Direct" | "Formal" | "Operational">("Direct");
  const [formattingRules, setFormattingRules] = useState("Lead immediately with the code solution or diff. Omit conversational filler.");

  if (!newAgentModalOpen) return null;

  const toggleTool = (toolName: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolName) ? prev.filter((t) => t !== toolName) : [...prev, toolName]
    );
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `agent-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-4)}`;

    const newPersona: AgentPersona = {
      id,
      name: name.trim(),
      role: role.trim() || "AI Specialist",
      description: description.trim() || "Custom AI agent persona configured via Universal Template.",
      systemPrompt: `${coreDirective || description || "You are an expert AI agent."}\nTone: ${tone}.\n${formattingRules}`,
      defaultTools: selectedTools,
      temperature,
      thinkingLevel: reasoningEffort,
      coreDirective,
      targetModel,
      permissionLevel,
      confidenceThreshold,
      maxTokens,
      maxStepRetries,
      latencySlaSeconds,
      globalRules,
      companyRules,
      projectRules,
      teamRules,
      requiredInputs,
      domainMemory,
      targetSchemas,
      whatToDo,
      whatNotToDo,
      patternType,
      stepByStepLogic,
      okrObjective,
      krTargets,
      tone,
      formattingRules,
    };

    addCustomPersona(newPersona);
    setActivePersona(id);
    setNewAgentModalOpen(false);
    setActiveView("agents");
    addToast(`Created & activated agent: ${name}`, "success");
  };

  return (
    <div
      onClick={() => setNewAgentModalOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden text-xs flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-white text-sm">New Universal AI Agent</span>
          </div>
          <button
            onClick={() => setNewAgentModalOpen(false)}
            className="text-[#8b949e] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleCreateAgent} className="flex-1 overflow-y-auto p-5 space-y-5 text-[#c9d1d9]">
          {/* Primary Quick Fields */}
          <div className="space-y-3 bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
            <div>
              <label className="text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider block mb-1">
                Agent Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Senior Security Auditor"
                className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-white text-xs focus:border-purple-500 outline-none"
                autoFocus
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider block mb-1">
                Title / Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Systems Engineer & Security Lead"
                className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-white text-xs focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider block mb-1">
                Purpose / Function
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Clear, single-sentence definition of the agent's primary function and goals."
                className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-white text-xs focus:border-purple-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Advanced Options Accordion Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] transition font-semibold text-xs"
            >
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Universal AI Agent Configuration Template</span>
              </div>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Advanced Template Sections */}
          {showAdvanced && (
            <div className="space-y-6 pt-1 animate-in fade-in duration-200">
              {/* 1. System Identity & Objective */}
              <div className="space-y-3 bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
                <h3 className="text-xs font-semibold text-purple-300 flex items-center space-x-1.5">
                  <Target className="w-3.5 h-3.5 text-purple-400" />
                  <span>1. System Identity & Dynamic Control Metrics</span>
                </h3>

                <div>
                  <label className="text-[10px] text-[#8b949e] uppercase font-semibold block mb-1">Core Directive</label>
                  <input
                    type="text"
                    value={coreDirective}
                    onChange={(e) => setCoreDirective(e.target.value)}
                    placeholder="The absolute priority rule the agent must optimize for above all else"
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] text-[#8b949e] uppercase font-semibold block mb-1">Target Model</label>
                    <select
                      value={targetModel}
                      onChange={(e) => setTargetModel(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-2 py-1.5 text-white text-xs outline-none"
                    >
                      <option value="inherit">inherit</option>
                      <option value="flash_lite">flash_lite</option>
                      <option value="flash">flash</option>
                      <option value="pro">pro</option>
                      <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                      <option value="claude-3-7-sonnet">claude-3-7-sonnet</option>
                      <option value="gpt-4o">gpt-4o</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#8b949e] uppercase font-semibold block mb-1">Reasoning Effort</label>
                    <select
                      value={reasoningEffort}
                      onChange={(e) => setReasoningEffort(e.target.value as "low" | "medium" | "high" | "max")}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-2 py-1.5 text-white text-xs outline-none"
                    >
                      <option value="low">low</option>
                      <option value="medium">medium</option>
                      <option value="high">high</option>
                      <option value="max">max</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#8b949e] uppercase font-semibold block mb-1">Permission Level</label>
                    <select
                      value={permissionLevel}
                      onChange={(e) => setPermissionLevel(e.target.value as "Read-Only" | "Sandboxed" | "Admin" | "Escalate")}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-2 py-1.5 text-white text-xs outline-none"
                    >
                      <option value="Read-Only">Read-Only</option>
                      <option value="Sandboxed">Sandboxed</option>
                      <option value="Admin">Admin</option>
                      <option value="Escalate">Escalate</option>
                    </select>
                  </div>
                </div>

                {/* Temperature & Confidence Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-[#8b949e] mb-1 font-semibold">
                      <span>Temperature: {temperature.toFixed(2)}</span>
                      <span>{temperature === 0 ? "Deterministic" : temperature < 0.5 ? "Precise" : "Creative"}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-[#8b949e] mb-1 font-semibold">
                      <span>Confidence Threshold</span>
                      <span>{confidenceThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      step="5"
                      value={confidenceThreshold}
                      onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Limits */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div>
                    <label className="text-[10px] text-[#8b949e] block mb-1 font-mono">Max Tokens</label>
                    <input
                      type="number"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value) || 4000)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-white font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8b949e] block mb-1 font-mono">Max Retries</label>
                    <input
                      type="number"
                      value={maxStepRetries}
                      onChange={(e) => setMaxStepRetries(parseInt(e.target.value) || 3)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-white font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8b949e] block mb-1 font-mono">Latency SLA (s)</label>
                    <input
                      type="number"
                      value={latencySlaSeconds}
                      onChange={(e) => setLatencySlaSeconds(parseInt(e.target.value) || 30)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Grounding & Hierarchical Context Sources */}
              <div className="space-y-3 bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
                <h3 className="text-xs font-semibold text-purple-300 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>2. Grounding & Hierarchical Rules Directives</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: "@GLOBAL-RULES", state: globalRules, toggle: () => setGlobalRules(!globalRules) },
                    { key: "@COMPANY-RULES", state: companyRules, toggle: () => setCompanyRules(!companyRules) },
                    { key: "@PROJECT-RULES", state: projectRules, toggle: () => setProjectRules(!projectRules) },
                    { key: "@TEAM-RULES", state: teamRules, toggle: () => setTeamRules(!teamRules) },
                  ].map((rule) => (
                    <button
                      key={rule.key}
                      type="button"
                      onClick={rule.toggle}
                      className={`py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-between text-[11px] font-mono ${
                        rule.state
                          ? "bg-purple-950/30 border-purple-500 text-purple-200"
                          : "bg-[#161b22] border-[#30363d] text-[#8b949e]"
                      }`}
                    >
                      <span className="truncate">{rule.key}</span>
                      {rule.state && <Check className="w-3 h-3 text-purple-400 ml-1 flex-shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-1">
                  <div>
                    <label className="text-[10px] text-[#8b949e] uppercase font-semibold block mb-1">Required Inputs</label>
                    <input
                      type="text"
                      value={requiredInputs}
                      onChange={(e) => setRequiredInputs(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8b949e] uppercase font-semibold block mb-1">Domain Memory / Defect Catalogs</label>
                    <input
                      type="text"
                      value={domainMemory}
                      onChange={(e) => setDomainMemory(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8b949e] uppercase font-semibold block mb-1">Target Surface Schemas</label>
                    <input
                      type="text"
                      value={targetSchemas}
                      onChange={(e) => setTargetSchemas(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Operational Constraints & Boundaries */}
              <div className="space-y-3 bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
                <h3 className="text-xs font-semibold text-purple-300 flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>3. Operational Constraints & Hard Guardrails</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-green-400 uppercase font-semibold block mb-1">What to Do (Responsibilities)</label>
                    <textarea
                      rows={3}
                      value={whatToDo}
                      onChange={(e) => setWhatToDo(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-2 text-white font-mono text-[10px] outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-red-400 uppercase font-semibold block mb-1">What NOT to Do (Hard Guardrails)</label>
                    <textarea
                      rows={3}
                      value={whatNotToDo}
                      onChange={(e) => setWhatNotToDo(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-2 text-white font-mono text-[10px] outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Execution Flow & Pattern Type */}
              <div className="space-y-3 bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
                <h3 className="text-xs font-semibold text-purple-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>4. Execution Flow & Pattern Type</span>
                </h3>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {(["ReAct", "Planning", "Reflection", "Routing", "Multi-Agent Handoff"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPatternType(type)}
                      className={`py-1.5 px-2 rounded-lg border text-center transition text-[10px] font-semibold ${
                        patternType === type
                          ? "bg-purple-950/30 border-purple-500 text-purple-200"
                          : "bg-[#161b22] border-[#30363d] text-[#8b949e]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-[10px] text-[#8b949e] uppercase font-semibold block mb-1">Control Loop Logic</label>
                  <input
                    type="text"
                    value={stepByStepLogic}
                    onChange={(e) => setStepByStepLogic(e.target.value)}
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] outline-none"
                  />
                </div>
              </div>

              {/* 5. Tool Registry */}
              <div className="space-y-3 bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
                <h3 className="text-xs font-semibold text-purple-300 flex items-center space-x-1.5">
                  <Wrench className="w-3.5 h-3.5 text-purple-400" />
                  <span>5. Tool Registry & Invocation Controls</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BUILTIN_TOOLS.map((tool) => {
                    const isSelected = selectedTools.includes(tool.name);
                    return (
                      <button
                        key={tool.name}
                        type="button"
                        onClick={() => toggleTool(tool.name)}
                        className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                          isSelected
                            ? "bg-purple-950/30 border-purple-500 text-white"
                            : "bg-[#161b22] border-[#30363d] text-[#8b949e]"
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-mono text-xs font-semibold truncate">{tool.name}</div>
                          <div className="text-[9px] text-[#8b949e] truncate">{tool.description}</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 ml-1.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6 & 7. OKRs, Tone & Style */}
              <div className="space-y-3 bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
                <h3 className="text-xs font-semibold text-purple-300 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>6 & 7. Performance OKRs, Tone & Formatting Style</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#8b949e] uppercase font-semibold block mb-1">Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as "Expert" | "Concise" | "Direct" | "Formal" | "Operational")}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-white text-xs outline-none mb-2"
                    >
                      <option value="Direct">Direct</option>
                      <option value="Expert">Expert</option>
                      <option value="Concise">Concise</option>
                      <option value="Formal">Formal</option>
                      <option value="Operational">Operational</option>
                    </select>

                    <label className="text-[10px] text-[#8b949e] uppercase font-semibold block mb-1">Formatting Rules</label>
                    <textarea
                      rows={2}
                      value={formattingRules}
                      onChange={(e) => setFormattingRules(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-2 text-white font-mono text-[10px] outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#8b949e] uppercase font-semibold block mb-1">OKR Objective</label>
                    <input
                      type="text"
                      value={okrObjective}
                      onChange={(e) => setOkrObjective(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-white text-xs outline-none mb-2"
                    />

                    <label className="text-[10px] text-[#8b949e] uppercase font-semibold block mb-1">Evaluation Key Results (KRs)</label>
                    <textarea
                      rows={2}
                      value={krTargets}
                      onChange={(e) => setKrTargets(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-2 text-white font-mono text-[10px] outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-[#30363d]">
            <button
              type="button"
              onClick={() => setNewAgentModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#21262d] text-[#8b949e] hover:text-white transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-500/20 transition flex items-center space-x-1.5"
            >
              <User className="w-4 h-4" />
              <span>Create Agent</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
