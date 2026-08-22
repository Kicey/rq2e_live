import { useEffect, useRef } from "react";
import { SandpackProvider, useSandpack } from "@codesandbox/sandpack-react";
import type { TutorialSection } from "../content/types";
import { useResizablePanes } from "../hooks/useResizablePanes";
import { LessonPane } from "./LessonPane";
import { PreviewPane } from "./PreviewPane";
import { TopBar } from "./TopBar";
import { WorkspacePane } from "./WorkspacePane";

function TutorialLayout({ section }: { section: TutorialSection }) {
  const { startResize } = useResizablePanes("tutorialShell");
  const { sandpack } = useSandpack();
  const initialRunStarted = useRef(false);

  useEffect(() => {
    if (initialRunStarted.current) return;
    initialRunStarted.current = true;
    sandpack.runSandpack();
  }, [sandpack]);

  useEffect(() => {
    const runFromKeyboard = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        sandpack.runSandpack();
      }
    };
    document.addEventListener("keydown", runFromKeyboard);
    return () => document.removeEventListener("keydown", runFromKeyboard);
  }, [sandpack]);

  return (
    <>
      <TopBar section={section} />
      <main className="tutorial-shell" id="tutorialShell">
        <PreviewPane />
        <div
          className="resize-handle resize-vertical"
          role="separator"
          aria-label="Resize preview and editor"
          aria-orientation="vertical"
          onPointerDown={startResize("vertical")}
        />
        <WorkspacePane section={section} />
        <div
          className="resize-handle resize-horizontal"
          role="separator"
          aria-label="Resize lesson notes"
          aria-orientation="horizontal"
          onPointerDown={startResize("horizontal")}
        />
        <LessonPane section={section} />
      </main>
    </>
  );
}

export function TutorialWorkspace({ section }: { section: TutorialSection }) {
  return (
    <SandpackProvider
      key={section.slug}
      template="react"
      theme="dark"
      files={section.files}
      customSetup={{ entry: section.entryFile, dependencies: section.dependencies }}
      options={{
        activeFile: section.initialFile,
        visibleFiles: section.visibleFiles,
        autorun: false,
        externalResources: section.externalResources,
        recompileMode: "immediate",
      }}
    >
      <TutorialLayout section={section} />
    </SandpackProvider>
  );
}
