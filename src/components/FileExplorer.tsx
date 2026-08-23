import { useState, type CSSProperties, type ReactNode } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import type { TutorialSection } from "../content/types";
import { FolderIcon, SidebarIcon, TreeChevron } from "./icons";

interface FileExplorerProps {
  section: TutorialSection;
  onCollapse: () => void;
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

interface FolderRowProps {
  name: string;
  depth: number;
  collapsed: boolean;
  onToggle: () => void;
}

function FolderRow({ name, depth, collapsed, onToggle }: FolderRowProps) {
  return (
    <button
      className={`folder-row ${collapsed ? "collapsed" : ""}`}
      type="button"
      style={{ "--tree-depth": depth } as CSSProperties}
      aria-label={`${name} folder`}
      aria-expanded={!collapsed}
      onClick={onToggle}
    >
      <TreeChevron className="chevron" />
      <FolderIcon className="folder-icon" />
      <span>{name}</span>
    </button>
  );
}

export function FileExplorer({ section, onCollapse }: FileExplorerProps) {
  const { sandpack } = useSandpack();
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(() => new Set());
  const tree = buildTree(section.visibleFiles);

  const toggleFolder = (path: string) => {
    setCollapsedFolders((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

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

  const renderTree = (node: TreeNode, depth: number, parentPath: string): ReactNode => (
    <>
      {node.files.sort().map((path) => renderFile(path, depth))}
      {[...node.folders.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([name, child]) => {
          const folderPath = `${parentPath}/${name}`;
          const collapsed = collapsedFolders.has(folderPath);
          return (
            <div className="tree-group" key={folderPath}>
              <FolderRow
                name={name}
                depth={depth}
                collapsed={collapsed}
                onToggle={() => toggleFolder(folderPath)}
              />
              {collapsed ? null : renderTree(child, depth + 1, folderPath)}
            </div>
          );
        })}
    </>
  );

  const rootPath = section.slug;
  const rootCollapsed = collapsedFolders.has(rootPath);

  return (
    <aside className="file-explorer" aria-labelledby="filesHeading">
      <div className="explorer-heading">
        <h2 id="filesHeading">Explorer</h2>
        <button
          className="explorer-toggle"
          type="button"
          aria-label="Collapse Explorer"
          title="Collapse Explorer"
          onClick={onCollapse}
        >
          <SidebarIcon />
        </button>
      </div>
      <div className="file-tree">
        <FolderRow
          name={section.slug}
          depth={0}
          collapsed={rootCollapsed}
          onToggle={() => toggleFolder(rootPath)}
        />
        {rootCollapsed ? null : renderTree(tree, 1, rootPath)}
      </div>
      <div className="source-path"><span>Source</span><code>{section.sourcePath}</code></div>
    </aside>
  );
}
