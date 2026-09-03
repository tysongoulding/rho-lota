import { useState, useRef, useCallback } from "react";
import { useSessionStore } from "../../store/sessionStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useSubagentStore } from "../../store/subagentStore";
import { useRhoEngine } from "../../hooks/useRhoEngine";
import { useTurnQueue } from "../../hooks/useTurnQueue";
import { AutocompleteMenu } from "./AutocompleteMenu";
import { ContextRingGauge } from "./ContextRingGauge";
import { ContextWindowModal } from "../modals/ContextWindowModal";
import { Send, Square, CornerDownLeft, FileCode, X } from "lucide-react";

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

    const match = val.match(/(?:^|\s)([@/][\w-./]*)$/);
    if (match) {
      setShowAutocomplete(true);
      setAutocompleteFilter(match[1]);
    } else {
      setShowAutocomplete(false);
    }
  };

  return (
    <div className="relative p-3 border-t border-[#30363d] bg-[#161b22]">
      {/* Attached Files Chips */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
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

      <div className="flex items-end space-x-2 bg-[#0d1117] border border-[#30363d] rounded-xl p-2 focus-within:border-blue-500 transition">
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
              className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition"
              title="Send Message (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-[#8b949e]">
        <div className="flex items-center space-x-2">
          <span>
            <kbd className="bg-[#21262d] px-1 py-0.5 rounded border border-[#30363d]">Enter</kbd> submit
          </span>
          <span>
            <kbd className="bg-[#21262d] px-1 py-0.5 rounded border border-[#30363d]">Shift+Enter</kbd> newline
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <CornerDownLeft className="w-3 h-3" />
          <span>Queueing enabled when running</span>
        </div>
      </div>

      {/* Context Window Diagnostics Modal */}
      {showContextModal && (
        <ContextWindowModal onClose={() => setShowContextModal(false)} />
      )}
    </div>
  );
}
