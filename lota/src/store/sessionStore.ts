import { create } from "zustand";
import { RpcEvent } from "../lib/protocol";

export interface ToolCallData {
  tool: string;
  arguments: Record<string, unknown>;
  output?: string;
  isError?: boolean;
  durationMs?: number;
}

export interface MessageItem {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  reasoning?: string;
  toolCall?: ToolCallData;
}

export interface SessionInfo {
  id?: string;
  model?: string;
  provider?: string;
}

export interface UsageInfo {
  inputTokens?: number;
  outputTokens?: number;
  contextPercent?: number;
}

export interface ApprovalRequest {
  approvalId: string;
  tool: string;
  arguments: Record<string, unknown>;
  description?: string;
}

interface SessionState {
  isRunning: boolean;
  sessionInfo: SessionInfo;
  usage: UsageInfo;
  messages: MessageItem[];
  pendingApproval: ApprovalRequest | null;

  // Actions
  handleEvent: (event: RpcEvent) => void;
  addUserMessage: (content: string) => void;
  appendBufferedChunk: (chunk: string) => void;
  appendBufferedReasoning: (chunk: string) => void;
  clearPendingApproval: () => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isRunning: false,
  sessionInfo: {},
  usage: {},
  messages: [],
  pendingApproval: null,

  addUserMessage: (content: string) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: `user-${Date.now()}`, role: "user", content },
      ],
    })),

  appendBufferedChunk: (chunk: string) =>
    set((state) => {
      if (state.messages.length === 0) return state;
      const messages = [...state.messages];
      const last = { ...messages[messages.length - 1] };
      if (last.role === "assistant") {
        last.content += chunk;
        messages[messages.length - 1] = last;
      }
      return { messages };
    }),

  appendBufferedReasoning: (chunk: string) =>
    set((state) => {
      if (state.messages.length === 0) return state;
      const messages = [...state.messages];
      const last = { ...messages[messages.length - 1] };
      if (last.role === "assistant") {
        last.reasoning = (last.reasoning || "") + chunk;
        messages[messages.length - 1] = last;
      }
      return { messages };
    }),

  clearPendingApproval: () => set({ pendingApproval: null }),

  resetSession: () =>
    set({
      isRunning: false,
      sessionInfo: {},
      usage: {},
      messages: [],
      pendingApproval: null,
    }),

  handleEvent: (event: RpcEvent) =>
    set((state) => {
      switch (event.type) {
        case "session_start":
          return {
            sessionInfo: {
              id: event.session_id,
              model: event.model,
              provider: event.provider,
            },
          };

        case "turn_start":
          return {
            isRunning: true,
            messages: [
              ...state.messages,
              {
                id: `turn-${event.turn_number}`,
                role: "assistant",
                content: "",
              },
            ],
          };

        case "text_chunk": {
          if (state.messages.length === 0) return state;
          const messages = [...state.messages];
          const last = { ...messages[messages.length - 1] };
          if (last.role === "assistant") {
            last.content += event.content;
            messages[messages.length - 1] = last;
          }
          return { messages };
        }

        case "reasoning_chunk": {
          if (state.messages.length === 0) return state;
          const messages = [...state.messages];
          const last = { ...messages[messages.length - 1] };
          if (last.role === "assistant") {
            last.reasoning = (last.reasoning || "") + event.content;
            messages[messages.length - 1] = last;
          }
          return { messages };
        }

        case "tool_call_start":
          return {
            messages: [
              ...state.messages,
              {
                id: `tool-${event.call_id}`,
                role: "tool",
                content: "",
                toolCall: {
                  tool: event.tool,
                  arguments: event.arguments,
                },
              },
            ],
          };

        case "tool_call_result":
          return {
            messages: state.messages.map((msg) =>
              msg.id === `tool-${event.call_id}`
                ? {
                    ...msg,
                    toolCall: {
                      ...msg.toolCall!,
                      output: event.output,
                      isError: event.is_error,
                      durationMs: event.duration_ms,
                    },
                  }
                : msg
            ),
          };

        case "tool_approval_request":
          return {
            pendingApproval: {
              approvalId: event.approval_id,
              tool: event.tool,
              arguments: event.arguments,
              description: event.description,
            },
          };

        case "usage_update":
          return {
            usage: {
              inputTokens: event.input_tokens,
              outputTokens: event.output_tokens,
              contextPercent: event.context_percent,
            },
          };

        case "turn_end":
          return { isRunning: false };

        case "error":
          return {
            isRunning: false,
            messages: [
              ...state.messages,
              {
                id: `err-${Date.now()}`,
                role: "system",
                content: `Error [${event.code}]: ${event.message}`,
              },
            ],
          };

        default:
          return state;
      }
    }),
}));
