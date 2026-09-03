import { useState, useRef, useCallback } from "react";
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
              className="flex items-center space-x-1.5 bg-[#0d1117] border border-[#30363d] text-[#58a6ff] px-2 py-0.5 rounded-md text-[11px] font-mono"
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

      {/* Main Textarea Container */}
      <div className="flex items-end space-x-2 bg-[#0d1117] border border-[#30363d] rounded-xl p-2 focus-within:border-blue-500 transition shadow-inner">
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
          rows={Math.min(6, Math.max(1, text.split("\n").length))}
          className="flex-1 bg-transparent border-none resize-none outline-none text-xs md:text-sm text-white placeholder-[#484f58] max-h-36 py-1 px-1.5"
        />

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <ContextRingGauge onClick={() => setShowContextModal(true)} />

          {isRunning ? (
            <button
              onClick={abort}
              className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
              title="Abort Turn (Esc)"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!text.trim() && attachedFiles.length === 0}
              className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition shadow-sm"
              title="Send Message (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Prompt Composer Footer Toolbar */}
      <div className="flex items-center justify-between mt-2.5 px-1 text-[10px] text-[#8b949e]">
        {/* Left Side: Context Plus Dropup + Dynamic Model Dropup + View Usage */}
        <div className="flex items-center space-x-2">
          <AddContextDropup
            onInsertMention={handleInsertChar}
            onOpenBrowserTool={handleOpenBrowserTool}
          />

          <ModelDropupPicker />

          <button
            type="button"
            onClick={handleOpenUsageWorkbench}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium text-[#c9d1d9] hover:text-white bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] transition shadow-sm"
            title="Open Token Usage & Cost Ledger (Right Workbench)"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Usage</span>
          </button>
        </div>

        {/* Right Side: Right-Aligned Keyboard Hints */}
        <div className="flex items-center space-x-3 text-[10px] text-[#8b949e]">
          {isRunning && (
            <div className="flex items-center space-x-1 text-blue-400 font-medium">
              <CornerDownLeft className="w-3 h-3" />
              <span>Queueing enabled</span>
            </div>
          )}

          <div className="flex items-center space-x-1.5 font-medium">
            <span>
              <kbd className="bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d] text-[9px] text-[#c9d1d9] font-mono">Enter</kbd> submit
            </span>
            <span className="text-[#484f58]">•</span>
            <span>
              <kbd className="bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d] text-[9px] text-[#c9d1d9] font-mono">Shift+Enter</kbd> newline
            </span>
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
