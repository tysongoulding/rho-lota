import { useState } from "react";
import { useWorkspaceStore, FileNode } from "../../store/workspaceStore";
import { useUiStore } from "../../store/uiStore";
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  Search,
  Plus,
  Check,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export function WorkspaceExplorer() {
  const { files, workspacePath, gitBranch, attachFile, attachedFiles, selectFile } = useWorkspaceStore();
  const { setWorkbenchOpen, setActiveWorkbenchTab } = useUiStore();
  const [filter, setFilter] = useState("");

  const handleInspect = (node: FileNode) => {
    selectFile({ path: node.path, content: `// Contents of ${node.path}\n// Ready for inspection & editing.` });
    setActiveWorkbenchTab("file");
    setWorkbenchOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto text-xs text-[#c9d1d9]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
            <Folder className="w-4 h-4 text-[#58a6ff]" />
            <span>Workspace File Explorer</span>
          </h2>
          <p className="text-[#8b949e]">
            Browse project hierarchy, inspect files, and attach source context into turns.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] bg-[#161b22] px-2 py-1 rounded border border-[#30363d] text-white">
            Path: {workspacePath} ({gitBranch})
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8b949e]" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter workspace files..."
          className="w-full bg-[#161b22] border border-[#30363d] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* File Tree */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3 select-none">
        <FileTreeList
          nodes={files}
          filter={filter}
          onInspect={handleInspect}
          onAttach={attachFile}
          attachedFiles={attachedFiles}
        />
      </div>
    </div>
  );
}

interface FileTreeListProps {
  nodes: FileNode[];
  filter: string;
  onInspect: (node: FileNode) => void;
  onAttach: (path: string) => void;
  attachedFiles: string[];
}

function FileTreeList({ nodes, filter, onInspect, onAttach, attachedFiles }: FileTreeListProps) {
  return (
    <div className="space-y-0.5 font-mono text-xs">
      {nodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          filter={filter}
          onInspect={onInspect}
          onAttach={onAttach}
          attachedFiles={attachedFiles}
        />
      ))}
    </div>
  );
}

interface FileTreeNodeProps {
  node: FileNode;
  filter: string;
  onInspect: (node: FileNode) => void;
  onAttach: (path: string) => void;
  attachedFiles: string[];
}

function FileTreeNode({ node, filter, onInspect, onAttach, attachedFiles }: FileTreeNodeProps) {
  const [open, setOpen] = useState(true);

  const matchesFilter = filter ? node.path.toLowerCase().includes(filter.toLowerCase()) : true;

  if (node.isDir) {
    const hasMatchingChildren = node.children?.some(
      (c) => c.path.toLowerCase().includes(filter.toLowerCase()) || c.isDir
    );

    if (filter && !matchesFilter && !hasMatchingChildren) {
      return null;
    }

    return (
      <div>
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#21262d] cursor-pointer text-[#8b949e] hover:text-white transition"
        >
          <div className="flex items-center space-x-1.5">
            {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 text-[#484f58]" />}
            {open ? <FolderOpen className="w-3.5 h-3.5 text-blue-400" /> : <Folder className="w-3.5 h-3.5 text-blue-400" />}
            <span className="font-medium text-white">{node.name}</span>
          </div>
        </div>

        {open && node.children && (
          <div className="pl-4 border-l border-[#30363d]/50 ml-2">
            <FileTreeList
              nodes={node.children}
              filter={filter}
              onInspect={onInspect}
              onAttach={onAttach}
              attachedFiles={attachedFiles}
            />
          </div>
        )}
      </div>
    );
  }

  if (filter && !matchesFilter) return null;

  const isAttached = attachedFiles.includes(node.path);

  return (
    <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#21262d] group transition text-[#c9d1d9]">
      <div
        onClick={() => onInspect(node)}
        className="flex items-center space-x-1.5 cursor-pointer truncate flex-1 hover:text-white"
      >
        {node.name.endsWith(".md") ? (
          <FileText className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        ) : (
          <FileCode className="w-3.5 h-3.5 text-[#58a6ff] flex-shrink-0" />
        )}
        <span className="truncate">{node.name}</span>
      </div>

      <div className="flex items-center space-x-2">
        {node.size && (
          <span className="text-[10px] text-[#484f58] hidden group-hover:inline">
            {(node.size / 1024).toFixed(1)}k
          </span>
        )}

        <button
          onClick={() => onAttach(node.path)}
          className={`p-1 rounded text-[10px] transition ${
            isAttached
              ? "bg-green-950/40 text-green-400 border border-green-800/40"
              : "hover:bg-[#30363d] text-[#8b949e] hover:text-white"
          }`}
          title={isAttached ? "Tagged in prompt context" : "Attach @file into prompt"}
        >
          {isAttached ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}
