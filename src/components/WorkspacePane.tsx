import { useState } from "react";
import type { TutorialSection } from "../content/types";
import { EditorPane } from "./EditorPane";
import { FileExplorer } from "./FileExplorer";

export function WorkspacePane({ section }: { section: TutorialSection }) {
  const [explorerOpen, setExplorerOpen] = useState(true);

  return (
    <section
      className={`panel workspace-panel ${explorerOpen ? "" : "explorer-collapsed"}`}
      aria-label="Code workspace"
    >
      {explorerOpen ? (
        <FileExplorer section={section} onCollapse={() => setExplorerOpen(false)} />
      ) : null}
      <EditorPane
        section={section}
        explorerOpen={explorerOpen}
        onExpandExplorer={() => setExplorerOpen(true)}
      />
    </section>
  );
}
