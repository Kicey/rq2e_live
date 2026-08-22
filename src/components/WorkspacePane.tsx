import type { TutorialSection } from "../content/types";
import { EditorPane } from "./EditorPane";
import { FileExplorer } from "./FileExplorer";

export function WorkspacePane({ section }: { section: TutorialSection }) {
  return (
    <section className="panel workspace-panel" aria-label="Code workspace">
      <FileExplorer section={section} />
      <EditorPane section={section} />
    </section>
  );
}
