export interface TutorialFile {
  code: string;
  hidden?: boolean;
  readOnly?: boolean;
}

export interface TutorialSection {
  chapter: number;
  slug: string;
  title: string;
  heading: string;
  summary: string;
  sourceUrl: string;
  entryFile: string;
  initialFile: string;
  visibleFiles: string[];
  files: Record<string, TutorialFile>;
  dependencies: Record<string, string>;
  externalResources?: string[];
  lesson: string;
}
