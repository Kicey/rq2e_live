import type { CSSProperties, ReactNode } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import type { TutorialSection } from "../content/types";
import { FolderIcon, TreeChevron } from "./icons";

interface FileExplorerProps {
  section: TutorialSection;
}

function fileMeta(path: string) {
  if (path.endsWith(".css")) return { label: "#", className: "css" };
  if (path.endsWith(".html")) return { label: "<>", className: "html" };
  if (path.endsWith(".json")) return { label: "{}", className: "json" };
  return { label: "JS", className: "javascript" };
}

interface TreeNode {
  files: string[];
  folders: Map<string, TreeNode>;
}

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = { files: [], folders: new Map() };
  for (const path of paths) {
    const segments = path.replace(/^\//, "").split("/");
    const filename = segments.pop();
    let node = root;
    for (const segment of segments) {
      if (!node.folders.has(segment)) {
        node.folders.set(segment, { files: [], folders: new Map() });
      }
      node = node.folders.get(segment)!;
    }
    if (filename) node.files.push(path);
  }
  return root;
}

function FolderRow({ name, depth }: { name: string; depth: number }) {
  return (
    <div className="folder-row" style={{ "--tree-depth": depth } as CSSProperties}>
      <TreeChevron className="chevron" />
      <FolderIcon className="folder-icon" />
      <span>{name}</span>
    </div>
  );
}

export function FileExplorer({ section }: FileExplorerProps) {
  const { sandpack } = useSandpack();
  const tree = buildTree(section.visibleFiles);

  const renderFile = (path: string, depth: number) => {
    const meta = fileMeta(path);
    const currentCode = sandpack.files[path]?.code ?? "";
    const changed = currentCode !== section.files[path]?.code;
    const active = sandpack.activeFile === path;

    return (
      <button
        className={`file-row ${active ? "active" : ""} ${changed ? "edited" : ""}`}
        type="button"
        style={{ "--tree-depth": depth } as CSSProperties}
        aria-current={active ? "page" : undefined}
        onClick={() => sandpack.setActiveFile(path)}
        key={path}
      >
        <span className={`file-type-icon ${meta.className}`}>{meta.label}</span>
        <span className="file-name">{path.split("/").at(-1)}</span>
        <span className="edited-indicator" aria-label="Unsaved changes" />
      </button>
    );
  };

  const renderTree = (node: TreeNode, depth: number): ReactNode => (
    <>
      {node.files.sort().map((path) => renderFile(path, depth))}
      {[...node.folders.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([name, child]) => (
          <div className="tree-group" key={`${depth}-${name}`}>
            <FolderRow name={name} depth={depth} />
            {renderTree(child, depth + 1)}
          </div>
        ))}
    </>
  );

  return (
    <aside className="file-explorer" aria-labelledby="filesHeading">
      <div className="explorer-heading"><h2 id="filesHeading">Explorer</h2></div>
      <div className="file-tree">
        <FolderRow name={section.slug} depth={0} />
        {renderTree(tree, 1)}
      </div>
      <div className="source-path"><span>Source</span><code>{section.sourcePath}</code></div>
    </aside>
  );
}
