import React, { useState, useEffect, useRef } from "react";
import { rhoClient } from "./lib/rpc";
import { RpcEvent } from "./lib/protocol";
import { Send, Square, Play, Terminal, ShieldAlert, Cpu } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  toolCall?: {
    tool: string;
    arguments: Record<string, unknown>;
    output?: string;
    isError?: boolean;
  };
  reasoning?: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{ id?: string; model?: string; provider?: string }>({});
  const [usage, setUsage] = useState<{ inputTokens?: number; outputTokens?: number; contextPercent?: number }>({});
  const [pendingApproval, setPendingApproval] = useState<{
    approvalId: string;
    tool: string;
    args: Record<string, unknown>;
    desc?: string;
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = rhoClient.onEvent((event: RpcEvent) => {
      switch (event.type) {
        case "session_start":
          setSessionInfo({
            id: event.session_id,
            model: event.model,
            provider: event.provider,
          });
          break;

        case "turn_start":
          setIsRunning(true);
          setMessages((prev) => [
            ...prev,
            {
              id: `turn-${event.turn_number}`,
              role: "assistant",
              content: "",
            },
          ]);
          break;

        case "text_chunk":
          setMessages((prev) => {
            if (prev.length === 0) return prev;
            const updated = [...prev];
            const last = { ...updated[updated.length - 1] };
            if (last.role === "assistant") {
              last.content += event.content;
              updated[updated.length - 1] = last;
            }
            return updated;
          });
          break;

        case "reasoning_chunk":
          setMessages((prev) => {
            if (prev.length === 0) return prev;
            const updated = [...prev];
            const last = { ...updated[updated.length - 1] };
            if (last.role === "assistant") {
              last.reasoning = (last.reasoning || "") + event.content;
              updated[updated.length - 1] = last;
            }
            return updated;
          });
          break;

        case "tool_approval_request":
          setPendingApproval({
            approvalId: event.approval_id,
            tool: event.tool,
            args: event.arguments,
            desc: event.description,
          });
          break;

        case "tool_call_start":
          setMessages((prev) => [
            ...prev,
            {
              id: `tool-${event.call_id}`,
              role: "tool",
              content: "",
              toolCall: {
                tool: event.tool,
                arguments: event.arguments,
              },
            },
          ]);
          break;

        case "tool_call_result":
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === `tool-${event.call_id}`
                ? {
                    ...msg,
                    toolCall: {
                      ...msg.toolCall!,
                      output: event.output,
                      isError: event.is_error,
                    },
                  }
                : msg
            )
          );
          break;

        case "usage_update":
          setUsage({
            inputTokens: event.input_tokens,
            outputTokens: event.output_tokens,
            contextPercent: event.context_percent,
          });
          break;

        case "turn_end":
          setIsRunning(false);
          break;

        case "error":
          setIsRunning(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `err-${Date.now()}`,
              role: "system",
              content: `Error [${event.code}]: ${event.message}`,
            },
          ]);
          break;
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isRunning) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: userMsg },
    ]);

    await rhoClient.prompt(userMsg);
  };

  const handleApproval = async (decision: "allow" | "deny") => {
    if (!pendingApproval) return;
    await rhoClient.respondToTool(pendingApproval.approvalId, decision);
    setPendingApproval(null);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-[#c9d1d9] font-sans antialiased">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-7 h-7 rounded bg-blue-600/20 text-blue-400 font-bold text-sm">
            ρ
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-wide">Rho Lota</h1>
            <p className="text-xs text-[#8b949e]">
              {sessionInfo.provider || "anthropic"} / {sessionInfo.model || "claude-3-7-sonnet"}
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center space-x-4 text-xs text-[#8b949e]">
          {usage.contextPercent !== undefined && (
            <div className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span>{usage.contextPercent.toFixed(1)}% context</span>
            </div>
          )}
          {sessionInfo.id && (
            <span className="font-mono text-[10px] bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d]">
              {sessionInfo.id.slice(0, 8)}
            </span>
          )}
        </div>
      </header>

      {/* Main message feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-[#8b949e]">
            <Terminal className="w-12 h-12 mb-3 text-[#30363d]" />
            <p className="text-sm">Start a conversation with Rho</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            {msg.role === "user" ? (
              <div className="bg-[#1f6feb] text-white px-4 py-2.5 rounded-lg max-w-[80%] text-sm whitespace-pre-wrap">
                {msg.content}
              </div>
            ) : msg.role === "tool" ? (
              <div className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[#58a6ff] mb-1 font-semibold">
                  <span>⚡ Tool: {msg.toolCall?.tool}</span>
                </div>
                <div className="bg-[#0d1117] p-2 rounded text-[#8b949e] overflow-x-auto my-1">
                  {JSON.stringify(msg.toolCall?.arguments, null, 2)}
                </div>
                {msg.toolCall?.output && (
                  <div
                    className={`mt-2 p-2 rounded max-h-48 overflow-y-auto whitespace-pre-wrap ${
                      msg.toolCall.isError
                        ? "bg-red-950/30 text-red-400 border border-red-900/50"
                        : "bg-[#0d1117] text-[#7ee787]"
                    }`}
                  >
                    {msg.toolCall.output}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] px-4 py-3 rounded-lg max-w-[90%] text-sm">
                {msg.reasoning && (
                  <details className="mb-2 text-xs text-[#8b949e] border-b border-[#30363d] pb-2">
                    <summary className="cursor-pointer font-medium hover:text-white">
                      Thinking Process
                    </summary>
                    <div className="mt-1 whitespace-pre-wrap font-mono text-[11px] text-[#8b949e] bg-[#0d1117] p-2 rounded">
                      {msg.reasoning}
                    </div>
                  </details>
                )}
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Human-in-the-loop Approval Modal */}
      {pendingApproval && (
        <div className="mx-4 mb-3 p-3 bg-[#21262d] border border-yellow-600/50 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-yellow-400" />
            <div>
              <span className="font-semibold text-yellow-400">Approval Required:</span>{" "}
              <span>Tool <code className="bg-[#0d1117] px-1 py-0.5 rounded font-mono">{pendingApproval.tool}</code> requested execution.</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleApproval("deny")}
              className="px-2.5 py-1 rounded bg-[#30363d] hover:bg-[#3c444d] text-white"
            >
              Reject
            </button>
            <button
              onClick={() => handleApproval("allow")}
              className="px-2.5 py-1 rounded bg-green-600 hover:bg-green-500 text-white font-medium"
            >
              Approve
            </button>
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="p-4 border-t border-[#30363d] bg-[#161b22]">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message or instruction..."
            disabled={isRunning}
            className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white placeholder-[#484f58] focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
          {isRunning ? (
            <button
              type="button"
              onClick={() => rhoClient.abort()}
              className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition"
              title="Abort Turn"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
