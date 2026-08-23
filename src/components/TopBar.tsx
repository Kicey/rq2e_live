import { type CSSProperties } from "react";
import { sections } from "../content/chapters";
import type { TutorialSection } from "../content/types";
import { GithubIcon, ReactMark, SidebarIcon } from "./icons";

interface TopBarProps {
  section: TutorialSection;
  sectionChooserOpen: boolean;
  onToggleSectionChooser: () => void;
}

export function TopBar({ section, sectionChooserOpen, onToggleSectionChooser }: TopBarProps) {
  const activeIndex = sections.findIndex(
    (item) => item.chapter === section.chapter && item.slug === section.slug,
  );
  const progress = `${((activeIndex + 1) / sections.length) * 100}%`;

  return (
    <header className="topbar">
      <div className="brand-group">
        <button
          className="sections-toggle"
          type="button"
          aria-label={sectionChooserOpen ? "Hide tutorial contents" : "Show tutorial contents"}
          aria-expanded={sectionChooserOpen}
          aria-controls="sectionChooser"
          onClick={onToggleSectionChooser}
        >
          <SidebarIcon />
        </button>
        <a className="brand" href="#/chapter/1/hello-world" aria-label="React Quickly Live home">
          <span className="brand-mark"><ReactMark /></span>
          <span className="brand-title">React Quickly</span>
          <span className="brand-live">live</span>
        </a>
      </div>

      <div className="lesson-crumbs" aria-label="Current lesson">
        <span className="chapter-label">Chapter {section.chapter}</span>
        <span className="crumb-separator" aria-hidden="true">/</span>
        <span className="section-title">{section.title}</span>
      </div>

      <div className="header-actions">
        <span className="progress-copy">Example <strong>{section.slug}</strong></span>
        <span className="progress-track" aria-hidden="true">
          <span style={{ width: progress } as CSSProperties} />
        </span>
        <a className="source-link" href={section.sourceUrl} target="_blank" rel="noreferrer" aria-label="View this example in the source repository">
          <GithubIcon />
        </a>
      </div>
    </header>
  );
}
