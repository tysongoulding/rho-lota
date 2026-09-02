import { MessageItem as MessageItemType } from "../../store/sessionStore";
import { ThinkingBlock } from "./ThinkingBlock";
import { ToolCallBlock } from "./ToolCallBlock";
import { CodeBlock } from "./CodeBlock";
import { DiffViewer } from "./DiffViewer";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface MessageItemProps {
  message: MessageItemType;
}

export function MessageItem({ message }: MessageItemProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end my-1">
        <div className="bg-[#1f6feb] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] text-xs md:text-sm whitespace-pre-wrap leading-relaxed shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.role === "tool" && message.toolCall) {
    const isEditTool = message.toolCall.tool === "edit";
    const args = message.toolCall.arguments;

    if (
      isEditTool &&
      typeof args.target_content === "string" &&
      typeof args.replacement_content === "string"
    ) {
      return (
        <div className="my-2">
          <ToolCallBlock toolCall={message.toolCall} />
          <DiffViewer
            filePath={typeof args.file_path === "string" ? args.file_path : undefined}
            targetContent={args.target_content}
            replacementContent={args.replacement_content}
            startLine={typeof args.start_line === "number" ? args.start_line : 1}
          />
        </div>
      );
    }

    return <ToolCallBlock toolCall={message.toolCall} />;
  }

  if (message.role === "system") {
    return (
      <div className="my-2 p-2.5 rounded-lg bg-red-950/30 border border-red-900/50 text-red-300 text-xs font-mono">
        {message.content}
      </div>
    );
  }

  return (
    <div className="flex justify-start my-1 w-full">
      <div className="w-full bg-[#161b22] border border-[#30363d] rounded-2xl rounded-tl-sm p-4 text-xs md:text-sm text-[#c9d1d9] shadow-sm">
        {message.reasoning && <ThinkingBlock reasoning={message.reasoning} />}
        <div className="prose prose-invert prose-sm max-w-none break-words leading-relaxed">
          <Markdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ className, children }) {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match && !String(children).includes("\n");
                return (
                  <CodeBlock
                    inline={isInline}
                    language={match ? match[1] : "text"}
                    code={String(children).replace(/\n$/, "")}
                  />
                );
              },
            }}
          >
            {message.content}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
