import { GitBranch, Clock, User, Bot, Wrench } from "lucide-react";
import { useSessionStore } from "../../store/sessionStore";

export function SessionGraphViewer() {
  const { messages, sessionInfo } = useSessionStore();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto text-xs text-[#c9d1d9]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
            <GitBranch className="w-4 h-4 text-[#58a6ff]" />
            <span>DAG Session Exploration</span>
          </h2>
          <p className="text-[#8b949e]">
            Visual execution tree of conversational turns, tool forks, and checkpoints.
          </p>
        </div>

        {sessionInfo.id && (
          <span className="font-mono text-[11px] bg-[#161b22] px-2 py-1 rounded border border-[#30363d] text-white">
            Root: {sessionInfo.id.slice(0, 8)}
          </span>
        )}
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-[#8b949e]">
            <Clock className="w-6 h-6 mx-auto mb-2 text-[#30363d]" />
            <p>No turns recorded in the active session DAG yet.</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 border-l-2 border-[#30363d] ml-3">
            {messages.map((msg, idx) => (
              <div key={msg.id} className="relative">
                {/* Node dot */}
                <div
                  className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#161b22] ${
                    msg.role === "user"
                      ? "bg-blue-500"
                      : msg.role === "tool"
                      ? "bg-amber-400"
                      : "bg-purple-500"
                  }`}
                />

                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 font-semibold text-white">
                      {msg.role === "user" ? (
                        <User className="w-3.5 h-3.5 text-blue-400" />
                      ) : msg.role === "tool" ? (
                        <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      <span className="capitalize">{msg.role} Turn #{idx + 1}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#8b949e]">
                      {msg.id}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#8b949e] line-clamp-2">
                    {msg.role === "tool"
                      ? `Tool: ${msg.toolCall?.tool || "execution"}`
                      : msg.content || (msg.reasoning ? "Thinking..." : "Turn")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
