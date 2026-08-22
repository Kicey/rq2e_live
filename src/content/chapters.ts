import { rq13Steps } from "./ch13/rq13-steps/section";
import type { TutorialSection } from "./types";

export const sections: TutorialSection[] = [rq13Steps];

export function getSection(chapter: string, slug: string): TutorialSection | undefined {
  return sections.find(
    (section) => String(section.chapter) === chapter && section.slug === slug,
  );
}
