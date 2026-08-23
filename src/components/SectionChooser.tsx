import { useEffect, useRef } from "react";
import { chapters, sections } from "../content/chapters";
import type { TutorialSection } from "../content/types";

interface SectionChooserProps {
  section: TutorialSection;
  open: boolean;
  onClose: () => void;
}

export function SectionChooser({ section, open, onClose }: SectionChooserProps) {
  const activeSectionRef = useRef<HTMLAnchorElement>(null);
  const chooserRef = useRef<HTMLElement>(null);

  useEffect(() => {
    activeSectionRef.current?.scrollIntoView({ block: "nearest" });
  }, [section.chapter, section.slug]);

  useEffect(() => {
    if (!open) return;
    if (window.matchMedia("(max-width: 960px)").matches) chooserRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  return (
    <>
      <button
        className={`section-chooser-backdrop ${open ? "visible" : ""}`}
        type="button"
        aria-label="Close tutorial contents"
        onClick={onClose}
      />
      <nav
        className={`section-chooser ${open ? "open" : ""}`}
        aria-label="Tutorial contents"
        id="sectionChooser"
        ref={chooserRef}
        tabIndex={-1}
      >
        <header className="section-chooser-heading">
          <div>
            <p>Tutorial contents</p>
            <span>{sections.length} sections</span>
          </div>
          <button type="button" aria-label="Hide tutorial contents" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="section-chooser-scroll">
          {chapters.map((chapter) => (
            <section className="chooser-chapter" key={chapter.number}>
              <header className="chooser-chapter-heading">
                <span>{String(chapter.number).padStart(2, "0")}</span>
                <strong>{chapter.title}</strong>
              </header>
              <div className="chooser-sections">
                {chapter.sections.map((item) => {
                  const active = item.chapter === section.chapter && item.slug === section.slug;
                  return (
                    <a
                      className={`chooser-section ${active ? "active" : ""}`}
                      href={`#/chapter/${item.chapter}/${item.slug}`}
                      key={item.slug}
                      onClick={onClose}
                      ref={active ? activeSectionRef : undefined}
                      aria-current={active ? "page" : undefined}
                    >
                      <span>{item.title}</span>
                      <small>{item.slug}</small>
                      {active ? <i className="active-dot" aria-hidden="true" /> : null}
                    </a>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </nav>
    </>
  );
}
