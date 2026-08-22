import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { getSection } from "../content/chapters";
import { TutorialWorkspace } from "../components/TutorialWorkspace";

function TutorialRoute() {
  const { chapter = "", slug = "" } = useParams();
  const section = getSection(chapter, slug);

  if (!section) return <Navigate to="/chapter/13/rq13-steps" replace />;
  return <TutorialWorkspace section={section} />;
}

export function App() {
  return (
    <Routes>
      <Route path="/chapter/:chapter/:slug" element={<TutorialRoute />} />
      <Route path="*" element={<Navigate to="/chapter/13/rq13-steps" replace />} />
    </Routes>
  );
}
