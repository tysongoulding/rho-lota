import { MessageItem as MessageItemType } from "../../store/sessionStore";
import { ThinkingBlock } from "./ThinkingBlock";
import { ToolCallBlock } from "./ToolCallBlock";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageItemProps {
  message: MessageItemType;
}

export function MessageItem({ message }: MessageItemProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end my-2">
        <div className="bg-[#1f6feb] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] text-xs md:text-sm whitespace-pre-wrap leading-relaxed shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.role === "tool" && message.toolCall) {
    return <ToolCallBlock toolCall={message.toolCall} />;
  }

  if (message.role === "system") {
    return (
      <div className="my-2 p-2.5 rounded bg-red-950/30 border border-red-900/50 text-red-300 text-xs font-mono">
        {message.content}
      </div>
    );
  }

  return (
    <div className="flex justify-start my-2 w-full">
      <div className="w-full bg-[#161b22] border border-[#30363d] rounded-2xl rounded-tl-sm p-4 text-xs md:text-sm text-[#c9d1d9] shadow-sm">
        {message.reasoning && <ThinkingBlock reasoning={message.reasoning} />}
        <div className="prose prose-invert prose-sm max-w-none break-words leading-relaxed">
          <Markdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
