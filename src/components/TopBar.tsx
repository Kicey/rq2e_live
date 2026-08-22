import { useEffect, useRef, useState } from "react";
import type { TutorialSection } from "../content/types";
import { ChevronDown, GithubIcon, ReactMark } from "./icons";

interface TopBarProps {
  section: TutorialSection;
}

export function TopBar({ section }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeMenu);
    return () => document.removeEventListener("pointerdown", closeMenu);
  }, []);

  return (
    <header className="topbar">
      <a className="brand" href="#/chapter/13/rq13-steps" aria-label="React Quickly Live home">
        <span className="brand-mark"><ReactMark /></span>
        <span className="brand-title">React Quickly</span>
        <span className="brand-live">live</span>
      </a>

      <nav className="lesson-crumbs" aria-label="Current lesson" ref={menuRef}>
        <button
          className="chapter-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="chapterMenu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>Chapter {section.chapter}</span>
          <ChevronDown />
        </button>
        <span className="crumb-separator" aria-hidden="true">/</span>
        <span className="section-title">{section.title}</span>

        {!menuOpen ? null : (
          <div className="chapter-menu" id="chapterMenu">
            <p className="menu-label">Course chapters</p>
            <button className="chapter-option active" type="button" onClick={() => setMenuOpen(false)}>
              <span className="chapter-number">13</span>
              <span><strong>Task manager</strong><small>rq13-steps</small></span>
              <span className="active-dot" aria-hidden="true" />
            </button>
            <div className="coming-soon">
              <span>12</span><span><strong>Routing</strong><small>Previous chapter</small></span>
            </div>
            <div className="coming-soon">
              <span>14</span><span><strong>React ecosystem</strong><small>Coming next</small></span>
            </div>
          </div>
        )}
      </nav>

      <div className="header-actions">
        <span className="progress-copy">Example <strong>{section.slug}</strong></span>
        <span className="progress-track" aria-hidden="true"><span /></span>
        <a className="source-link" href={section.sourceUrl} target="_blank" rel="noreferrer" aria-label="View this example in the source repository">
          <GithubIcon />
        </a>
      </div>
    </header>
  );
}
