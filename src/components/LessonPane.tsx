import ReactMarkdown from "react-markdown";
import type { TutorialSection } from "../content/types";

export function LessonPane({ section }: { section: TutorialSection }) {
  return (
    <section className="lesson-panel" aria-labelledby="lessonTitle">
      <article className="lesson-content">
        <header className="lesson-heading">
          <p className="lesson-eyebrow">Chapter {section.chapter} · {section.slug}</p>
          <h2 id="lessonTitle">{section.heading}</h2>
          <p className="lesson-summary">{section.summary}</p>
        </header>
        <div className="lesson-explanation">
          <ReactMarkdown>{section.lesson}</ReactMarkdown>
        </div>
      </article>
    </section>
  );
}
