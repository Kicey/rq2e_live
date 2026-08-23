import { SandpackCodeEditor, useSandpack } from "@codesandbox/sandpack-react";
import type { TutorialSection } from "../content/types";
import { PlayIcon, RefreshIcon } from "./icons";

interface EditorPaneProps {
  section: TutorialSection;
}

function fileMeta(path: string) {
  if (path.endsWith(".css")) return { label: "#", className: "css", language: "CSS" };
  if (path.endsWith(".html")) return { label: "<>", className: "html", language: "HTML" };
  if (path.endsWith(".json")) return { label: "{}", className: "json", language: "JSON" };
  return { label: "JS", className: "javascript", language: "JavaScript React" };
}

export function EditorPane({ section }: EditorPaneProps) {
  const { sandpack } = useSandpack();
  const activeFile = sandpack.activeFile;
  const meta = fileMeta(activeFile);
  const changed = sandpack.files[activeFile]?.code !== section.files[activeFile]?.code;

  const resetActiveFile = () => {
    const original = section.files[activeFile];
    if (original) sandpack.updateFile(activeFile, original.code);
  };

  return (
    <div className="editor-pane">
      <div className="editor-tabs" role="tablist" aria-label="Open files">
        <button className="editor-tab active" type="button" role="tab" aria-selected="true">
          <span className={`file-type-icon ${meta.className}`}>{meta.label}</span>
          <span>{activeFile.split("/").at(-1)}</span>
          <span className={`tab-change ${changed ? "visible" : ""}`} aria-hidden="true">●</span>
        </button>
        <div className="editor-toolbar">
          <button className="reset-button" type="button" onClick={resetActiveFile}>
            <RefreshIcon /> Reset
          </button>
          <button className="run-button" type="button" onClick={() => sandpack.runSandpack()}>
            <PlayIcon /> Run
          </button>
        </div>
      </div>
      <SandpackCodeEditor
        className="tutorial-code-editor"
        showTabs={false}
        showLineNumbers
        wrapContent={false}
        closableTabs={false}
        showInlineErrors
      />
      <footer className="editor-statusbar">
        <span>{meta.language}</span><span>UTF-8</span><span>Spaces: 2</span>
        <span className="status-location">Sandpack</span>
      </footer>
    </div>
  );
}
