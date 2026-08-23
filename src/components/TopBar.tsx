import { type CSSProperties, useEffect, useRef, useState } from "react";
import { chapters, sections } from "../content/chapters";
import type { TutorialSection } from "../content/types";
import { ChevronDown, GithubIcon, ReactMark } from "./icons";

interface TopBarProps {
  section: TutorialSection;
}

export function TopBar({ section }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const activeSectionRef = useRef<HTMLAnchorElement>(null);
  const activeIndex = sections.findIndex(
    (item) => item.chapter === section.chapter && item.slug === section.slug,
  );
  const progress = `${((activeIndex + 1) / sections.length) * 100}%`;

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeMenu);
    return () => document.removeEventListener("pointerdown", closeMenu);
  }, []);

  useEffect(() => {
    if (menuOpen) activeSectionRef.current?.scrollIntoView({ block: "nearest" });
  }, [menuOpen]);

  return (
    <header className="topbar">
      <a className="brand" href="#/chapter/1/hello-world" aria-label="React Quickly Live home">
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
            <div className="menu-heading">
              <p className="menu-label">Tutorial contents</p>
              <span>{sections.length} sections</span>
            </div>
            <div className="chapter-menu-scroll">
              {chapters.map((chapter) => (
                <section className="menu-chapter" key={chapter.number}>
                  <header className="menu-chapter-heading">
                    <span>{String(chapter.number).padStart(2, "0")}</span>
                    <strong>{chapter.title}</strong>
                  </header>
                  <div className="menu-sections">
                    {chapter.sections.map((item) => {
                      const active = item.chapter === section.chapter && item.slug === section.slug;
                      return (
                        <a
                          className={`menu-section ${active ? "active" : ""}`}
                          href={`#/chapter/${item.chapter}/${item.slug}`}
                          key={item.slug}
                          onClick={() => setMenuOpen(false)}
                          ref={active ? activeSectionRef : undefined}
                          aria-current={active ? "page" : undefined}
                        >
                          <span>{item.title}</span><small>{item.slug}</small>
                          {active ? <i className="active-dot" aria-hidden="true" /> : null}
                        </a>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </nav>

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
