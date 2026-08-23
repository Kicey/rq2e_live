export interface TutorialFile {
  code: string;
  hidden?: boolean;
  readOnly?: boolean;
}

export type TutorialTemplate = "react" | "static";
export type TutorialRuntime = "direct" | "adapted" | "network";

export interface TutorialSectionMeta {
  chapter: number;
  chapterTitle: string;
  slug: string;
  title: string;
  heading: string;
  summary: string;
  sourcePath: string;
  sourceUrl: string;
  template: TutorialTemplate;
  runtime: TutorialRuntime;
  entryFile: string;
  initialFile: string;
  dependencies: Record<string, string>;
}

export interface TutorialSection extends TutorialSectionMeta {
  visibleFiles: string[];
  files: Record<string, TutorialFile>;
  externalResources?: string[];
  lesson: string;
}

export interface TutorialChapter {
  number: number;
  title: string;
  sections: TutorialSectionMeta[];
}
