import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { chapters, getSection, loadSection } from "../content/chapters";
import type { TutorialSection } from "../content/types";
import { TutorialWorkspace } from "../components/TutorialWorkspace";

const firstSection = chapters[0]?.sections[0];
const defaultSectionPath = firstSection
  ? `/chapter/${firstSection.chapter}/${firstSection.slug}`
  : "/chapter/1/hello-world";

function TutorialRoute() {
  const { chapter = "", slug = "" } = useParams();
  const meta = getSection(chapter, slug);
  const sectionKey = `${chapter}/${slug}`;
  const [loaded, setLoaded] = useState<{ key: string; section: TutorialSection }>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!meta) return;
    let active = true;
    setError(undefined);
    loadSection(meta)
      .then((section) => {
        if (active) setLoaded({ key: sectionKey, section });
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : String(reason));
      });
    return () => {
      active = false;
    };
  }, [meta, sectionKey]);

  if (!meta) return <Navigate to={defaultSectionPath} replace />;
  if (error) {
    return (
      <main className="section-state section-error">
        <p>Could not load {meta.slug}</p><code>{error}</code>
      </main>
    );
  }
  if (!loaded || loaded.key !== sectionKey) {
    return (
      <main className="section-state" role="status">
        <span className="section-loader" aria-hidden="true" />
        <p>Loading {meta.title}</p>
      </main>
    );
  }
  return <TutorialWorkspace section={loaded.section} />;
}

export function App() {
  return (
    <Routes>
      <Route path="/chapter/:chapter/:slug" element={<TutorialRoute />} />
      <Route path="*" element={<Navigate to={defaultSectionPath} replace />} />
    </Routes>
  );
}
