import { useState, useRef, useEffect, useCallback } from "react";
import { useSessionStore } from "../../store/sessionStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useSubagentStore } from "../../store/subagentStore";
import { useUiStore } from "../../store/uiStore";
import { useRhoEngine } from "../../hooks/useRhoEngine";
import { useTurnQueue } from "../../hooks/useTurnQueue";
import { AutocompleteMenu } from "./AutocompleteMenu";
import { ContextRingGauge } from "./ContextRingGauge";
import { ContextWindowModal } from "../modals/ContextWindowModal";
import { AddContextDropup } from "./AddContextDropup";
import { ModelDropupPicker } from "./ModelDropupPicker";
import {
  Send,
  Square,
  CornerDownLeft,
  FileCode,
  X,
  BarChart3,
} from "lucide-react";

interface PromptInputProps {
  placeholder?: string;
}

export function PromptInput({ placeholder }: PromptInputProps = {}) {
  const [text, setText] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteFilter, setAutocompleteFilter] = useState("");
  const [showContextModal, setShowContextModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isRunning, addUserMessage } = useSessionStore();
  const { attachedFiles, removeAttachedFile, clearAttachedFiles } = useWorkspaceStore();
  const { subagents, activeChatAgentId } = useSubagentStore();
  const { setActiveWorkbenchTab, setWorkbenchOpen } = useUiStore();
  const { prompt, abort } = useRhoEngine();
  const { enqueue } = useTurnQueue();

  const activeAgent = subagents.find((a) => a.id === activeChatAgentId);

  // Auto-expand textarea height fluidly up to 180px as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 36), 180)}px`;
    }
  }, [text]);

  const handleSend = useCallback(async () => {
    let content = text.trim();
    if (!content && attachedFiles.length === 0) return;

    if (attachedFiles.length > 0) {
      const fileTags = attachedFiles.map((f) => `@${f}`).join(" ");
      content = content ? `${fileTags}\n${content}` : fileTags;
    }

    if (isRunning) {
      enqueue(content);
      setText("");
      clearAttachedFiles();
      return;
    }

    setText("");
    clearAttachedFiles();
    setShowAutocomplete(false);
    addUserMessage(content);
    await prompt(content);
  }, [text, attachedFiles, isRunning, enqueue, addUserMessage, prompt, clearAttachedFiles]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "Escape") {
      if (showAutocomplete) {
        setShowAutocomplete(false);
      } else if (isRunning) {
        abort();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);

    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = val.slice(0, cursorPos);
    const triggerMatch = textBeforeCursor.match(/(?:^|\s)([@/][\w-./]*)$/);

    if (triggerMatch) {
      setShowAutocomplete(true);
      setAutocompleteFilter(triggerMatch[1]);
    } else {
      setShowAutocomplete(false);
    }
  };

  const handleInsertChar = (char: string) => {
    setText((prev) => `${prev}${prev.endsWith(" ") || prev === "" ? "" : " "}${char}`);
    if (char === "@" || char === "/") {
      setShowAutocomplete(true);
      setAutocompleteFilter(char);
    }
    textareaRef.current?.focus();
  };

  const handleOpenBrowserTool = () => {
    setText((prev) => `${prev}${prev.endsWith(" ") || prev === "" ? "" : " "}/browser `);
    textareaRef.current?.focus();
  };

  const handleOpenUsageWorkbench = () => {
    setActiveWorkbenchTab("usage");
    setWorkbenchOpen(true);
  };

  return (
    <div className="relative w-full">
      {/* Attached Files Pills */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2 px-1">
          {attachedFiles.map((file) => (
            <span
              key={file}
              className="flex items-center space-x-1.5 bg-[#161b22] border border-[#30363d] text-[#58a6ff] px-2.5 py-0.5 rounded-lg text-[11px] font-mono shadow-sm"
            >
              <FileCode className="w-3 h-3" />
              <span>{file}</span>
              <button
                onClick={() => removeAttachedFile(file)}
                className="hover:text-red-400 p-0.5 rounded transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Autocomplete Dropdown */}
      {showAutocomplete && (
        <AutocompleteMenu
          filter={autocompleteFilter}
          onSelect={(item) => {
            const updated = text.replace(/(?:^|\s)([@/][\w-./]*)$/, ` ${item.label} `);
            setText(updated.trimStart());
            setShowAutocomplete(false);
            textareaRef.current?.focus();
          }}
        />
      )}

      {/* Unified Compact Prompt Card */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-2.5 focus-within:border-[#58a6ff]/70 focus-within:ring-1 focus-within:ring-[#58a6ff]/20 shadow-xl transition-all space-y-2">
        {/* Upper Input Area (Textarea + Send/Ring Action Cluster) */}
        <div className="flex items-end space-x-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              placeholder ||
              (isRunning
                ? "Type to queue follow-up message..."
                : activeAgent
                ? `Ask ${activeAgent.name} anything, or use @file / /command...`
                : "Ask Rho anything, or use @file / /command...")
            }
            className="flex-1 bg-transparent border-none resize-none outline-none text-xs md:text-sm text-white placeholder-[#6e7681] min-h-[36px] max-h-44 py-1 px-1 leading-relaxed overflow-y-auto"
          />

          <div className="flex items-center space-x-1.5 flex-shrink-0 pb-0.5">
            <ContextRingGauge onClick={() => setShowContextModal(true)} />

            {isRunning ? (
              <button
                onClick={abort}
                className="p-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition shadow-sm"
                title="Abort Turn (Esc)"
              >
                <Square className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!text.trim() && attachedFiles.length === 0}
                className="p-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white transition shadow-sm"
                title="Send Message (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Lower Toolbar: Tools on Left, Keyboard Hints on Right */}
        <div className="flex items-center justify-between pt-1.5 border-t border-[#30363d]/60 text-[10px] text-[#8b949e]">
          {/* Left: Quick Actions */}
          <div className="flex items-center space-x-1.5">
            <AddContextDropup
              onInsertMention={handleInsertChar}
              onOpenBrowserTool={handleOpenBrowserTool}
            />

            <ModelDropupPicker />

            <button
              type="button"
              onClick={handleOpenUsageWorkbench}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium text-[#c9d1d9] hover:text-white bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] transition"
              title="Open Token Usage & Cost Ledger"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">Usage</span>
            </button>
          </div>

          {/* Right: Keyboard Shortcuts */}
          <div className="flex items-center space-x-2 text-[10px] text-[#8b949e]">
            {isRunning && (
              <div className="flex items-center space-x-1 text-blue-400 font-medium mr-1">
                <CornerDownLeft className="w-3 h-3" />
                <span>Queueing</span>
              </div>
            )}

            <div className="flex items-center space-x-1.5 font-medium">
              <span>
                <kbd className="bg-[#0d1117] px-1.5 py-0.5 rounded border border-[#30363d] text-[9px] text-[#c9d1d9] font-mono">Enter</kbd> submit
              </span>
              <span className="text-[#484f58]">•</span>
              <span>
                <kbd className="bg-[#0d1117] px-1.5 py-0.5 rounded border border-[#30363d] text-[9px] text-[#c9d1d9] font-mono">Shift+Enter</kbd> newline
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Context Window Diagnostics Modal */}
      {showContextModal && (
        <ContextWindowModal onClose={() => setShowContextModal(false)} />
      )}
    </div>
  );
}
