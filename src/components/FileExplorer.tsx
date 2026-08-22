import type { CSSProperties } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import type { TutorialSection } from "../content/types";
import { FolderIcon, TreeChevron } from "./icons";

interface FileExplorerProps {
  section: TutorialSection;
}

function fileMeta(path: string) {
  return path.endsWith(".css")
    ? { label: "#", className: "css" }
    : { label: "JS", className: "javascript" };
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
  const rootFiles = section.visibleFiles.filter((path) => path.split("/").length === 3);
  const folders = ["step", "task"];

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

  return (
    <aside className="file-explorer" aria-labelledby="filesHeading">
      <div className="explorer-heading"><h2 id="filesHeading">Explorer</h2></div>
      <div className="file-tree">
        <FolderRow name="rq13-steps" depth={0} />
        <FolderRow name="src" depth={1} />
        {rootFiles.map((path) => renderFile(path, 2))}
        {folders.map((folder) => (
          <div className="tree-group" key={folder}>
            <FolderRow name={folder} depth={2} />
            {section.visibleFiles
              .filter((path) => path.startsWith(`/src/${folder}/`))
              .map((path) => renderFile(path, 3))}
          </div>
        ))}
      </div>
      <div className="source-path"><span>Source</span><code>rq2e/ch13/rq13-steps</code></div>
    </aside>
  );
}
